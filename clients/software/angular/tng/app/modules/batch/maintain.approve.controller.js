(function (angular) {
    'use strict';

    angular.module('cms.main').factory('approveService', ['$http','baseService', function ($http,baseService) {

        var service = baseService('batch','/submitData',{});

        service.approve = function(item){
            return $http.post(service.url('/api/approve'),item);
        };

        service.reject = function(item){
            return $http.post(service.url('/api/reject'),item);
        };

        service.complete = function(item){
            return $http.post(service.url('/api/submitExecutedResult'),item);
        };

        return service;
    }]);

    angular.module('cms.main').controller('approveController', ['$scope', 'baseController', 'baseDialog', 'checkHttpResponse', 'maintainManageService', 'approveService',
        function ($scope, baseController, baseDialog, checkHttpResponse, maintainManageService,dataService) {

           $scope.columns = [
               {
                   'title': 'id',
                   'field': 'refId'
               },
               {
                   'title': 'createdDate',
                   'field': 'createdDate'
               },
               {
                   'title': 'createdBy',
                   'field': 'createdBy'
               },
               {
                   'title': 'description',
                   'field': 'description'
               },
               {
                   'title': 'numberOfTopUp',
                   'field': 'noOfRecord'
               },
               {
                   'title': 'totalAmount',
                   'field': 'totalAmount'
               },
               {
                   'title': 'planningExecutionTime',
                   'field': 'executionTime'
               },
               {
                   'title': 'status',
                   'field': 'status',
                   'type': 'maintainStatus'
               },
               {
                   'title': 'lastUpdate',
                   'field': 'lastUpdatedTime'
               }
            ];

            $scope.searchColumns = $scope.columns;

            $scope.actions = [
                {
                    'title': 'approve',
                    'class': 'fa fa-send',
                    'filter':function(item){
                        return /WAIT_FOR_APPRO/.test(item.status);
                    },
                    'fn': function (item) {
                        dataService.approve({recordId:item.id}).then(function(){
                            $scope.refreshData();
                        });
                    }
                },
                {
                    'title': 'reject',
                    'class': 'fa fa-reply color-red',
                    'filter':function(item){
                        return /WAIT_FOR_APPRO/.test(item.status);
                    },
                    'fn': function (item) {
                        baseDialog.input('rejectReason','textarea',' ').then(function(text){
                            dataService.reject({recordId:item.id,rejectReason:text}).then(function(){
                                $scope.refreshData();
                            });
                        });
                    }
                },
                {
                    'title': 'succeed',
                    'class': 'fa fa-check color-green',
                    'filter':function(item){
                        return /WAIT_FOR_EXEC/.test(item.status);
                    },
                    'fn': function (item) {
                        dataService.complete({
                            recordId:item.id,
                            targetTopupAmount:item.totalAmount,
                            actualTopupAmount:item.totalAmount,
                            releaseAmount:0,
                            status:'SUCCESS'
                        }).then(function(){
                            $scope.refreshData();
                        });
                    }
                },
                {
                    'title': 'partly',
                    'class': 'fa fa-warning color-yellow',
                    'filter':function(item){
                        return /WAIT_FOR_EXEC/.test(item.status);
                    },
                    'fn': function (item) {
                        var actualTopupAmount = Math.floor(Math.random() * item.totalAmount);
                        dataService.complete({
                            recordId:item.id,
                            targetTopupAmount:item.totalAmount,
                            actualTopupAmount:actualTopupAmount,
                            releaseAmount:item.totalAmount - actualTopupAmount,
                            status:'PARTIAL_SUCCESS'
                        }).then(function(){
                            $scope.refreshData();
                        });
                    }
                },
                {
                    'title': 'fail',
                    'class': 'fa fa-times color-red',
                    'filter':function(item){
                        return /WAIT_FOR_EXEC/.test(item.status);
                    },
                    'fn': function (item) {
                        dataService.complete({
                            recordId:item.id,
                            targetTopupAmount:item.totalAmount,
                            actualTopupAmount:0,
                            releaseAmount:item.totalAmount,
                            status:'FAIL'
                        }).then(function(){
                            $scope.refreshData();
                        });
                    }
                }
            ];

            maintainManageService.balance($scope);
            baseController($scope, null, dataService);
        }]);

})(window.angular);
