var Observable_1 = require('../Observable');
this;
Observable_1.Observable < T > , comparer ?  : function (x, y) { return number; };
Observable_1.Observable < T > {
    const: min }(x, T, y, T);
T = (typeof comparer === 'function')
    ? function (x, y) { return comparer(x, y) < 0 ? x : y; }
    : function (x, y) { return x < y ? x : y; };
return this.lift(new reduce_1.ReduceOperator(min));
//# sourceMappingURL=min.js.map