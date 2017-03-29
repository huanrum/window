(function (angular) {
    'use strict';

    angular.module('cms.main').controller('executedController', ['$scope','baseController','maintainManageService','executedService', function ($scope,baseController,maintainManageService,executedService) {

        $scope.columns = [
            {
                'title':'id',
                'field':'refId'
            },
            {
                'title':'createdDate',
                'field':'createdDate'
            },
            {
                'title':'createdBy',
                'field':'createdBy'
            },
            {
                'title':'description',
                'field':'description'
            },
            {
                'title': 'numberOfTopUp',
                'field': 'noOfRecord'
            },
            {
                'title':'totalAmount',
                'field':'totalAmount'
            },
            {
                'title':'planningExecutionTime',
                'field':'executionTime'
            },
            {
                'title':'status',
                'field':'status',
                'type': 'maintainStatus'
            },
            {
                'title':'executedAmount',
                'field':'executedAmount'
            },
            {
                'title':'lastUpdate',
                'field':'lastUpdatedTime'
            }
        ];

        $scope.searchColumns = $scope.columns;

        $scope.actions = [
            {
                'title': 'view',
                'class': 'fa fa-eye',
                'operate':true,
                'fn': function (item) {
                    executedService.get(item).then(function(req){
                        maintainManageService.detail($scope,angular.extend(req.data.data,{refId:item.refId}));
                    });
                }
            },
            {
                'title': 'copy',
                'class':'fa fa-copy',
                'filter':function(){
                    return $scope.permission.create;
                },
                'fn': function (item) {
                    executedService.get(item).then(function(req){
                        maintainManageService.copy($scope,angular.extend(req.data.data,{refId:item.refId}));
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
        baseController($scope,null,executedService);
    }]);

})(window.angular);
