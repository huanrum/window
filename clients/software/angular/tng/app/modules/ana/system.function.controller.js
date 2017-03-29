(function (angular) {
	'use strict';

	angular.module('cms.main').controller('functionController', ['$scope','baseController','functionDialogUiService','functionService', function ($scope,baseController,dialogUi,functionService) {

		$scope.addButtonTitle = 'addFunction';
		$scope.columns = [
			{
				'title':'application',
				'field':'application.name',
				'notSort':true
			},
			{
				'title':'code',
				'field':'code'
			},
			{
				'title':'description',
				'field':'description',
				'notSort':true
			}
		];

		baseController($scope,dialogUi,functionService);
	}]);

})(window.angular);