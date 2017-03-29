(function (angular) {
	'use strict';

	angular.module('cms.main').controller('checkController', ['$scope','baseController','checkService', function ($scope,baseController,userService) {

		$scope.columns = [
			{
				'title':'component',
				'field':'component'
			},
			{
				'title':'domain',
				'field':'domain'
			},
			{
				'title':'status',
				'field':'status',
				'class':'text-center',
				'width':'5em',
				'formatter':function(value){
					return '<i class="fa fa-2x '+(!value?'fa-check-circle succeed-icon':'fa-times-circle error-icon')+'"></i>';
				}
			}
		];

		$scope.toolbars = [
			{
				'info':'refresh',
				'class':'fa fa-refresh',
				'fn':function(){
					$scope.refreshData();
				}
			}
		];

		$scope.$interval = 5 * 60 * 1000;
		$scope.actions = [];
		$scope.notSort = true;

		baseController($scope,null,userService);

		$scope.filter = {};

	}]);

})(window.angular);