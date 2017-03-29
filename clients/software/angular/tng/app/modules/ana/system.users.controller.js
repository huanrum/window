(function (angular) {
	'use strict';

	angular.module('cms.main').controller('usersController', ['$scope','baseController','usersDialogUiService','usersService','manageHttpToken', function ($scope,baseController,dialogUi,userService,manageHttpToken) {

		$scope.addButtonTitle = 'addUserAccount';
		$scope.columns = [
			{
				'title':'loginId',
				'field':'account'
			},
			{
				'title':'userName',
				'field':'name'
			},
			{
				'title':'dateModified',
				'field':'updatedTime',
				'type':'sinoDate(yyyy/MM/dd)'
			},
			{
				'title':'role',
				'field':'roles',
				'tooltip':'600px',
				'notSort':true,
				'type':'[lookup(roleIds,name)]'
			}
		];
		$scope.searchColumns = [];
		$scope.actions = [
			'edit',
			{
				'title': 'remove',
				'class': 'fa fa-fw fa-trash',
				'disable':function(item){
					return !$scope.permission['delete'] || manageHttpToken.user().id === item.id;
				},
				'fn': function (item) {
					if(!$scope.permission.edit){
						return;
					}
					$scope.remove(item, 'confirm');
				}
			}
		];
		baseController($scope,dialogUi,userService);

	}]);

})(window.angular);