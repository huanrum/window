/**
 * Created by Administrator on 2016/6/11.
 */
(function(angular){

    'use strict';

    angular.module('staff.common').directive('protalContentContent',['$compile','editor','$global',function($compile,editor,$global){

        function getTemplate(directive,headerTemp,contentTemp,footerTemp){
            if(directive === 'grid' || directive === 'form'){
                return [
                    '<div class="content-header">@header@</div>',
                    '<div protal-splitter="true"/>',
                    '<div class="content-content">@content@</div>',
                    '<div class="content-footer">@footer@</div>'
                ].join('').replace('@header@',headerTemp).replace('@content@',contentTemp).replace('@footer@',footerTemp);
            }else{
                return directive;
            }
        }

        function getPageOption(){
            return [
                '<li><a ng-class="{disable:pageNumber===1}" ng-click="pageNumber===1 || goPage(1)"><img src="images/BE_first_page.png"></a></li>',
                '<li><a  ng-class="{disable:pageNumber<=1}" ng-click="pageNumber<=1 || goPage(false)"> <img src="images/BE_previous_page.png"></a></li>',
                '<li><div class="pc-brown-font"><label class="ng-binding"> Page&nbsp; @pageNumber@ &nbsp;of {{pageCount}} </label></div></li>',
                '<li><a  ng-class="{disable:pageNumber>=pageCount}" ng-click="pageNumber>=pageCount || goPage(true)"> <img src="images/BE_next_page.png"></a></li>',
                '<li><a  ng-class="{disable:pageNumber===pageCount}" ng-click="pageNumber===pageCount || goPage(0)"> <img src="images/BE_last_page.png"></a></li>'
            ].join('')
                .replace('@pageNumber@','<input type="text" class="text-center ng-pristine ng-valid ng-touched" size="3" ng-model="pageNumber" ng-keydown="goPage(pageNumber)">');
        }

        var defaultOption = {
            template:'grid'
        };

        return {
            restrict: "AE",
            scope:'=',
            link: function ($scope,element) {
                var headerTemp = '<button ng-if="!option.canUpdateBySelect()" ng-click="apply(filter)">Apply</button>',contentTemp = '', footerTemp = '';
                var template = '',menuTemp = '<ul><li ng-repeat="menu in option.menus"><div ng-bind="menu.title" ng-click="$last || menu.click()"></div></li></ul>';
                $scope.option = angular.extend({menus : $global.urlPaths()},defaultOption,$scope.option);

                angular.forEach($scope.option.columns,function(column,index){
                    if(column.editor || column.model === 'id'){
                        var html = (editor(column.editor)||function(){return '<input type="number" @ng-model@>';})(0, index,  null, null, column);
                        headerTemp += '<label>'+column.title+'</label>&nbsp;' + (''+(html===undefined?'':html)).replace('@ng-model@','class="filter-editor" ng-model="filter.'+column.model+'" ng-change="changeSelect(filter,'+column.model+')"');
                    }
                });

                contentTemp = '<div protal-' + $scope.option.template +'></div>';

                footerTemp = [
                    '<div class="pagination-button">',
                        '<li ng-repeat="btn in option.buttons"><a ng-click="btn.click()"><img ng-src="{{btn.img}}"> <label class="pc-brown-font pointer">{{btn.title}}</label></a></li>',
                    '</div>',
                    '<div class="table-page">'+ getPageOption() +'</div>',
                    '<div class="table-view"><p ng-bind="pageView"></p></div>'
                ].join('');

                $compile(angular.element(menuTemp + getTemplate($scope.option.template,headerTemp,contentTemp,footerTemp)).appendTo(element))($scope);
            }
        };

    }]);
})(window.angular);