#!/usr/bin/env node

/** State of the art web server serving an advanced AngularJS single-page web app
 */
'use strict';


/************************************************************************/
console.log('Hello world from web server !');

require('./globals');

var _ = require('lodash');
var path = require('path');

var middleware = require('./middlewares');
var app = require('./express-app');
var utils = require('./utils');
//var logger = require('../../logger')();

var config = require('./config');
console.log('config :', config);


/************************************************************************/
// manual creation of the http server
// in order to use domainMiddleware
// cf. http://expressjs.com/4x/api.html#app.listen
var server = require('http').createServer(app);


/************************************************************************/
// https://www.npmjs.org/package/express-livereload
// (install itself in all env except production)
require('express-livereload')(app, {
	watchDir:  process.cwd(), // and not just 'public'
	// https://github.com/napcs/node-livereload#api-options
	debug: true,
	port: config.livereload_port,
	exts: [ 'dust', 'html', 'css', 'js', 'png', 'gif', 'jpg' ],
	exclusions: [ 'bower_components', 'other_components', './*' ]
});


/********************************** Middlewares **************************************/

// top
app.use(middleware.using_domains({
	server: server,
	killTimeout: config.kill_timeout_s * 1000
}));

app.use(middleware.logging('dev'));

// Typically this middleware will come very early in your stack (maybe even first)
// to avoid processing any other middleware if we already know the request is for /favicon.ico
app.use(middleware.serving_favicon('../../client/favicon.ico'));

// then static files which doesn't require special processing
// Note : if using a reverse proxy, should never match so may be moved at bottom (or completely removed)
app.use(middleware.serving_static_files(path.join(__dirname, 'public')));
app.use(middleware.serving_static_files(path.join(__dirname, '../../client')));

// now that we've passed static data which may be CDN'd or served by a reverse proxy,
// add the X-Response-Time header to our responses
app.use(middleware.adding_XResponseTime_header());

// detect and pick the best locale
app.use(middleware.detecting_best_locale(config.supported_locales));


//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());

//  It is very important that this module is used before any module
// that needs to know the method of the request
//app.use(require('method-override')()); // https://github.com/expressjs/method-override

// "express debug toolbar"
// https://github.com/devoidfury/express-debug
require('express-debug')(app, {/* settings */});



/********************************** routes **************************************/

app.get('/', function (req, res) {
	res.render('index', { tpl: 'index', title: 'Express', lang: req.locale });
});

app.get('/page1', function (req, res) {
	res.render('page1', { tpl: 'page1', title: 'Express', lang: req.locale });
});

app.get('/page2', function (req, res) {
	res.render('page2', { tpl: 'page2', title: 'Express', lang: req.locale });
});

app.get('/runtime_error', function (req, res) {
	// bad
	res.send(500, 'something blew up ! (handled from the middleware, error handlers not used)');
});

app.get('/sync_error', function (req, res) {
	throw new Error('An exception thrown synchronously !');
});

app.get('/async_error', function (req, res) {
	setTimeout(function() {
		throw new Error('An exception thrown asynchronously !');
	}, 0);
});

app.get('/timeout', function (req, res) {
	// do nothing and let a timeout happen (hopefully)...
});
app.get('/timeout/:duration_in_sec', function (req, res) {
	var timeout = Number(req.params.duration_in_sec);
	if(_.isNaN(timeout)) {
		var err = new Error('You must provide a number in second !');
		err.status = 500;
		throw err;
	}
	else {
		setTimeout(function() {
			res.send(200, 'I waited ' + req.params.duration_in_sec + ' second(s).');
		}, timeout*1000);
	}
});

app.get("/locale_test", function(req, res) {
	res.header("Content-Type", "text/plain");
	res.send(
		"You asked for: " + req.headers['accept-language'] + "\n" +
		"We support: " + config.supported_locales + "\n" +
		"Our default is: " + locale.Locale['default'] + "\n" +
		"The best match is: " + req.locale + "\n"
	);
});


app.get('/toto/', function (req, res) {
	res.send('correct /toto/ !');
});

