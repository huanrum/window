(function (angular) {
	'use strict';

	angular.module('cms.main').factory('userDialogValidationService', ['$filter','$global','passwordRegex',function ($filter,$global,passwordRegex) {
		var languageFilter =  $filter('language');
		return {
			password:function (entity, $error) {
				if(!entity.userId && !entity.password) {
					$error.password = languageFilter('errorMessageIsRequired');
					return true;
				}
				if(entity.password && !passwordRegex.test(entity.password)){
					$error.password = languageFilter(passwordRegex.error(entity.password));
					return true;
				}
				delete $error.password;
			},
			rePassword:function (entity, $error) {
				if (entity.rePassword !== entity.password) {
					$error.$empty$rePassword = languageFilter('twoDifferent');
					return true;
				} else {
					delete $error.$empty$rePassword;
				}
			},
			loginId:function (entity, $error) {
				if(!entity.loginId){
					$error.loginId = languageFilter('errorMessageIsRequired');
				}else if (!/^[a-zA-Z0-9\-_]{3,15}$/.test(entity.loginId)) {
					$error.loginId = languageFilter('regexLoginId');
					return true;
				} else {
					delete $error.loginId;
				}
			}
		};
	}]);


	angular.module('cms.main').factory('userDialogUiService', ['_','lookupService','userDialogValidationService',function (_,lookupService,validationService) {

		function collectEntity(entity){
			return {
				userId: entity.userId,
				loginId: entity.loginId,
				nickname: entity.nickname,
				password: entity.password,
				roleIds: entity.roleIds&&entity.roleIds.split(',')||[]
			};
		}

		return function() {
			return {
				rows:getRows,
				collectEntity:collectEntity
			};

			function getRows(entity){
				return {
					left: [
						{
							title: 'loginId',
							field: 'loginId',
							width: '200px',
							editor: !entity.userId && 'text',
							required: true,
							validate: validationService.loginId
						},
						{
							title: 'password',
							field: 'password',
							required: true,
							editor: 'password',
							editorInfo:entity.userId && '********',
							tooltip:'regexPassword',
							validate: validationService.password
						},
						{
							title: 'rePassword',
							field: 'rePassword',
							editor: 'password',
							editorInfo:entity.userId && '********',
							required: true,
							validate: validationService.rePassword
						}

					],
					right: [
						{
							title: 'level',
							field: 'roleIds',
							editor: _.zipObject(_.map(lookupService('level'),function(v,k){return [k, {name:v.menuName,sort: v.seq}];}))
						}
					]
				};
			}

		};
	}]);

})(window.angular);