(function (angular) {
    'use strict';

    angular.module('cms.main').controller('detailsReportController', ['_','$scope','baseController','baseDialog','detailsReportService','maintainManageService',
        function (_,$scope,baseController,baseDialog,detailsReportService,maintainManageService) {

        $scope.columns = [
            {
                'title':'id',
                'field':'id'
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
                'title':'numberOfTopUp',
                'field':'noOfRecord'
            },
            {
                'title':'totalAmount',
                'field':'totalAmount'
            },
            {
                'title':'planningExecutionTime',
                'field':'planningExecutionTime'
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

        $scope.searchDownload = true;

        $scope.actions = [
            {
                'title':'download',
                'class':'fa fa-download',
                'fn':function(item){
                    baseDialog.message(null, 'download', [
                        '<div class="text-center">',
                        '   <div>{{\'pleaseSelectDocument\' | language}}</div>',
                        '   <br>',
                            _.map({
                                'pdf':'fa-file-pdf-o color-red',
                                'csv':'fa-file-excel-o color-green'
                            },function(v,k){
                                return  '<span tabindex="0" class="hover fa fa-5x '+v+'" ng-click="$ok(\''+k+'\')"></span>';
                             }).join('<span class="fa fa-5x">&nbsp;&nbsp;</span>'),
                        '</div>'
                    ].join(''), item, 'cancel').then(function(entity,action){
                        detailsReportService.download(entity,action);
                    });
                }
            }
        ];

        maintainManageService.balance($scope);
        baseController($scope,null,detailsReportService);
    }]);

})(window.angular);
