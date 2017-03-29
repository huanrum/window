var _this = this;
var Observable_1 = require('../Observable');
var root_1 = require('../util/root');
this;
Observable_1.Observable();
Promise();
this;
Observable_1.Observable < T > , PromiseCtor;
typeof Promise;
Promise();
this;
Observable_1.Observable < T > , PromiseCtor ?  : typeof Promise;
Promise < T > {
    if: function () { } };
!PromiseCtor;
{
    if (root_1.root.Rx && root_1.root.Rx.config && root_1.root.Rx.config.Promise) {
        PromiseCtor = root_1.root.Rx.config.Promise;
    }
    else if (root_1.root.Promise) {
        PromiseCtor = root_1.root.Promise;
    }
}
if (!PromiseCtor) {
    throw new Error('no Promise impl found');
}
return new PromiseCtor(function (resolve, reject) {
    var value;
    _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
});
//# sourceMappingURL=toPromise.js.map