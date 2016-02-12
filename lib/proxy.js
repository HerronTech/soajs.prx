"use strict";
var request = require("request");
var soajsCore = require("soajs/modules/soajs.core");

module.exports = {
	"redirect": function (config, mongo, req, res) {
		var requestedRoute = decodeURIComponent(req.query.proxyRoute);
		delete req.query.proxyRoute;
		constructProxyRequest(req, req.soajs.inputmaskData.__env.toLowerCase(), req.soajs.inputmaskData.__envauth, requestedRoute, res);


		function constructProxyRequest(req, envCode, soajsauth, requestedRoute, res) {

			req.soajs.awarenessEnv.getHost(envCode,function(host){
				soajsCore.registry.loadByEnv({
					"envCode": envCode
				}, function (err, reg) {
					if(err){
						req.soajs.log.error(error);
					}
					else{
						var port = reg.services.controller.port;
						var myUri = req.headers['x-forwarded-proto'] + '://' + host + ':' + port + requestedRoute;

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
						req.soajs.log.debug(requestConfig);
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
				});
			});
		}
	}
};