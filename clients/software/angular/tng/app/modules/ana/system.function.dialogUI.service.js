(function (angular) {
	'use strict';


	angular.module('cms.main').factory('functionDialogUiService', ['_','$filter','lookupService','helper',function (_,$filter,lookupService,helper) {

		function collectEntity(entity){
			return angular.extend({},entity,{permissionSum:helper.permissionSum(entity.permissionSum)});
		}

		return function() {
			return {
				'width':600,
				'class':'function-dialog',
				'rows':getRows,
				'collectEntity':collectEntity
			};

			function getRows(entity) {

				entity.applicationCode = entity.application && entity.application.code;
				delete entity.application;
				entity.permissionSum = helper.permissionSum(entity.permissionSum,lookupService('permission'));

				return {
					'$empty$base': {
                        'left': [{
							'title': 'code',
							'field': 'code',
							'width': 0.333,
							'editor': (!entity.code) && 'text',
                            'required': true,
                            'validate':'functionRole()'
						},
						{
							'title': 'description',
							'field': 'description',
							'width': 0.666,
							'editor': 'text'
						},
						{
							'title': 'application',
							'field': 'applicationCode',
							'editor': _.filter(_.map(lookupService('module')),function(i){return i.isDisplay;})
						}]
                    },
					'$empty$permission': {
						'left': [
							{
								'title':'permission',
								'field':'permissionSum',
								'editor':_.zipObject(_.map(lookupService('permission'),function(v,k){return k;}),_.map(lookupService('permission'),function(i,key){return {sort:key,id: i.id,name: i.name};}))
							}
						],
						'right': [
							{
								'title':'description',
								'field':'description',
								'editor':function(){
									return _.map(_.map(lookupService('permission'),function(i){
										return '<div sino-tooltip="255">'+ (i.description || '&nbsp;') +'</div>';
									}));
								}
							}
						]
					}
				};
			}
		};
	}]);

})(window.angular);