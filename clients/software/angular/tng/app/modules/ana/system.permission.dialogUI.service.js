(function (angular) {
	'use strict';

	angular.module('cms.main').factory('permissionDialogUiService', [function () {

		return function() {
			return {
				class:'permission-dialog',
				rows:getRows
			};

			function getRows(){
				return {
					left: [
						{
							'title': 'name',
							'field': 'name',
							'editor': 'text',
							'required': true,
							'validate':'length(20)'
						},
						{
							'title': 'description',
							'field': 'description',
							'editor': 'text'
						}
					]
				};
			}

		};
	}]);

})(window.angular);