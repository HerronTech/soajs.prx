"use strict";
var assert = require('assert');
var util = require('soajs/lib/utils');
var helper = require("../helper.js");
var extKey = '9b96ba56ce934ded56c3f21ac9bdaddc8ba4782b7753cf07576bfabcace8632eba1749ff1187239ef1f56dd74377aa1e5d0a1113de2ed18368af4b808ad245bc7da986e101caddb7b75992b14d6a866db884ea8aee5ab02786886ecf9f25e974';

describe("Proxy Tests", function () {
	var soajsauth, data, uracUser;

	it("login to urac", function (done) {
		var options = {
			uri: 'http://localhost:4000/urac/login',
			headers: {
				'Content-Type': 'application/json',
				key: extKey
			},
			body: {
				"username": "owner",
				"password": "123456"
			},
			json: true
		};
		helper.requester('post', options, function (error, body) {
			assert.ifError(error);
			assert.ok(body);
			uracUser = body.data;
			soajsauth = body.soajsauth;
			done();
		});
	});

	it("getExt Key", function(done){
		///permissions/get
		var options = {
			uri: 'http://localhost:4000/dashboard/permissions/get',
			headers: {
				'Content-Type': 'application/json',
				key: extKey,
				soajsauth: soajsauth
			},
			"qs":{}
		};
		helper.requester('get', options, function (error, body) {
			assert.ifError(error);
			assert.ok(body);
			data = body.data;
			// console.log(JSON.stringify(data, null, 2));
			done();
		});
	});

	it("fail - no call will work before reload proxy registry", function (done) {
		var options = {
			uri: 'http://localhost:4000/proxy/redirect',
			headers: {
				'Content-Type': 'application/json',
				key: extKey,
				soajsauth: soajsauth
			},
			"qs":{
				"proxyRoute": encodeURIComponent("/urac/getUser"),
				"username": "owner",
				"__env": "dashboard",
				"__envauth": soajsauth
			}
		};
		helper.requester('get', options, function (error, body) {
			assert.ifError(error);
			assert.ok(body);
			// console.log(JSON.stringify(body, null, 2));
			assert.equal(body.result, false);
			assert.ok(body.errors);
			done();
		});
	});

	it("fail - invalid environment", function (done) {
		var options = {
			uri: 'http://localhost:4000/proxy/redirect',
			headers: {
				'Content-Type': 'application/json',
				key: extKey,
				soajsauth: soajsauth
			},
			"qs":{
				"proxyRoute": encodeURIComponent("/urac/getUser"),
				"username": "owner",
				"__env": "invalid",
				"__envauth": soajsauth
			}
		};
		helper.requester('get', options, function (error, body) {
			assert.ifError(error);
			assert.ok(body);
			//console.log(JSON.stringify(body, null, 2));
			assert.equal(body.result, false);
			assert.ok(body.errors);
			done();
		});
	});
	
	it("success - will redirect to urac GET protocol", function (done) {
		var options = {
			uri: 'http://localhost:4000/proxy/redirect',
			headers: {
				'Content-Type': 'application/json',
				key: extKey,
				soajsauth: soajsauth
			},
			"qs":{
				"proxyRoute": encodeURIComponent("/urac/account/getUser"),
				"username": "owner",
				"__env": "dashboard",
				"__envauth": soajsauth
			}
		};
		helper.requester('get', options, function (error, body) {
			assert.ifError(error);
			assert.ok(body);
			// console.log(JSON.stringify(body, null, 2));
			assert.equal(body.result, true);
			assert.ok(body.data);
			done();
		});
	});

	it("success - will redirect to urac POST protocol", function (done) {
		var options = {
			uri: 'http://localhost:4000/proxy/redirect',
			headers: {
				'Content-Type': 'application/json',
				key: extKey,
				soajsauth: soajsauth
			},
			"json": true,
			"qs":{
				"proxyRoute": encodeURIComponent("/urac/account/changeEmail"),
				"uId": uracUser._id.toString(),
				"__env": "dashboard",
				"__envauth": soajsauth
			},
			"form":{
				"email": "owner@soajs.org"
			}
		};
		helper.requester('post', options, function (error, body) {
			assert.ifError(error);
			assert.ok(body);
			assert.equal(body.result, true);
			assert.ok(body.data);
			done();
		});
	});
});
