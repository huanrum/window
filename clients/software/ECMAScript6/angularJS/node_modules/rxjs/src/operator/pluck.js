var Observable_1 = require('../Observable');
var map_1 = require('./map');
this;
Observable_1.Observable < T > , ;
properties: string[];
Observable_1.Observable < R > {
    const: length = properties.length,
    if: function (length) {
        if (length === void 0) { length =  === 0; }
        throw new Error('list of properties cannot be empty.');
    },
    return: map_1.map.call(this, plucker(properties, length))
};
function plucker(props, length) {
    var mapper = function (x) {
        var currentProp = x;
        for (var i = 0; i < length; i++) {
            var p = currentProp[props[i]];
            if (typeof p !== 'undefined') {
                currentProp = p;
            }
            else {
                return undefined;
            }
        }
        return currentProp;
    };
    return mapper;
}
//# sourceMappingURL=pluck.js.map