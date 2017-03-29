(function (angular) {
	'use strict';

	angular.module('cms.main').controller('logController', ['$scope','baseController','logService', function ($scope,baseController,userService) {

		$scope.columns = [
			{
				'title':'application',
				'field':'applicationCode'
			},
			{
				'title':'createdDate',
				'field':'createdDate'
			},
			{
				'title':'exceptionType',
				'field':'exceptionType',
				'tooltip':200
			},
			{
				'title':'exceptionClass',
				'field':'exceptionClass',
				'tooltip':200
			},
			{
				'title':'exceptionMethod',
				'field':'exceptionMethod'
			},
			{
				'title':'exceptionMsg',
				'field':'exceptionMsg',
				'tooltip':300
			},
			{
				'title':'exceptionLine',
				'field':'exceptionLine'
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

		$scope.searchColumns = [
			{
				'title': 'application',
				'field': 'applicationCode',
				'editor': 'module'
			}
		];

		$scope.actions = [];
		$scope.notSort = true;


		baseController($scope,null,userService);
		$scope.operate = $scope.view;

	}]);

})(window.angular);