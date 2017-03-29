var distinctUntilChanged_1 = require('./distinctUntilChanged');
var Observable_1 = require('../Observable');
this;
Observable_1.Observable < T > , key;
string;
Observable_1.Observable();
this;
Observable_1.Observable < T > , key;
string, compare;
(function (x, y) { return boolean; });
Observable_1.Observable();
this;
Observable_1.Observable < T > , key;
string, compare ?  : function (x, y) { return boolean; };
Observable_1.Observable < T > {
    return: distinctUntilChanged_1.distinctUntilChanged.call(this, function (x, y) {
        if (compare) {
            return compare(x[key], y[key]);
        }
        return x[key] === y[key];
    })
};
//# sourceMappingURL=distinctUntilKeyChanged.js.map