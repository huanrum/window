/* jshint -W079*/
var window;
(function(window){
    'use strict';

    window.serviceUrl = function(){
        return {
            tngServiceUrl : location.protocol + '//' + '10.0.101.229	:8080/orc',
            publicServiceUrl:location.protocol + '//' +  '10.0.101.231:8080'
        };
    };

})(window || {});