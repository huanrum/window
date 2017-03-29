(function (angular) {
    'use strict';

    angular.module('cms.main').factory('summaryReportService', ['baseService', function (baseService) {

        var service = baseService('batch','/report',{});

        service.download = function(filter,action) {
            service.open('/report/export',{startDate:filter.startDate,endDate:filter.endDate,docType:action,type:''});
        };

        return service;

    }]);

})(window.angular);