/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular) {

    'use strict';

    angular.module('staff.common').factory('baseGridController', ['$location', '$global', '$state','protalDialogService', function ($location, $global, $state,protalDialogService) {
        var defaultOption = {
            pageSize:10,
            canUpdateBySelect:function(){return true;}
        };

        return function ($scope, dataService, option) {
            $scope.option = angular.extend($scope.option || {}, defaultOption,option);

            $scope.option.title = option.title || dataService.getName();
            $scope.option.columns = option.columns || dataService.getColumns();
            $scope.option.rightMenus = option.rightMenus || [{title:'Edit',fn:newEditDialog,filter:function(){return !option.hideEdit;}}];

            $scope.option.buttons = [
                {
                    title:'Refresh',
                    img:'images/BE_refresh_table.png',
                    click:function(){ $scope.apply(); }
                },
                {
                    title:'Advanced Search',
                    img:'images/BE_advanced_search.png',
                    click:function(){
                        window.alert('show dialog!');
                    }
                },
                {
                    title:'New',
                    img:'images/BE_add_new.png',
                    click: newEditDialog
                }
            ];



            $scope.updateRightMenus = function(menus){
                if(angular.isArray(menus)){
                    [].push.apply($scope.option.rightMenus,menus);
                }else{
                    $scope.option.rightMenus.push(menus);
                }
            };

            $scope.apply = function (filter) {
                dataService.updateOptionFilter(filter);
                dataService.load();
            };

            $scope.changeSelect = function(filter,filed){
                if($scope.option.canUpdateBySelect(filed)){
                    $scope.apply(filter);
                }
            };

            $scope.rowClick = function(e,item){
                newEditDialog.call({title:'Edit'},item);
            };

            $scope.goPage = function(pageNumber){
                var data = dataService.getList();

                if(!angular.isNumber(pageNumber)){
                    if(pageNumber){ $scope.pageNumber =  $scope.pageNumber + 1;}
                    else{ $scope.pageNumber = $scope.pageNumber - 1;}
                }else{
                    $scope.pageNumber = pageNumber;
                }

                $scope.pageNumber = ($scope.pageNumber - 1 +  $scope.pageCount) %  $scope.pageCount + 1;
                var startItemIndex = ($scope.pageNumber-1) * $scope.option.pageSize;
                $scope.pageView = 'View '+startItemIndex+' - '+Math.min(startItemIndex + $scope.option.pageSize,data.length)+' of ' + data.length;
                $scope.dataList = data.slice(startItemIndex,startItemIndex + $scope.option.pageSize);
            };

            updateData();
            dataService.register('load', updateData);
            $scope.$on("$destroy", function () {
                dataService.unregister('load', updateData);
            });

            function newEditDialog(item){
                /*jshint -W040*/
                protalDialogService($scope.option.columns,{title:this.title+' '+$scope.option.title,buttons:[
                    function Ok(scope){
                        dataService.postData(scope.entity);
                    },
                    function Cancel(scope){

                    }
                ]},item||{id:0});
            }

            function updateData() {
                var data = dataService.getList();
                $scope.dataList = data.slice(0,$scope.option.pageSize);
                $scope.pageCount = parseInt((data.length + $scope.option.pageSize -1) / $scope.option.pageSize);
                $scope.pageNumber = 1;
                $scope.pageView = 'View 1 - '+Math.min($scope.option.pageSize,data.length)+' of ' + data.length;
            }
        };
    }]);
})(window.angular);