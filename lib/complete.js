var q = require('q');

/**
 * Like q.all() but for objects instead of arrays
 *
 * Returns a promise that is resolved when all properties
 * of the given object have been resolved.
 *
 * @param {Object} obj
 * @returns {Promise}
 */
function complete(obj) {
    var keys = Object.keys(obj);
    var promises = keys.map(function (key) {
        return obj[key];
    });
    return q.when(promises, function (promises) {
        var countDown = 0;
        var deferred = q.defer();
        promises.reduce(function (undefined, promise, index) {
            if (q.isFulfilled(promise)) {
                obj[keys[index]] = promises[index] = q.nearer(promise);
            } else {
                ++countDown;
                q.when(promise, function (value) {
                    obj[keys[index]] = promises[index] = value;
                    if (--countDown === 0) {
                        deferred.resolve(obj);
                    }
                }, deferred.reject);
            }
        }, void 0);
        if (countDown === 0) {
            deferred.resolve(obj);
        }
        return deferred.promise;
    });
}

module.exports = exports = complete;
