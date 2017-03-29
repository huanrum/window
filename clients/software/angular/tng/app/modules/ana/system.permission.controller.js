(function (angular) {
	'use strict';

	angular.module('cms.main').controller('permissionController', ['$scope','baseController','permissionDialogUiService','permissionService', function ($scope,baseController,dialogUi,permissionService) {

		$scope.addButtonTitle = 'addPermission';
		$scope.columns = [
			{
				'title':'name',
				'field':'name'
			},
			{
				'title':'description',
				'field':'description',
				'tooltip':'1000px',
				'notSort':true
			}
		];

		baseController($scope,dialogUi,permissionService);
	}]);

})(window.angular);