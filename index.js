'use strict';
var soajs = require('soajs');
var Mongo = require('soajs.core.modules').mongo;
var mongo = null;

var config = require('./config.js');
var proxy = require("./lib/proxy.js");

var service = new soajs.server.service(config);
function checkForMongo(req) {
	if(!mongo) {
		mongo = new Mongo(req.soajs.registry.coreDB.provision);
	}
}

service.init(function(){
	service.all("/redirect", function(req, res){
		checkForMongo(req);
		proxy.redirect(config, mongo, service.registry, req, res);
	});

	/**
	 * Service Start
	 */
	service.start();
});