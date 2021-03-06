#!/usr/bin/env node
'use strict';

// a minimal "hello world" express app

console.log('Hello world !');

var _ = require('lodash');

// http://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
// http://nodejs.org/api/os.html#os_os_networkinterfaces
var local_ips = _.chain(require('os').networkInterfaces())
	.values()
	.flatten()
	.map('address')
	.value();


// http://expressjs.com/4x/api.html

var listening_port = 3000;
var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send('hello world');
});

_.forEach(local_ips, function(ip) {
	console.log('Listening on http://' + ip + ':' + listening_port);
});
console.log('(Ctrl+C to stop)');

app.listen(listening_port);
