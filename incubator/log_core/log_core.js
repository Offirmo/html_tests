// if node.js : use amdefine (add it with npm)
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define([
	'underscore'
],
function(_) {
	'use strict';

	var DEFAULT_LOGGER_ID  = 'main';
	var DEFAULT_LEVEL_NAME = 'debug';
	var DEFAULT_LEVEL_RANK = 1;


	// A log line (= log call)
	// with a level and optional tags
	function BaseLogLine(options) {
		options = options || {
			// logger_id
			// default_level
			// level
		};

		// default values
		this.logger_id = options.logger_id || DEFAULT_LOGGER_ID;
		this.level = options.level || options.default_level || {name: DEFAULT_LEVEL_NAME};
		this.tags = [];
		this.args = {};
	}



	// logger core
	// configurable with custom levels
	function LogCore() {
		this.levels = {};
		this.log_sinks = [];

		// default sink func
		/*this.log_sink = function(log_call, args) {
			console.log.apply(console, args);
		};*/

		var log_core = this; // closure

		// custom constructor
		this.LogLine = function() {
			var temp = new BaseLogLine();
			temp.log_core = log_core;
			return temp;
		};
	}

	LogCore.prototype.add_level = function(level) {
		this.levels[level] = this.levels[level] || {name: level};
		this[level] = function(args) {
			console.log('level "%s" direct call on log_line', level);
			var new_log_line = new this.LogLine();
			// save level
			new_log_line.level = this.log_core.levels[level];

			// call log sinks
			if(args)
				this.log_core.log_sink(this, arguments);
			return this;
		};
		this[level] = function() {
			console.log('initiating log call on level call "%s"', level);
			var log_call = this.create_call();
			return log_call[level](arguments);
		};
	};

	LogCore.prototype.add_tag = function(tag) {
		this.tags[tag] = this.tags[tag] || {name: tag};
		this.LogCall.prototype[tag] = function(args) {
			console.log('tag "%s" direct call on log_line', tag, this);
			// save tag
			this.tags.push(this.log_core.tags[tag]);
			// log if needed
			if(args)
				this.log_core.log_sink(this, arguments);
			return this;
		};
		this[tag] = function() {
			console.log('initiating log call on tag call "%s"', tag);
			var log_call = this.create_call();
			return log_call[tag](arguments);
		};
	};

	return {
		create: function() { return new LogCore(); }
	};
});
