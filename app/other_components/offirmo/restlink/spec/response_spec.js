if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(
[
	'chai',
	'offirmo/restlink/response',
	'offirmo/restlink/request',
	'offirmo/utils/http_constants',
	'mocha'
],
function(chai, CUT, Request, http_constants) {
	"use strict";

	var expect = chai.expect;
	chai.should();
	chai.Assertion.includeStack = true; // defaults to false

	describe('Restlink Response', function() {

		describe('instantiation', function() {

			it('should work', function() {
				var out = CUT.make_new();
				out.should.exist;
				out.should.be.an('object');
			});

			it('should set default values', function() {
				var out = CUT.make_new();

				out.return_code.should.equal(http_constants.status_codes.status_500_server_error_internal_error);
			});

			it('should be instantiable from a request (basic)', function() {
				var request = Request.make_new();
				request.method = 'BREW';
				request.uri = '/stanford/teapot';

				// basic version
				var out = CUT.make_new_from_request(request);
				//console.log(out);
				out.method.should.equal('BREW');
				out.uri.should.equal('/stanford/teapot');
				out.return_code.should.equal(http_constants.status_codes.status_500_server_error_internal_error);
				out.meta.should.deep.equal({});
				expect(out.content).to.be.undefined;
			});

			it('should be instantiable from a request (advanced)', function() {
				var request = Request.make_new();
				request.method = 'BREW';
				request.uri = '/stanford/teapot';

				// more advanced version
				var out = CUT.make_new_from_request(request, {
					return_code: http_constants.status_codes.status_400_client_error_bad_request,
					content: "I'm a teapot !",
					meta: { 'version': 12 }
				});
				//console.log(out2);
				out.method.should.equal('BREW');
				out.uri.should.equal('/stanford/teapot');
				out.return_code.should.equal(http_constants.status_codes.status_400_client_error_bad_request);
				out.meta.should.deep.equal({ 'version': 12 });
				out.content.should.equal("I'm a teapot !");
			});

		}); // describe feature

		describe('utilities', function() {

			it('should provide convenient fluid setters', function() {
				var request = Request.make_new();
				request.method = 'BREW';
				request.uri = '/stanford/teapot';

				// more advanced version
				var out = CUT.make_new_from_request(request).with_status(400).with_content("Dude, I'm a teapot !").with_meta({ 'traceroute': true });

				out.method.should.equal('BREW');
				out.uri.should.equal('/stanford/teapot');
				out.return_code.should.equal(http_constants.status_codes.status_400_client_error_bad_request);
				out.content.should.equal("Dude, I'm a teapot !");
				out.meta.should.deep.equal({ 'traceroute': true });
			});

		}); // describe feature

	}); // describe CUT
}); // requirejs module
