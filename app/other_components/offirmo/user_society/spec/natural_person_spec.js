if (typeof define !== 'function') { var define = require('amdefine')(module) }
//if (typeof requirejs !== 'function') { var requirejs = require('requirejs') }


define(
[
	'chai',
	'offirmo/user_society/natural_person',
	'offirmo/user_society/person'
],
function(chai, CUT, CUTParent) {
	"use strict";

	describe('NaturalPerson', function() {

		describe('instantiation', function() {

			it('should be instantiable', function() {
				var person = new CUT();

				person.should.exist;
				person.should.be.an('object');
			});

			it('should have correct inheritance', function() {

				var person = new CUT();

				person.should.be.an.instanceof(CUT);

				person.should.be.an.instanceof(CUTParent);
			});

			it('should set default values', function() {
				var person = new CUT();
				//...
			});

		});

		describe('naturalness', function() {

			it('should be true', function() {
				var person = new CUT();
				person.is_natural().should.be.true;
			});

		});

		describe('moralness', function() {

			it('should be false', function() {
				var person = new CUT();
				person.is_moral().should.be.false;
			});

		});
	});
});
