#!/usr/bin/env node
'use strict';

// a minimal "hello world" express app

console.log('Hello world !');

var _ = require('underscore');

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

var listening_port = 3000;
var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send('hello world');
});

app.get('/what-if-no-send', function(req, res){
	// nothing
});

next alors que pas de next ?

	next en erreur ?

	double send ?

_.forEach(local_ips, function(ip) {
	console.log('Listening on http://' + ip + ':' + listening_port);
});
console.log('(Ctrl+C to stop)');

app.listen(listening_port);
