/* jshint -W079*/
var window;
var exports;
(function(window,exports){
    'use strict';

    exports.isDebug = true;

    window.serviceUrl = function (usePathname) {
        if ( window.localStorage[usePathname('tngServiceUrl')]) {//有缓存时
            if (/http/.test( window.localStorage[usePathname('tngServiceUrl')])) {
                return {
                    pageSize : window.localStorage[usePathname('pageSize')],
                    tngServiceUrl : window.localStorage[usePathname('tngServiceUrl')],
                    mamServiceUrl : window.localStorage[usePathname('mamServiceUrl')],
                    btuServiceUrl: window.localStorage[usePathname('btuServiceUrl')],
                    publicServiceUrl : window.localStorage[usePathname('publicServiceUrl')]
                };
            } else {
                return {
                    pageSize : window.localStorage[usePathname('pageSize')],
                    tngServiceUrl : location.protocol + '//' + window.localStorage[usePathname('tngServiceUrl')],
                    mamServiceUrl : location.protocol + '//' + window.localStorage[usePathname('mamServiceUrl')],
                    btuServiceUrl: location.protocol + '//' + window.localStorage[usePathname('btuServiceUrl')],
                    publicServiceUrl : location.protocol + '//' + window.localStorage[usePathname('publicServiceUrl')]
                };
            }
        } else {
            switch (location.hostname){
                case 'dell-pc-seto':
                case 'localhost':
                    window.localStorage[usePathname('tngServiceUrl')] = window.localStorage[usePathname('tngServiceUrl')] || '192.168.1.233:8080';
                    window.localStorage[usePathname('mamServiceUrl')] = window.localStorage[usePathname('mamServiceUrl')] || '192.168.1.241:8090';
                    window.localStorage[usePathname('btuServiceUrl')] = window.localStorage[usePathname('btuServiceUrl')] || '192.168.1.241:8090';
                    window.localStorage[usePathname('publicServiceUrl')] = window.localStorage[usePathname('publicServiceUrl')] || '192.168.1.239:8800';
                    window.localStorage[usePathname('pageSize')] = window.localStorage[usePathname('pageSize')] || 12;
                    window.localStorage[usePathname('isDebug')] = window.localStorage[usePathname('isDebug')] || 'true';
                    window.localStorage[usePathname('language')] = window.localStorage[usePathname('language')] || 'zh-cn';
                    return {
                        pageSize : window.localStorage[usePathname('pageSize')],
                        tngServiceUrl : location.protocol + '//' + window.localStorage[usePathname('tngServiceUrl')],
                        mamServiceUrl : location.protocol + '//' +  window.localStorage[usePathname('mamServiceUrl')],
                        btuServiceUrl : location.protocol + '//' +  window.localStorage[usePathname('btuServiceUrl')],
                        publicServiceUrl: location.protocol + '//' +  window.localStorage[usePathname('publicServiceUrl')]
                    };
                case '192.168.1.232':
                    window.localStorage[usePathname('tngServiceUrl')] = '';
                    window.localStorage[usePathname('mamServiceUrl')] = '';
                    return {
                        tngServiceUrl : location.protocol + '//' + '192.168.1.239:9900/orc',
                        publicServiceUrl:location.protocol + '//' +  '192.168.1.239:9900'
                    };
                default:
                    window.localStorage[usePathname('tngServiceUrl')] = '';
                    window.localStorage[usePathname('mamServiceUrl')] = '';
                    window.localStorage[usePathname('btuServiceUrl')] = '';
                    return {
                        tngServiceUrl : location.protocol + '//' + '192.168.1.233:8080',
                        mamServiceUrl : location.protocol + '//' +  '192.168.1.241:8090',
                        btuServiceUrl : location.protocol + '//' +  '192.168.1.241:8090',
                        publicServiceUrl:location.protocol + '//' +  '192.168.1.239:8800'
                    };

            }
        }
    };

})(window || {},exports || {});