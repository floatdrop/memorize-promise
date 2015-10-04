'use strict';
module.exports = function (func, opts) {
	if (typeof func !== 'function') {
		throw new TypeError('func must be a function, not a ' + typeof func);
	}

	opts = opts || {};

	var cache = func();
	var updateInterval = opts.updateInterval || 5000;
	var timeout;
	var ttl = opts.ttl || 60000;
	var start = Date.now();

	function updateLoop() {
		var promise = func();
		promise
			.then(function () {
				cache = promise;
				setupUpdate();
			}, setupUpdate);
	}

	function setupUpdate() {
		if (updateInterval && (Date.now() - start < ttl)) {
			timeout = setTimeout(updateLoop, updateInterval);
		}
	}

	setupUpdate();

	return {
		then: function (resolve, reject) {
			start = Date.now();
			return cache.then(resolve, reject);
		},
		catch: function (handle) {
			return cache.catch(handle);
		},
		stop: function () {
			clearTimeout(timeout);
		}
	};
};
