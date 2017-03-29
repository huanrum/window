(function (angular) {
	'use strict';

	angular.module('cms.main').factory('userService', ['baseService', function (baseService) {

		return baseService({
			loadData:{url:'/userAccess/users'},
			updateData:{url:'/userAccess/user'},
			newData:{url:'/userAccess/user'},
			deleteData:{url:'/userAccess/user'},
			lookup:{
				'level:roleId':'/menu/menus'
			}
		});

	}]);

})(window.angular);