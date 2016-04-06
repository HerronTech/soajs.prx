"use strict";
var request = require("request");

module.exports = {
	requireModule : function (path) {
		return require((process.env.APP_DIR_FOR_CODE_COVERAGE || '../') + path);
	},
	requester: function(method, params, cb) {
		var requestOptions = {
			'uri': params.uri,
			'json': params.body || true
		};
		if(params.headers) requestOptions.headers = params.headers;
		if(params.authorization) requestOptions.headers.authorization = params.authorization;
		if(params.qs) requestOptions.qs = params.qs;
		if(params.form !== undefined) requestOptions.form = params.form;

		console.log('===========================================================================');
		console.log('==== URI     :', params.uri);
		// console.log('==== REQUEST :', JSON.stringify(requestOptions));
		request[method](requestOptions, function(err, response, body) {
			//console.log('==== RESPONSE:', JSON.stringify(body));
			return cb(err, body);
		});
	}
};