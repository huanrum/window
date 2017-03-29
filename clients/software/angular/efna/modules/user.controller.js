(function (angular) {
	'use strict';

	angular.module('cms.main').controller('userController', ['$scope','$state','_','baseController','lookupService','userDialogUiService','userService', function ($scope,$state,_,baseController,lookupService,dialogUi,userService) {

		$scope.title = 'user';
		$scope.notSort = true;
		$scope.columns = [
			{
				title:'loginId',
				field:'loginId'
			},
			{
				title:'dateModified',
				field:'date'
			},
			{
				title:'level',
				field:'roleIds',
				type:['[lookup(level,menuName)]','language','array']
			}
		];

		$scope.search = function(e){
			if(e.keyCode === 13){
				$scope.refreshData();
			}
		};

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
				class:'fa fa-fw fa-trash',
				fn:function(item){
					$scope.delete(angular.extend(item,{id : item.userId}),'confirm');
				}
			}
		];

		$scope.toolbars = [
			{
				info:'add',
				class:'fa-plus-circle font-green',
				fn:function(){
					$scope.new({nickname:' '},'confirm');
				}
			}
		];

		baseController($scope,dialogUi,userService);

	}]);

})(window.angular);