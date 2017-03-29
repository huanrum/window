(function (angular) {
	'use strict';

	angular.module('cms.main').controller('roleController', ['$scope','baseController','roleDialogUiService','roleService', function ($scope,baseController,dialogUi,userService) {

		$scope.addButtonTitle = 'addUserRole';
		$scope.columns = [
			{
				'title':'role',
				'field':'name'
			},
			{
				'title':'dateModified',
				'field':'lastModifyDate',
				'type':'sinoDate(yyyy/MM/dd)'
			}
		];

		baseController($scope,dialogUi,userService);

	}]);

})(window.angular);