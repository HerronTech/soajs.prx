"use strict";
var request = require("request");

function constructProxyRequest(req, domain, soajsauth, requestedRoute, res) {
	var myUri = req.headers['x-forwarded-proto'] + '://' + domain + requestedRoute;
	var requestConfig = {
		'uri': myUri,
		'method': req.method,
		'timeout': 1000 * 3600,
		'jar': false,
		'headers': req.headers
	};

	requestConfig.headers.soajsauth = soajsauth;
	if (req.query && Object.keys(req.query).length > 0) {
		requestConfig.qs = req.query;
	}

	var proxy = request(requestConfig);
	proxy.on('error', function (error) {
		req.soajs.log.error(error);
		return res.json(req.soajs.buildResponse({"code": 700, "msg": error.message}));
	});

	if (req.method === 'POST' || req.method === 'PUT') {
		req.pipe(proxy).pipe(res);
	}
	else {
		proxy.pipe(res);
	}
}

module.exports = {
	"redirect": function (config, mongo, req, res) {
		var requestedRoute = decodeURIComponent(req.query.proxyRoute);
		delete req.query.proxyRoute;
		makeRequest(req.soajs.inputmaskData.__env.toLowerCase());

		function makeRequest(oneEnvCode) {
			var requestedEnv = oneEnvCode;

			mongo.findOne("environment", {"code": requestedEnv.toUpperCase()}, {
				"domain": 1,
				"port": 1
			}, function (error, envRecord) {
				if (error) {
					req.soajs.log.error(error);
					return res.json(req.soajs.buildResponse({"code": 400, "msg": config.errors[400]}));
				}

				var domain = envRecord.domain + ":" + envRecord.port;
				constructProxyRequest(req, domain, req.soajs.inputmaskData.__envauth, requestedRoute, res);
			});
		}
	}
};