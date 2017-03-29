(function (angular) {
	'use strict';

	angular.module('cms.main').factory('versionDialogUiService', [function () {

		return function(){
			return {
				rows:getRows,
				collectEntity:collectEntity
			};

			function getRows() {
				return [
					{
						title: 'versionNumber',
						field: 'versionNo',
						required: true,
						editor: 'text'
					},
					{
						title: 'appLink',
						field: 'downloadLink',
						required: true,
						editor: 'text'
					},
					{
						title: 'forceUpdate',
						field: 'forceUpdate',
						editor: 'sino-checkbox'
					}
				];
			}
		};

		function collectEntity(entity){
			return {
				downloadLink: entity.downloadLink,
				forceUpdate: entity.forceUpdate,
				id: entity.id,
				versionNo: entity.versionNo
			};
		}
	}]);

})(window.angular);