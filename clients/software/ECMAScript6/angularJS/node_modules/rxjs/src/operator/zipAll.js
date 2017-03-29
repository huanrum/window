var zip_1 = require('./zip');
var Observable_1 = require('../Observable');
this;
Observable_1.Observable < T > , project ?  : function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i - 0] = arguments[_i];
    }
    return R;
};
Observable_1.Observable < R > {
    return: this.lift(new zip_1.ZipOperator(project))
};
//# sourceMappingURL=zipAll.js.map