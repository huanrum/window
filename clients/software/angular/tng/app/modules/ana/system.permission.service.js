(function (angular) {
	'use strict';

	angular.module('cms.main').factory('permissionService', ['baseService', function (baseService) {

		return baseService('ana','/permission',{});

	}]);

})(window.angular);