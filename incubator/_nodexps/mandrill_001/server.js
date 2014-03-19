#!/usr/bin/env node
'use strict';

console.log('Hello world !');

var mandrill = require('node-mandrill')('APuBsI9glGTp_NWThbOLXg'); // this is a test key which doesn't send email
var _ = require('underscore');


mandrill('/messages/send', {
	message: {
		to: [{email: 'offirmo.net@gmail', name: 'Off Neet'}, {email: 'offirmo.net@gmail.com', name: 'Off Neet'}],
		from_email: 'offirmo.net@gmail.com',
		subject: "Hey, what's up?",
		text: "Hello, I sent this message using mandrill."
	}
}, function(error, responses)
{
	//uh oh, there was an error
	if (error) {
		console.error( "XXX ERROR : " + JSON.stringify(error) );
	}
	else {
		if(!_.isArray(responses))
			responses = [ responses ];

		_.forEach(responses, function(response) {
			if (response.status === 'invalid') {
				console.error( "XXX ERROR : ", response );
			}
			else {
				//everything's good, lets see what mandrill said
				console.log("SUCCESS", response);
			}
		});
	}
});
