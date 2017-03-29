(function (angular) {
	'use strict';

	angular.module('cms.main').controller('versionController', ['$scope','baseController','versionDialogUiService','versionService', function ($scope,baseController,dialogUi,versionService) {

		$scope.title = 'version';
		$scope.notSort = true;
		$scope.columns = [
			{
				title:'versionNumber',
				field:'versionNo'
			},
			{
				title:'dateCreate',
				field:'createdDate',
				type:'sinoDate(dd MMM,yyyy)'
			},
			{
				title:'dateModify',
				field:'updatedDate',
				type:'sinoDate(dd MMM,yyyy)'
			}
		];

		$scope.actions = [
			{
				title:'edit',
				class:'fa-edit',
				fn:function(item){
					$scope.edit(item,'confirm');
				}
			},
			{
				title:'delete',
				class:'fa-trash',
				fn:function(item){
					$scope.delete(item);
				}
			}
		];

		$scope.toolbars = [
			{
				info:'add',
				class:'fa-plus-circle font-green',
				fn:function(){
					$scope.new({},'confirm');
				}
			}
		];

		baseController($scope,dialogUi,versionService);
	}]);

})(window.angular);