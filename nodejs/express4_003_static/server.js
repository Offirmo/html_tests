#!/usr/bin/env node
'use strict';

TODO

console.log('Hello world !');

var _ = require('lodash');

var listening_port = process.env.PORT || 3000;

// http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
// http://nodejs.org/api/os.html#os_os_networkinterfaces
var local_ips = _.chain(require('os').networkInterfaces())
	.flatten()
	.filter(function(val){
		return (val.family === 'IPv4' && val.internal === false);
	})
	.pluck('address')
	.value();



// http://expressjs.com/4x/api.html

var express = require('express');
// + interesting modules
var path = require('path');
var favicon = require('serve-favicon'); // https://github.com/expressjs/serve-favicon
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // https://github.com/expressjs/body-parser


var app = express();
app.set('view engine', 'dust');

app.use(logger('dev'));
app.use(favicon('../../client/misc/favicon_16x16.png'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res){
	res.send('hello world');
});



app.listen(listening_port, function() {
	_.forEach(local_ips, function(ip) {
		console.log('Listening on http://' + ip + ':' + listening_port);
	});
	console.log('(Ctrl+C to stop)');
});
