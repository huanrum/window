(function (angular) {
	'use strict';

	angular.module('cms.main').factory('reportingUsageStatueChangeService', ['baseService', function (baseService) {

		return baseService({
			loadData:{url:'/usageReport/usageReportLog'},
			downloadData:{url:'/usageReport/exportUsageReportLog'}
		});
	}]);

})(window.angular);