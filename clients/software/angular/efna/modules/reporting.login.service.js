(function (angular) {
	'use strict';

	angular.module('cms.main').factory('reportingLoginService', ['baseService', function (baseService) {

		return baseService({
			loadData:{url:'/loginLogReport/'},
			downloadData:{url:'/loginLogReport/export/'}
		});
	}]);

})(window.angular);