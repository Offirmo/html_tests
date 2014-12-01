window.main = function()
{
	'use strict';

	// thank you http://patorjk.com/software/taag/#p=display&h=3&v=0&f=Rectangles&t=Rise%20%20of%20%20the%20%20replicators
	console.log('\n\n' +
		' _____ _                  ___      _   _                        _ _         _                \n' +
		'| __  |_|___ ___      ___|  _|    | |_| |_ ___      ___ ___ ___| |_|___ ___| |_ ___ ___ ___  \n' +
		"|    -| |_ -| -_|    | . |  _|    |  _|   | -_|    |  _| -_| . | | |  _| .'|  _| . |  _|_ -| \n" +
		'|__|__|_|___|___|    |___|_|      |_| |_|_|___|    |_| |___|  _|_|_|___|__,|_| |___|_| |___| \n' +
		'                                                           |_|                               \n' +
		' So you are curious ?\n\n ');

	console.log('Starting page main js...');
	requirejs(
		[
			'lodash',
			'webworker_helper',
			//'ng/directives/test',
			'ng/directives/ror/client',
			'ror_worker',
			'angular',
			'angular-ui-router',
			'angular-bootstrap'
		],
		function(_, WebworkerHelper) {
			console.log('main require done.');

			var app = angular.module('App', [
				'ui.bootstrap',
				'test',
				'ror.client'
			]);

			app.controller('LandingCtrl', function($scope, $document) {
				$scope.lang = $document[0].documentElement.lang;
				console.log('detected lang :', $document[0].documentElement.lang);
			});

			// angular manual initialisation since we use a script loader
			// cf. http://docs.angularjs.org/guide/bootstrap
			console.log('Bootstrapping angular...');
			angular.element(document).ready(function() {
				angular.bootstrap(document, ['App']);
			});
		});

	if(false) {
		/*
		var worker = new Worker('ror_worker.js');

		// immediately start listening to worker
		var worker_ready = false;

		function send_to_worker(m) {
			worker.postMessage(m);
			console.log("Msg sent to worker : " + m);
		}

		worker.onerror = function (e) {
			// Log the error message, including worker filename and line number
			console.log("Error at " + e.filename + ":" + e.lineno + ": " + e.message, e);
		};
		worker.onmessage = function (e) {
			//console.log("Msg received from worker : ", e.data);
			if (!worker_ready) {
				worker_ready = true;
				send_to_worker('Hello from page !');
			}

			if (WebworkerHelper.process_log_message(e)) return;

			console.error("Unknown msg received from worker : ", e.data);
		};*/
	}
};
