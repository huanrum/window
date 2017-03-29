(function (angular) {
	'use strict';

	angular.module('cms.main').factory('checkService', ['$http','baseService', function ($http,baseService) {
		return baseService('monitor','/public',{});
	}]);

})(window.angular);