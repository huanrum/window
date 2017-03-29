(function (angular) {
    'use strict';

    angular.module('cms.main').factory('executedService', ['baseService', function (baseService) {

        return baseService('batch','/executed',{
            'get':true
        });

    }]);

})(window.angular);