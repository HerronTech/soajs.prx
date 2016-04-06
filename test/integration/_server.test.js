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

	after(function (done) {
		console.log('test data imported.');
		controller = require("soajs.controller");
		setTimeout(function () {
			urac = require("soajs.urac");
			dashboard = require("soajs.dashboard");
			proxy = helper.requireModule('./index');
			setTimeout(function () {
				require("./soajs.proxy.test.js");
				done();
			}, 1000);
		}, 4000);
	});
});

