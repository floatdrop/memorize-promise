'use strict';
var test = require('tap').test;
var memorizePromise = require('./');
var PinkiePromise = require('pinkie-promise');

test('throws without factory function', function (t) {
	t.throws(function () {
		memorizePromise();
	}, /func must be a function, not a undefined/);
	t.end();
});

test('cache promised content', function (t) {
	t.plan(3);

	var calls = 0;
	var cache = memorizePromise(function () {
		return new PinkiePromise(function (resolve) {
			resolve(calls++);
		});
	}, {updateInterval: 10});

	cache.then(function (n) {
		t.is(n, 0);
	});

	cache.then(function (n) {
		t.is(n, 0);
	});

	setTimeout(function () {
		cache.then(function (n) {
			t.is(n, 1);
			cache.stop();
		});
	}, 15);
});

test('works with disabled updateInterval', function (t) {
	t.plan(2);

	var calls = 0;
	var cache = memorizePromise(function () {
		return new PinkiePromise(function (resolve) {
			resolve(calls++);
		});
	}, {updateInterval: 0});

	cache.then(function (n) {
		t.is(n, 0);
	});

	setTimeout(function () {
		cache.then(function (n) {
			t.equal(n, 0);
			cache.stop();
		});
	}, 15);
});

test('dies after inactivity', function (t) {
	var calls = 0;
	memorizePromise(function () {
		return new PinkiePromise(function (resolve) {
			resolve(calls++);
		});
	}, {updateInterval: 1, ttl: 5});

	setTimeout(function () {
		t.equal(calls, 4);
		t.end();
	}, 15);
});
