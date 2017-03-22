"use strict";
var assert = require('assert');
var helper = require("../helper.js");
var shell = require('shelljs');
var sampleData = require("soajs.mongodb.data/modules/proxy");
var proxy;

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
		proxy = helper.requireModule('./index');
		setTimeout(function () {
			done();
		}, 2000);
	});
	
	it("Running Tests", function(done){
		require("./soajs.proxy.test.js");
		done();
	});
});
