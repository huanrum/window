(function (angular) {
	'use strict';

	angular.module('cms.main').factory('reportingUsageFileSummaryService', ['baseService', function (baseService) {

		return baseService({
			loadData:{url:'/usageReport/usageReport'},
			downloadData:{url:'/usageReport/exportUsageReport'}
		});
	}]);

})(window.angular);