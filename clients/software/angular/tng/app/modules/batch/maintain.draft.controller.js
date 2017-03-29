(function (angular) {
    'use strict';

    angular.module('cms.main').controller('draftController', ['$scope', 'baseController', 'baseDialog', 'checkHttpResponse', 'maintainManageService', 'draftService',
        function ($scope, baseController, baseDialog, checkHttpResponse, maintainManageService, dataService) {

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
                    'title': 'lastUpdate',
                    'field': 'lastUpdatedTime'
                }
            ];

            $scope.searchColumns = $scope.columns;

            $scope.actions = [
                {
                    'title': 'edit',
                    'class': 'fa fa-edit',
                    'operate':true,
                    'filter': function () {
                        return $scope.permission.edit;
                    },
                    'fn': function (item) {
                        dataService.get(item).then(function(req){
                            maintainManageService.edit($scope,angular.extend(req.data.data,{refId:item.refId}));
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
                        dataService.get(item).then(function(req){
                            maintainManageService.copy($scope,angular.extend(req.data.data,{refId:item.refId}));
                        });
                    }
                },
                {
                    'title': 'submit',
                    'class': 'fa fa-share',
                    'fn': function (item) {
                        baseDialog.message('fa fa-save', 'confirmSubmitTitle', '{{\'confirmSubmitContent\'|language}}', {}, 'no/yes').then(function () {
                            return dataService.submit(item.id).then(checkHttpResponse(function () {
                                $scope.refreshData();
                            }));
                        });
                    }
                },
                {
                    'title': 'remove',
                    'class': 'fa fa-fw fa-trash',
                    'disable':function(){
                        return !$scope.permission['delete'];
                    },
                    'fn': function (item) {
                        if(!$scope.permission.edit){
                            return;
                        }
                        $scope.remove(item, 'confirm').then(function(){
                            maintainManageService.balance($scope);
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
            baseController($scope, null, dataService);
        }]);

})(window.angular);
