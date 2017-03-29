(function (angular) {
	'use strict';

	angular.module('cms.main').controller('guidelineController', ['$scope','baseController','guidelineDialogUiService','guidelineService',
		function ($scope,baseController,dialogUi,guidelineService) {

			$scope.title = 'guideline';
			$scope.languageTypes = ['EN', 'EN', 'TC'];
			$scope.actions = [
				{
					title: 'edit',
					class: 'fa-edit',
					fn: function (item) {
						$scope.edit(item, 'confirm');
					}
				}
			];

			$scope.fileUrl = guidelineService.fileUrl;

			baseController($scope, dialogUi, guidelineService);
		}]);

})(window.angular);