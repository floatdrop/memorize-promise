'use strict';
module.exports = function (func, opts) {
	if (typeof func !== 'function') {
		throw new TypeError('func must be a function, not a ' + typeof func);
	}

	opts = opts || {};

	var cache = func();
	var updateInterval = opts.updateInterval || 5000;
	var stop = false;
	var timeout;

	function updateLoop() {
		var promise = func();
		promise
			.then(function () {
				cache = promise;
				setupUpdate();
			}, setupUpdate);
	}

	function setupUpdate() {
		if (updateInterval && !stop) {
			timeout = setTimeout(updateLoop, updateInterval);
		}
	}

	setupUpdate();

	return {
		then: function (resolve, reject) {
			return cache.then(resolve, reject);
		},
		catch: function (handle) {
			return cache.catch(handle);
		},
		stop: function () {
			stop = true;
			clearTimeout(timeout);
		}
	};
};
