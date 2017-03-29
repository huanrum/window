var Observable_1 = require('../Observable');
var BehaviorSubject_1 = require('../BehaviorSubject');
var multicast_1 = require('./multicast');
var ConnectableObservable_1 = require('../observable/ConnectableObservable');
this;
Observable_1.Observable < T > , value;
T;
ConnectableObservable_1.ConnectableObservable < T > {
    return: multicast_1.multicast.call(this, new BehaviorSubject_1.BehaviorSubject(value))
};
//# sourceMappingURL=publishBehavior.js.map