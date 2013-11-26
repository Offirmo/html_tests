/* Offirmo App Logical Session
 */
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(
	[
		'underscore',
		'base-objects/backbone/base_object',
		'offirmo_app/common/identity'
	],
	function(_, BaseModel, Identity) {
		"use strict";

		var constants = {
			latest_serialization_version: 1
		};
		Object.freeze(constants);


		var ParentModel = BaseModel;
		var parentModel_reference_instance = new ParentModel;

		var DefinedModel = ParentModel.extend({

			defaults: function(){
				ParentModel.prototype.defaults.call(this);

				this.set({
					serialization_version: constants.latest_serialization_version,

					user_id: undefined,
					current_identity_id: undefined,

					creation_date: new Date()

				});
			},

			initialize: function(){
				ParentModel.prototype.initialize.call(this);

				this.url = 'session'; //< (backbone) url fragment for this object
				//this.add_validation_fn(...);

				var identity = new Identity();
				identity.aggregation_parent = this;
				this.current_identity = identity;

			}

		});

		// allow "class member" like access to constants
		DefinedModel.constants = constants;

		// generator
		DefinedModel.make_new = function() {
			return new DefinedModel()
		};

		return DefinedModel;
	}); // requirejs module
