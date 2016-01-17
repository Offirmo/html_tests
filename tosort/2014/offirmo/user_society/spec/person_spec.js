if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(
[
	'chai',
	'offirmo/user_society/person',
	'mocha'
],
function(chai, CUT) {
	"use strict";

	var expect = chai.expect;
	chai.should();

	describe('Person', function() {

		describe('instantiation', function() {

			it('should be instantiable', function() {
				var out = new CUT();

				out.should.exist;
				out.should.be.an('object');
			});

			it('should set default values', function() {
				var out = new CUT();
				out.get('denomination').should.exist.and.equal('Anonymous');
			});

		});

		describe('naturalness', function() {

			it('should be queriable', function() {
				var out = new CUT();
				out.should.respondTo('is_natural');
			});

			it('should not be available at this level', function() {
				var out = new CUT();
				out.is_natural.should.throw();
			});

		});

		describe('moralness', function() {

			it('should be queriable', function() {
				var out = new CUT();
				out.should.respondTo('is_moral');
			});

			it('should not be available at this level', function() {
				var out = new CUT();
				out.is_moral.should.throw();
			});

		});

		// just to check if properly inherited
		it('should be validated', function() {
			var out = new CUT();

			// o.u.t. still has its default denomination
			out.validate(out.attributes).should.equal('Must have a non-default denomination !');
		});

	});
});
