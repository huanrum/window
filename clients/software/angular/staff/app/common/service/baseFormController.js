/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular){

    'use strict';

    angular.module('staff.common').factory('baseFormController',[function(){
        return function($scope,dataService,option){
            option = option || {};

            $scope.headerOption = {
                title:option.title || dataService.getName()
            };
            $scope.contentOption = {
                dataService:dataService,
                columns:option.columns || dataService.getColumns(),
                data : dataService.getList()
            };
            $scope.footerOption = {

            };

        };
    }]);
})(window.angular);