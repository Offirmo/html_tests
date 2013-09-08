if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(
[
	'chai',
	'offirmo/restlink/restlink_server',
	'offirmo/restlink/server_internals/adapters/direct',
	'offirmo/restlink/request',
	'offirmo/utils/http_constants',
	'mocha'
],
function(chai, CUT, DirectServerAdapter, Request, http_constants) {
	"use strict";

	var expect = chai.expect;
	chai.should();
	chai.Assertion.includeStack = true; // defaults to false

	var test_request = Request.make_new();
	test_request.method = 'BREW';
	test_request.uri = '/stanford/teapot';

	describe('Restlink server', function() {

		describe('instantiation', function() {

			it('should be instantiable', function() {
				var out = CUT.make_new();
				out.should.exist;
				out.should.be.an('object');
			});

			it('should set default values', function() {
				var out = CUT.make_new();
				out.is_started().should.be.false;
				out.get_denomination().should.equal("Anonymous");
			});

		}); // describe feature

		describe('startup / shutdown', function() {

			it('should work', function() {
				var out = CUT.make_new();

				out.is_started().should.be.false;
				out.startup();
				out.is_started().should.be.true;
				out.shutdown();
				out.is_started().should.be.false;
			});

		}); // describe feature

		describe('adapters interface', function() {

			it('should allow insertion and correctly propagate startup/shutdown', function() {
				var adapter_started = false;
				var fake_adapter = {
					startup : function() {
						adapter_started = true;
					},
					shutdown : function() {
						adapter_started = false;
					}
				};
				var out = CUT.make_new();

				out.startup();
				adapter_started.should.be.false;
				out.add_adapter(fake_adapter);
				adapter_started.should.be.true;
				out.shutdown();
				adapter_started.should.be.false;
			});

			it('should work', function(signalAsyncTestFinished) {
				var out = CUT.make_new();
				// let's try the direct adapter
				var direct_adapter = DirectServerAdapter.make_new();
				out.add_adapter(direct_adapter);

				out.startup();


				var client = direct_adapter.new_connection();

				// go for it
				var promise = client.send_request(test_request);

				// check result : should 404 but not 500
				promise.done(function(response){
					response.method.should.equal('BREW');
					response.uri.should.equal('/stanford/teapot');
					response.return_code.should.equal(http_constants.status_codes.status_404_client_error_not_found);
					response.content.should.equal("Not Found");
					signalAsyncTestFinished();
				});
				promise.fail(function(response){
					expect(false).to.be.ok;
				});

			});

		}); // describe feature

		describe('request handling', function() {

			it('should be configurable', function() {
				xxx
			});

			it('should work', function() {
				xxx
			});

		}); // describe feature

	}); // describe CUT
}); // requirejs module
