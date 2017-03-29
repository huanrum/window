/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular){
	
	'use strict';

	angular.module('staff.common').directive('protalGridRight',['$sce','$compile','$global',function($sce,$compile,$global) {
		return {
			restrict: "AE",
			scope: {
				item:'=protalEntity',
				rowClick:'=rowClick',
				rightMenus:'=protalGridRight'
			},
			link: function ($scope, element, $attr) {

				element.on('contextmenu',function(e){
					angular.element('body').on('click',click);
					element.parent().find('.protal-grid-right-contextmenu').remove();
					var temp = angular.element('<ul class="protal-grid-right-contextmenu"></ul>').appendTo(element).css({top: e.clientY,left:e.clientX});
					angular.forEach($scope.rightMenus,function(menu){
						if(!menu.filter || menu.filter($scope.item)){
							angular.element('<li>'+menu.title+'</li>').appendTo(temp).click(function(){
								menu.fn($scope.item);
							});
						}
					});

					return false;
					function click(){
						element.parent().find('.protal-grid-right-contextmenu').remove();
						angular.element('body').off('click',click);
					}
				});
			}
		};
	}]);

	angular.module('staff.common').directive('protalGrid',['$sce','$compile','fomatter','$global',function($sce,$compile,fomatter,$global) {
		return {
			restrict: "AE",
			scope: '=',
			link: function ($scope, element) {
				var template = '<table><thead><tr>@header@</tr></thead><tbody><tr ng-repeat="item in dataList" protal-grid-right="option.rightMenus" data-protal-entity="item" ng-dblclick="rowClick($event,item)">@content@</tr></tbody></table>';
				var tableHeder = '';
				var tablecontent = '';
				$scope.formatters = {};
				angular.forEach($scope.option.columns, function (column,index) {
					$scope.formatters[column.model] = function(r) {
						var item = $scope.dataList[r];
						var html = ((angular.isString(column.formatter)?fomatter[column.formatter]:column.formatter )|| function () {
							return item[column.model];
						})(r, index,  item[column.model], item, column);
						return $sce.trustAsHtml(''+(html===undefined?'':html));
					};

					tableHeder += '<th width="'+((column.width+'px') || '')+'">' + column.title + '</th>';
					tablecontent += '<td ng-bind-html="formatters.'+column.model+'($index)"></td>';
				});

				$compile(angular.element(template.replace('@header@', tableHeder).replace('@content@', tablecontent)).appendTo(element))($scope);

			}
		};

	}]);
})(window.angular);