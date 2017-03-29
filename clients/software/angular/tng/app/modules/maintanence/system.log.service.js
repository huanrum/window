(function (angular) {
	'use strict';

	angular.module('cms.main').factory('logService', ['$http','baseService', function ($http,baseService) {
		return baseService('log','/public/log',{});
	}]);

})(window.angular);