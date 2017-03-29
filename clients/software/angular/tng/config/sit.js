/* jshint -W079*/
var window;
var exports;
(function(window,exports){
    'use strict';

    exports.isDebug = true;

    window.serviceUrl = function(){
        return {
            tngServiceUrl : location.protocol + '//' + '192.168.1.239:9900/orc',
            btuServiceUrl : location.protocol + '//' + '192.168.1.241:9090',
            publicServiceUrl:location.protocol + '//' +  '192.168.1.239:9900'
        };
    };

})(window || {},exports || {});