// "catch all" = default / 404 for a webapp
// https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode
// http://briantford.com/blog/angular-express
// Several cases :
// - a 404
//   - manual, visible (user mistyped a page url, old address...)
//   - internal (API, auto fetch of rsrc, non page-rsrc...)
// - a correct page, but unknown from the server since will be resolved client-side by ui-router
app.get('*', function (req, res) {
	console.log('fallback "catch all" route triggered for url "' + req.url + '"');

	// so what ?
	if(utils.is_internal_request(req)) {
		// Will not be seen by the user.
		// Respond the best we can.
		res.status(404); // anyway
		if (req.accepts('json'))
			return res.send({ error: 'Not found (as json)' });
		else
			return res.type('txt').send('Not found (as text)');
	}

	// ok, most likely a user browsing.
	// is it a full page or just an asset ?
	// (we don't want to costly render a template just for a missing favicon)
	if(req.url.slice(-4).indexOf('.') !== -1) {
		// there is a . (dot) in the last 4 chars,
		// most likely an file extension
		// so it must be an asset since our clean page urls don't have extensions.
		res.status(404); // anyway
		return res.send('404'); // short answer
	}

	// OK, must be a client-side state/page
	// answer with index, client-side will handle the rest (including true 404)
	console.log('defaulting to webapp root for url "' + req.url + '"');
	res.render('app', { tpl: 'app', title: 'Express', lang: req.locale });
	//res.sendFile('index.html', {root: './public'});
});


// Since this is the last non-error-handling middleware use()d,
// we assume 404, as nothing else responded.
// 404 was already handled in a webapp case,
// but we may keep this handling in case "webapp mode" is deactivated.
app.use(function(req, res, next) {
	console.log('404 handler :', req.url);

	// we want to explain the user what happened,
	// provided it was really a user request...
	res.status(404); // anyway

	if(utils.is_internal_request(req)) {
		// Will not be seen by the user.
		// Respond the best we can.
		if (req.accepts('json'))
			return res.send({ error: 'Not found (as json)' });
		else
			return res.type('txt').send('Not found (as text)');
	}

	// ok, most likely a user browsing.
	// is it a full page or just an asset ?
	// (we don't want to costly render a template just for a missing favicon)
	if(req.url.slice(-4).indexOf('.') !== -1) {
		// there is a . (dot) in the last 4 chars,
		// most likely an file extension
		// so it must be an asset since our clean page urls don't have extensions.
		return res.send('404'); // short answer
	}

	// eventually
	return res.render('404', { tpl: '404', url: req.url, lang: req.locale });
	// if rendering fail, will go to error handler.
});


/************************************************************************/
// error handling at the end
// "Though not mandatory error-handling middleware are typically defined very last,
//  below any other app.use() calls"
// http://stackoverflow.com/questions/6528876/how-to-redirect-404-errors-to-a-page-in-expressjs
app.use(function (err, req, res, next) {
	console.log('1st error handler', err, err['stack']);
	//logger.exception(err);

	// so we have an error. Do we have a status ?
	var status = err.status || 500;
	// (todo validate err.status)
	res.status(status);

	if(utils.is_internal_request(req)) {
		// Will not be seen by the user.
		// Respond the best we can.
		if (req.accepts('json'))
			return res.send({ error: 'server error : ' + status + ' (as json)' });
		else
			return res.type('txt').send('server error : ' + status + ' (as text)');
	}

	// ok, most likely a user browsing.
	// is it a full page or just an asset ?
	// (we don't want to costly render a template just for a missing favicon)
	if(req.url.slice(-4).indexOf('.') !== -1) {
		// there is a . (dot) in the last 4 chars,
		// most likely an file extension
		// so it must be an asset since our clean page urls don't have extensions.
		return res.send('error'); // short answer
	}

	// eventually
	try {
		res.render('error', { tpl: 'error', error: err });
	}
	catch(e) {
		console.error('The error template didn´t work :', e);
		res.send(500, 'Something broke and the nice error template didn´t work !');
	}
});



/************************************************************************/
server.listen(config.listening_port, function() {
	console.log('* Now listening on :');
	_.forEach(utils.get_local_ips(), function(ip) {
		console.log('  http://' + ip + ':' + config.listening_port);
	});
	console.log('(Ctrl+C to stop)');
});
