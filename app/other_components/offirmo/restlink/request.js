/* A REST-like request,
 * to be sent over offirmo RESTlink
 */
if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(
[
	'underscore',
	'offirmo/utils/http_constants'
],
function(_, http_constants) {
	"use strict";

	var Request = {
		make_new: function() {
			return {
				method  : undefined,
				uri     : undefined,
				meta    : {},
				content : undefined,
				make_response: function() {
					return {
						method      : this.method,
						uri         : this.uri,
						return_code : http_constants.status_codes.status_500_server_error_internal_error,
						meta        : {},
						content     : undefined
					};
				}
			};
		}
	};

	return Request;
}); // requirejs module
