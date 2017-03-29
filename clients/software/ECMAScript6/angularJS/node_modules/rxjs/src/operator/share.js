var Observable_1 = require('../Observable');
var multicast_1 = require('./multicast');
var Subject_1 = require('../Subject');
function shareSubjectFactory() {
    return new Subject_1.Subject();
}
this;
Observable_1.Observable();
Observable_1.Observable < T > {
    return: multicast_1.multicast.call(this, shareSubjectFactory).refCount()
};
//# sourceMappingURL=share.js.map