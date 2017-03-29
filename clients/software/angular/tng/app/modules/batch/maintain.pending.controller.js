(function (angular) {
    'use strict';

    angular.module('cms.main').controller('pendingController', ['$scope', 'baseController', 'baseDialog', 'checkHttpResponse', 'maintainManageService', 'pendingService',
        function ($scope, baseController, baseDialog, checkHttpResponse, maintainManageService, pendingService) {

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
                    'title': 'view',
                    'class': 'fa fa-eye',
                    'operate': true,
                    'fn': function (item) {
                        pendingService.get(item).then(function(req){
                            maintainManageService.view($scope,angular.extend(req.data.data,{refId:item.refId}));
                        });
                    }
                },
                {
                    'title': 'copy',
                    'class': 'fa fa-copy',
                    'filter': function () {
                        return $scope.permission.create;
                    },
                    'fn': function (item) {
                        pendingService.get(item).then(function(req){
                            maintainManageService.copy($scope,angular.extend(req.data.data,{refId:item.refId}));
                        });
                    }
                },
                {
                    'title': 'cancel',
                    'class': 'fa fa-close',
                    'filter': function (item) {
                        return $scope.permission['delete'] && !/WAIT_FOR_EXEC/.test(item.status);
                    },
                    'fn': function (item) {
                        baseDialog.message('fa fa-trash-o', 'confirmCancelTitle', '{{\'confirmCancelContent\'|language}}', {}, 'no/yes').then(function () {
                            return pendingService.cancel(item).then(checkHttpResponse(function () {
                                maintainManageService.balance($scope);
                                $scope.refreshData();
                            }));
                        });
                    }
                }
            ];

            $scope.toolbars = [
                {
                    'title': 'create',
                    'class': 'tool-bars-btn btn-primary font-weight',
                    'fn': function () {
                        maintainManageService.create($scope,{batchToupDetails:[{}]});
                    }
                }
            ];

            maintainManageService.balance($scope);
            baseController($scope, null, pendingService);
        }]);

})(window.angular);
