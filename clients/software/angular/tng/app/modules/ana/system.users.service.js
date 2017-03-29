(function (angular) {
	'use strict';

	angular.module('cms.main').factory('usersService', ['baseService', function (baseService) {

		return baseService('ana','/account',{
			'lookup':{
				'roleIds':'/role'
			}
		});

	}]);

})(window.angular);