(function (angular) {
    'use strict';

    angular.module('cms.main').controller('cashflowController', ['$scope','baseController','maintainManageService','cashflowService', function ($scope,baseController,maintainManageService,dataService) {

        $scope.columns = [
            {
                'title':'Ref_ID',
                'field':'refID'
            },
            {
                'title':'transactionDate',
                'field':'executionTime'
            },
            {
                'title':'module',
                'field':'submittedBy'
            },
            {
                'title':'totalReservedAmount',
                'field':'totalReservedAmount',
                'formatter':function(value,item){
                    return (item.totalAmount - item.executedAmount);
                }
            },
            {
                'title':'totalAvailableAmount',
                'field':'executedAmount'
            },
            {
                'title':'totalAmount',
                'field':'totalAmount'
            },
            {
                'title':'changeBalance',
                'field':'batchTopUpDescription'
            },
            {
                'title':'changeReservation',
                'field':'changeReservation'
            },
            {
                'title':'fundDispatch',
                'field':'fundDispatch'
            }
        ];

        $scope.searchColumns = $scope.columns;

        $scope.actions = [
            {
                'title': 'view',
                'class': 'fa fa-eye',
                'operate':true,
                'fn': function (item) {
                    dataService.get(item).then(function(req){
                        maintainManageService.detail($scope,angular.extend(req.data.data,{refId:item.refId}));
                    });
                }
            }
        ];

        baseController($scope,null,dataService);
    }]);

})(window.angular);
