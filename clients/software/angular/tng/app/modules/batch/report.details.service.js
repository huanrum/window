(function (angular) {
    'use strict';

    angular.module('cms.main').factory('detailsReportService', ['baseService', function (baseService) {

        var service = baseService('batch','/report',{});

        service.download = function(entity,action) {
            service.open('/report/export',{startDate:entity.createdDate,endDate:entity.createdDate,docType:action,type:''});
        };

        return service;

    }]);

})(window.angular);