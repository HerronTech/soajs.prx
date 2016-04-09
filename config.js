"use strict";

module.exports = {
	type: 'service',
	prerequisites: {
		cpu: '',
		memory: ''
	},
	"serviceVersion": 1,
	"serviceName": "proxy",
	"serviceGroup": "SOAJS Core Services",
	"servicePort": 4009,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"extKeyRequired": true,
	"session": true,
	"awareness": true,
	"bodyParser": false,
	"awarenessEnv": true,

	"errors": {
		"400": "Database Error",
		"401": "You do not have access to this environment %envCode%",
		"402": "The requested host is down."
	},
	"schema": {
		"/redirect" : {
			"_apiInfo": {
				"l": "Proxy Redirector",
				"group": "Proxy",
				"groupMain": true
			},
			"__env" : {
				"required": true,
				"source": ["query.__env"],
				"validation": {
					"type": "string"
				}
			},
			"__envauth" : {
				"required": true,
				"source": ["query.__envauth"],
				"validation": {
					"type": "string"
				}
			}
		}
	}
};