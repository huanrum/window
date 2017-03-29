(function (angular) {
	'use strict';

	angular.module('cms.main').factory('versionService', ['$timeout','$http','baseService', function ($timeout,$http,baseService) {

		var service = baseService({
			loadData:{url:'/appVersion/appVersions'},
			newData:{url:'/appVersion'},
			updateData:{url:'/appVersion'},
			deleteData:{url:'/appVersion'}
		});

		service.push = function (item){
			$http.get(baseService.url('/updatePush/'+item.id));
			return $timeout(function(){},3000);
		};

		return service;
	}]);

})(window.angular);