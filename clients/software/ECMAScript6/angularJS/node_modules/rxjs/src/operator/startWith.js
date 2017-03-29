var Observable_1 = require('../Observable');
var ArrayObservable_1 = require('../observable/ArrayObservable');
var ScalarObservable_1 = require('../observable/ScalarObservable');
var EmptyObservable_1 = require('../observable/EmptyObservable');
var concat_1 = require('./concat');
this;
Observable_1.Observable < T > , v1;
T, scheduler ?  : IScheduler;
Observable_1.Observable();
this;
Observable_1.Observable < T > , v1;
T, v2;
T, scheduler ?  : IScheduler;
Observable_1.Observable();
this;
Observable_1.Observable < T > , v1;
T, v2;
T, v3;
T, scheduler ?  : IScheduler;
Observable_1.Observable();
this;
Observable_1.Observable < T > , v1;
T, v2;
T, v3;
T, v4;
T, scheduler ?  : IScheduler;
Observable_1.Observable();
this;
Observable_1.Observable < T > , v1;
T, v2;
T, v3;
T, v4;
T, v5;
T, scheduler ?  : IScheduler;
Observable_1.Observable();
this;
Observable_1.Observable < T > , v1;
T, v2;
T, v3;
T, v4;
T, v5;
T, v6;
T, scheduler ?  : IScheduler;
Observable_1.Observable();
this;
Observable_1.Observable < T > , ;
array: Array();
Observable_1.Observable();
this;
Observable_1.Observable < T > , ;
array: Array();
Observable_1.Observable < T > {
    let: scheduler = array[array.length - 1],
    if: function (isScheduler) {
        if (isScheduler === void 0) { isScheduler = (scheduler); }
        array.pop();
    }, else: {
        scheduler: scheduler
    },
    const: len = array.length,
    if: function (len) {
        if (len === void 0) { len =  === 1; }
        return concat_1.concatStatic(new ScalarObservable_1.ScalarObservable(array[0], scheduler), this);
    }, else: , if: function (len) {
        if (len === void 0) { len =  > 1; }
        return concat_1.concatStatic(new ArrayObservable_1.ArrayObservable(array, scheduler), this);
    }, else: {
        return: concat_1.concatStatic(new EmptyObservable_1.EmptyObservable(scheduler), this)
    }
};
//# sourceMappingURL=startWith.js.map