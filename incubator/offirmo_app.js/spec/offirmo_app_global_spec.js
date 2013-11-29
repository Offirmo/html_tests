/* Top spec on how to use offirmo app
 */
if (typeof define !== 'function') { var define = require('amdefine')(module); }


define(
[
	'chai',
	'underscore',
	'generic_store/generic_store',
	'restlink/server/restlink_server',
	'offirmo_app/server',
	'offirmo_app/client',
	'offirmo_app/client/session_footprint',
	'offirmo_app/server',
	'mocha'
],
function(chai, _, GenericStore, RestlinkServer, OffirmoAppServer, OffirmoAppClient, Footprint, Server) {
	"use strict";

	var expect = chai.expect;
	chai.should();
	chai.Assertion.includeStack = true; // defaults to false


	function build_test_restlink_server(name) {
		// create a restlink server
		var restlink_server = RestlinkServer.make_new();

		// give it a name for debug
		restlink_server.set_denomination(name);

		// add offirmo account handling
		Server.make_new().register_on(restlink_server);

		// start the server
		restlink_server.startup();

		return restlink_server;
	}


	describe('[Integration] Offirmo App', function() {


		describe('simple setup', function() {

			it('should work for a 1st visit', function(signalAsyncTestFinished) {

				/////// SERVER SIDE ///////
				// create a restlink server
				var restlink_server = build_test_restlink_server("test01");


				/////// CLIENT SIDE ///////
				// open a connexion to the server
				var client_connection = restlink_server.open_direct_connection();

				// create a fake local storage for test
				var store = GenericStore.make_new("memory");

				// create a client
				var out = OffirmoAppClient.make_new(client_connection, store);
				// this should automatically trigger session creation / recuperation

				// since there is no previous session, everything is default
				expect( out.logged_in ).to.be.false;
				expect( out.identity.get_denomination() ).to.equal("You");

				// start working
				// first we must wait for session infos to be available (if possible)

			});

			it('should work when coming back', function(signalAsyncTestFinished) {

				/////// SERVER SIDE ///////
				// create a restlink server
				var restlink_server = build_test_restlink_server("test01");


				/////// CLIENT SIDE ///////
				// open a connexion to the server
				var client_connection = restlink_server.open_direct_connection();
				// TODO add previous session

				// create a fake local storage for test
				var store = GenericStore.make_new("memory");
				// populate the store with fake data from a previous visit
				store.set(Footprint.constants.keys.ug_serialization_version,  Footprint.constants.latest_serialization_version);
				store.set(Footprint.constants.keys.ug_last_session_id,        "5678");
				store.set(Footprint.constants.keys.ug_last_session_auth_data, "123456789ABCDEF");

				// create a client
				var out = OffirmoAppClient.make_new(client_connection, store);
				// this should automatically trigger session creation / recuperation

				// now wait for the session to set up
				// since there is no previous session, everything is default
				//expect( out.logged_in ).to.be.false;
				//expect( out.identity.get_denomination() ).to.equal("You");

				// start working
				// first we must wait for session infos to be available (if possible)

			});

		}); // describe feature


		describe('more complete setup', function() {


		}); // describe feature

	}); // describe CUT
}); // requirejs module
