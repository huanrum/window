var Observable_1 = require('../Observable');
var ReplaySubject_1 = require('../ReplaySubject');
var multicast_1 = require('./multicast');
var ConnectableObservable_1 = require('../observable/ConnectableObservable');
this;
Observable_1.Observable < T > , bufferSize;
number = Number.POSITIVE_INFINITY,
    windowTime;
number = Number.POSITIVE_INFINITY,
    scheduler ?  : IScheduler;
ConnectableObservable_1.ConnectableObservable < T > {
    return: multicast_1.multicast.call(this, new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler))
};
//# sourceMappingURL=publishReplay.js.map