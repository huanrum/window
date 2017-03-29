(function (angular,window) {
    'use strict';

    angular.module('cms.main').factory('draftService', ['$http','$q','$global','baseService','lookupService','checkHttpResponse', function ($http,$q,$global,baseService,lookupService,checkHttpResponse) {

        lookupService('timeList','[batch]/timeList');
        lookupService('maintainTemplate','[batch]/template?language='+$global.language);

        var service = baseService('batch','/batchTop/draft',{
            'get':true,
            'uploadData':{'url':'/import'}
        });

        service.balance = function(){
            var defer = $q.defer();
            $http.get(service.url('/batchTop/balance'))
                .then(checkHttpResponse(function(req){
                    defer.resolve({
                        available:req.data.data.availableBalance,
                        reserved:req.data.data.reservedBalance
                });
                }));
            return defer.promise;
        };

        service.submit = function(entity){
            if(angular.isObject(entity)){
                return $http.put(service.url('/batchTop/submit'),entity);
            }else{
                return $http.put(service.url('/batchTop/submit/'+entity));
            }
        };

        service.import = function(file) {
            var defer = $q.defer();
            service.upload(file).then(checkHttpResponse(function(req){
                defer.resolve(req.data.data);
            }));
            return defer.promise;
        };

        service.downloadCSVTemplate = function(){
            window.open('assets/data/maintain.csv');
        };

        return service;

    }]);

})(window.angular,window);