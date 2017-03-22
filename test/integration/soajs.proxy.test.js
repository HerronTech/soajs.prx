"use strict";
var path = require("path");
var shell = require('shelljs');
var assert = require('assert');
var helper = require("../helper.js");
var extKey = '9b96ba56ce934ded56c3f21ac9bdaddc8ba4782b7753cf07576bfabcace8632eba1749ff1187239ef1f56dd74377aa1e5d0a1113de2ed18368af4b808ad245bc7da986e101caddb7b75992b14d6a866db884ea8aee5ab02786886ecf9f25e974';

describe("Proxy Tests", function () {
	it("fail - invalid environment, error 182", function (done) {
		var options = {
			uri: 'http://localhost:4009/redirect',
			headers: {
				'Content-Type': 'application/json',
				key: extKey
			},
			"qs": {
				"proxyRoute": encodeURIComponent("/urac/getUser"),
				"__env": "invalid"
			}
		};
		helper.requester('get', options, function (error, body) {
			assert.ifError(error);
			assert.ok(body);
			console.log(JSON.stringify(body, null, 2));
			assert.equal(body.result, false);
			assert.ok(body.errors);
			done();
		});
	});
	
	it("deploy controller and urac in another environment", function (done) {
		var node_modules = path.normalize(__dirname + "/../../node_modules/");
		var envs = process.env;
		envs.SOAJS_ENV = "dev";
		envs.SOAJS_SRVIP = "127.0.0.1";
		
		shell.exec("node " + node_modules + "soajs.controller/index.js", function (code) {
			assert.equal(code, 0);
		});
		
		setTimeout(function(){
			shell.exec("node " + node_modules + "soajs.urac/index.js", function (code) {
				assert.equal(code, 0);
			});
			
			setTimeout(function(){
				done();
			}, 2000);
			
		}, 1000);
	});
	
	it("reloadRegistry of proxy", function(done){
		var options = {
			uri: 'http://localhost:5009/reloadRegistry'
		};
		helper.requester('get', options, function (error, body) {
			assert.ifError(error);
			assert.ok(body);
			done();
		});
	});
	
	it("success - will redirect to urac GET protocol", function (done) {
		var options = {
			uri: 'http://localhost:4009/redirect',
			headers: {
				'Content-Type': 'application/json',
				key: extKey
			},
			"qs": {
				"proxyRoute": encodeURIComponent("/urac/account/getUser"),
				"username": "owner",
				"__env": "dev"
			}
		};
		helper.requester('get', options, function (error, body) {
			assert.ifError(error);
			assert.ok(body);
			console.log(JSON.stringify(body, null, 2));
			assert.equal(body.result, true);
			assert.ok(body.data);
			done();
		});
	});
});
