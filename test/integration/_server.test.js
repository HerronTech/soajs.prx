"use strict";
var assert = require('assert');
var helper = require("../helper.js");
var shell = require('shelljs');
var sampleData = require("soajs.mongodb.data/modules/proxy");
var controller, urac, dashboard, proxy;

describe("importing sample data", function () {

	it("do import", function (done) {
		shell.pushd(sampleData.dir);
		shell.exec("chmod +x " + sampleData.shell, function (code) {
			assert.equal(code, 0);
			shell.exec(sampleData.shell, function (code) {
				assert.equal(code, 0);
				shell.popd();
				done();
			});
		});
	});

	it("starting pre servers", function (done) {
		console.log('test data imported.');
		urac = require("soajs.urac");
		dashboard = require("soajs.dashboard");
		setTimeout(function () {
			controller = require("soajs.controller");
			setTimeout(function () {
				done();
			}, 1000);
		}, 2000);
	});
	
	it("check Controller Registry", function(done){
		var params = {
			"uri": "http://127.0.0.1:5000/reloadRegistry",
			"headers": {
				"content-type": "application/json"
			},
			"json": true
		};
		helper.requester("get", params, function (error, response) {
			assert.ifError(error);
			assert.ok(response);
			setTimeout(function () {
				done();
			}, 500);
		});
	});
	
	it("starting proxy", function(done){
		proxy = helper.requireModule('./index');
		done();
	});
	
	it("check Controller Registry", function(done){
		var params = {
			"uri": "http://127.0.0.1:5000/reloadRegistry",
			"headers": {
				"content-type": "application/json"
			},
			"json": true
		};
		helper.requester("get", params, function (error, response) {
			assert.ifError(error);
			assert.ok(response);
			setTimeout(function () {
				done();
			}, 500);
		});
	});
	
	it("Running Tests", function(done){
		require("./soajs.proxy.test.js");
		done();
	});
});
