var Subject_1 = require('../Subject');
var Observable_1 = require('../Observable');
var ConnectableObservable_1 = require('../observable/ConnectableObservable');
this;
Observable_1.Observable < T > , subjectOrSubjectFactory;
factoryOrValue();
ConnectableObservable_1.ConnectableObservable();
Subject_1.Subject < T > , selector ?  : selector();
Observable_1.Observable();
this;
Observable_1.Observable < T > , subjectOrSubjectFactory;
Subject_1.Subject( | (function () { return Subject_1.Subject(); },
    selector ?  : function (source) { return Observable_1.Observable(); }), Observable_1.Observable( | ConnectableObservable_1.ConnectableObservable < T > {
    let: subjectFactory }(), Subject_1.Subject()));
if (typeof subjectOrSubjectFactory === 'function') {
    subjectFactory = subjectOrSubjectFactory;
}
else {
    subjectFactory = function subjectFactory() {
        return subjectOrSubjectFactory;
    };
}
if (typeof selector === 'function') {
    return this.lift(new MulticastOperator(subjectFactory, selector));
}
var connectable = Object.create(this, ConnectableObservable_1.connectableObservableDescriptor);
connectable.source = this;
connectable.subjectFactory = subjectFactory;
return connectable;
var MulticastOperator = (function () {
    function MulticastOperator(subjectFactory, selector) {
        this.subjectFactory = subjectFactory;
        this.selector = selector;
    }
    MulticastOperator.prototype.call = function (subscriber, source) {
        var selector = this.selector;
        var subject = this.subjectFactory();
        var subscription = selector(subject).subscribe(subscriber);
        subscription.add(source.subscribe(subject));
        return subscription;
    };
    return MulticastOperator;
})();
exports.MulticastOperator = MulticastOperator;
//# sourceMappingURL=multicast.js.map