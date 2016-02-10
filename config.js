"use strict";

module.exports = {
	"serviceName": "proxy",
	"servicePort": 4009,
	"requestTimeout": 30,
	"requestTimeoutRenewal": 5,
	"extKeyRequired": true,
	"awareness": true,
	"bodyParser": false,

	"errors": {},
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