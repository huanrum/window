/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular){
	
	'use strict';

	angular.module('staff.common').directive('protalForm',['$sce','$compile','fomatter','editor','$global',function($sce,$compile,fomatter,editor,$global) {
		return {
			restrict: "AE",
			scope: '=',
			link: function ($scope, element) {
				var template = '<table class="protal-form"><thead><th></th><th></th><th></th><th></th></thead><tbody>@content@</tbody></table>';
				var tablecontent =[];
				$scope.formatters = {};
				$scope.editors = {};
				angular.forEach($scope.option.columns, function (column,index) {
					$scope.formatters[column.model] = function() {
						var item = $scope.entity || {};
						var html = ((angular.isString(column.formatter)?fomatter[column.formatter]:column.formatter )|| function () {
							return item[column.model];
						})(0, index,  item[column.model], item, column);
						return $sce.trustAsHtml(''+(html===undefined?'':html));
					};

					$scope.editors[column.model] = function(){
						var item = $scope.entity || {};
						var html = (editor(column.editor)|| $scope.formatters[column.model])(0, index,  item[column.model], item, column);
						return $sce.trustAsHtml((''+(html===undefined?'':html)).replace('@ng-model@','ng-model="entity.'+column.model+'"'));
					};

					if(index%2 === 0){
						if(index>0){
							tablecontent[tablecontent.length-1] = tablecontent[tablecontent.length-1] + '</tr>';
						}
						tablecontent.push('<tr>');
					}
					tablecontent[tablecontent.length-1] = tablecontent[tablecontent.length-1] + '<td width="120px">'+column.title+'</td><td width="200px" ng-bind-html="editors.'+column.model+'()"></td>';
				});

				tablecontent[tablecontent.length-1] = tablecontent[tablecontent.length-1] + '</tr>';
				$compile(angular.element(template.replace('@content@', tablecontent.join(''))).appendTo(element))($scope);
			}
		};

	}]);
})(window.angular);