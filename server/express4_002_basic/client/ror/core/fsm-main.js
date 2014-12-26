/** Rise of the replicators finite state machine
 * Handled states :
 * -
*/
define(
[
	'lodash',
	'./errors'
],
function(_, Errors) {
	'use strict';

	// attach state callbacks to given fsm
	function extend(server) {

		// shortcuts
		var fsm = server.fsm;
		var logger = server.logger;
		var state = server.state;
		var StateMachine = fsm._.StateMachine;

		fsm.add_state_callback('_waiting_event', function() {
			if(fsm._.pending_actions.length) {
				fsm.action();
				return true;
			}
			else if(fsm._.pending_tick) {
				fsm.tick();
				return true;
			}
			logger.log('will sleep waiting for events...');
			return StateMachine.ASYNC;
		});

		fsm.add_state_callback('_processing_tick', function() {
			if(!fsm._.pending_tick) throw new Error('No tick to process !');

			state.meta.tick_count++;
			logger.log('processing tick #' + state.meta.tick_count +'...');

			// TODO do stuff

			logger.log('tick processed.', state);
			fsm._.pending_tick = false;

			// schedule next tick
			fsm._.schedule_next_tick();
			fsm.tick_handled();
			return true;
		});

		fsm.add_state_callback('_processing_actions', function() {
			if(!fsm._.pending_actions.length) throw new Error('No actions to process !');
			logger.log('processing actions...');

			// no foreach since actions may be appended anytime
			do {
				var action = fsm._.pending_actions.shift();
				process_action(action);
			} while(fsm._.pending_actions.length);

			logger.log('actions processed.');
			fsm.actions_handled();
			return true;
		});

	}


	return {
		extend: extend
	};
});
