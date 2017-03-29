(function (angular) {
    'use strict';

    angular.module('cms.main').factory('pendingService', ['$http','baseService', function ($http,baseService) {

        var service = baseService('batch','/submitData',{
            'get':true
        });

        service.cancel = function(item){
            return $http.put(service.url('/submitData/cancel/')+item.id);
        };

        return service;
    }]);

})(window.angular);