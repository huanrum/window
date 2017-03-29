var Observable_1 = require('../Observable');
var SubscribeOnObservable_1 = require('../observable/SubscribeOnObservable');
this;
Observable_1.Observable < T > , scheduler;
IScheduler, delay;
number = 0;
Observable_1.Observable < T > {
    return: this.lift(new SubscribeOnOperator(scheduler, delay))
};
var SubscribeOnOperator = (function () {
    function SubscribeOnOperator(scheduler, delay) {
        this.scheduler = scheduler;
        this.delay = delay;
    }
    SubscribeOnOperator.prototype.call = function (subscriber, source) {
        return new SubscribeOnObservable_1.SubscribeOnObservable(source, this.delay, this.scheduler).subscribe(subscriber);
    };
    return SubscribeOnOperator;
})();
//# sourceMappingURL=subscribeOn.js.map