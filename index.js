'use strict';
module.exports = function (func, opts) {
	if (typeof func !== 'function') {
		throw new TypeError('func must be a function, not a ' + typeof func);
	}

	opts = opts || {};

	var updateInterval = opts.updateInterval || 5000;
	var ttl = opts.ttl || 60000;
	var cache;
	var timeout;
	var lastHit;

	function updateLoop() {
		timeout = undefined;

		var promise = func();
		promise
			.then(function () {
				cache = promise;
				setupUpdate();
			}, setupUpdate);
	}

	function setupUpdate() {
		if (Date.now() - lastHit >= ttl) {
			cache = undefined;
			return;
		}

		if (!cache) {
			cache = func();
		}

		if (!timeout && updateInterval) {
			timeout = setTimeout(updateLoop, updateInterval);
		}
	}

	return {
		then: function (resolve, reject) {
			lastHit = Date.now();
			setupUpdate();
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
