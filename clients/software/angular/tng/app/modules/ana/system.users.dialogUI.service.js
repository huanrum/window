(function (angular) {
	'use strict';

	function collectEntity(_,applications){
		return function (entity){
			var newEntity = {
				account:entity.account,
				name:entity.name,
				password:entity.password,
				rePassword:entity.rePassword,
				mobile:entity.mobile,
				email:entity.account,
				roles:_.union.apply(null,_.map(applications,function(m){
					if(entity['$roleIds'+ m.code]){
						return _.map(entity['$roleIds'+ m.code].split(','),function(i){return parseInt(i);});
					}else{
						return [];
					}
				}))
			};
			if(angular.isDefined(entity.id)){
				newEntity.id = entity.id;
			}
			return newEntity;
		};
	}

	angular.module('cms.main').factory('usersDialogUiService', ['_','lookupService',function (_,lookupService) {

		return function($scope, dataService, type) {
			var  applications = _.filter(_.map(lookupService('module')),function(i){return i.isDisplay;});

			return {
				'class':'user-dialog',
				'rows':getRows,
				'collectEntity':collectEntity(_,applications)
			};

			function getRows(entity){
				entity.roleIds = [];

				return {
					'$empty$common':{
						'left': [
							{
								'title':'inOutSide',
								'field':'type',
								'editor': _.map(lookupService('inOutSide')),
								'disable':true
							},
							{
								'title': 'loginId',
								'field':'account',
								'width': '200px',
								'validate':'email()',
								'editor': type === 'create' && 'text',
								'required': true
							},
							{
								'title': 'userName',
								'field': 'name',
								'width': '200px',
								'editor':'text',
								'validate':'length(90)',
								'required': true
							},
							{
								'title': 'phoneNumber',
								'field': 'mobile',
								'width': '200px',
								'editor':'text',
								'validate':'phone()',
								'required': true
							},
							{
								'title': 'password',
								'field': 'password',
								'required':type === 'create',
								'editor': 'password',
								'editorInfo':type !== 'create' && '********',
								//tooltip:'regexPassword',
								'validate': 'password()'
							},
							{
								'title': 'rePassword',
								'field': 'rePassword',
								'editor': 'password',
								'editorInfo':type !== 'create' && '********',
								'required': type === 'create',
								'related':'password',
								'validate': 'rePassword()'
							}
						]
					},
					role:{
						left: _.zipObject(_.map(applications,function(i){return i.name;}),_.map(applications,function(m){
							var roleIds = _.filter(lookupService('roleIds'),function(i){return i.applicationCode === m.code;});
							entity['$roleIds'+ m.code] = _.map(_.filter(roleIds,function(i){return _.indexOf(entity.roles,i.id) !== -1;}),function(i){return i.id;});
							return [
								{
									'field':'$roleIds'+ m.code,
									'editor': _.zipObject(_.map(roleIds,function(i){return i.id;}),roleIds)
								}
							];
						}))
					}
				};
			}

		};
	}]);

})(window.angular);