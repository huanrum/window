(function (angular) {
	'use strict';

	angular.module('cms.main').factory('functionService', ['baseService', function (baseService) {

		return baseService('ana','/function',{
			'lookup':{
				'permission':'/permission'
			}
		});

	}]);

})(window.angular);