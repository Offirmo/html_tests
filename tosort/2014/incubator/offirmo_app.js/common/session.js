/* Offirmo App Logical Session
 */
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(
[
	'underscore',
	'base-objects/backbone/base_model',
	'offirmo_app/common/identity'
],
function(_, BaseModel, Identity) {
	"use strict";

	var constants = {
		latest_serialization_version: 1
	};
	Object.freeze(constants);


	var ParentModel = BaseModel;
	//var parentModel_reference_instance = new ParentModel;

	var DefinedModel = ParentModel.extend({

		urlRoot: "/session",

		defaults: function(){
			ParentModel.prototype.defaults.call(this);

			this.set({
				   serialization_version : constants.latest_serialization_version,
				sg_account_id            : undefined,
				sg_current_identity_id   : undefined,
				sg_creation_date         : undefined
			});
		},

		initialize: function(){
			ParentModel.prototype.initialize.call(this);

			//var identity = new Identity();
			//identity.aggregation_parent = this; // TOREVIEW
			//this.current_identity = identity;
		}

	});

	// allow "class member" like access to constants
	DefinedModel.constants = constants;

	// generator
	DefinedModel.make_new = function(optional_attrs) {
		return new DefinedModel(optional_attrs)
	};

	return DefinedModel;
}); // requirejs module
