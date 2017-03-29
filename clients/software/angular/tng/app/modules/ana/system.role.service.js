(function (angular) {
	'use strict';

	angular.module('cms.main').factory('roleService', ['baseService', function (baseService) {

		return baseService('ana','/role',{
			'get':'/role',
			'lookup':{
				'permission':'/permission',
				'functions':'/function'
			}
		});
	}]);

})(window.angular);