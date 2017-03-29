(function (angular) {
	'use strict';

	angular.module('cms.common').controller('loginController', ['$scope', '$http', '$state', '$global', '$localStorage','editUser', function ($scope, $http, $state, $global, $localStorage,editUser) {

		var $localStorageUser = JSON.parse($localStorage.user||'null');
		$scope.user = $localStorageUser&&{username:$localStorageUser.name} || $global.isDebug && {username: 'seto', password: 'z12345678'};
		$scope.version = $global.version;
		$scope.actions = [
			{
				title: 'login',
				class: 'btn-warning',
				fn: function () {
					editUser.login($scope.user).then(function (req) {
						if (req.data && req.data.data && req.data.returnCode === '0') {
							$localStorage.user = JSON.stringify({
								userId: req.data.data.userId,
								name: req.data.data.userName,
								theme:req.data.data.userName.toLocaleLowerCase(),
								date: Date.now()
							});
							$localStorage.token = req.headers('token');
							$state.go('main');
						} else {
							$scope.returnMessage = req.data ? req.data.returnMessage : 'Login failed';
						}
					});
				}
			}
		];
	}]);


	angular.module('cms.common').factory('editUserValidationService', ['_','$q','$http', '$filter','$global','passwordRegex', function (_,$q,$http, $filter,$global,passwordRegex) {
		var languageFilter =  $filter('language');
		return {
			newPassword: function (entity, $error) {
				if (!entity.newPassword) {
					$error.newPassword = languageFilter('errorMessageIsRequired');
					return true;
				}else if(!passwordRegex.test(entity.newPassword)){
					$error.newPassword = languageFilter(passwordRegex.error(entity.newPassword));
					return true;
				}else if(entity.newPassword === entity.password){
					$error.newPassword =  languageFilter('newSameAsOld');
				}else{
					delete $error.newPassword;
				}
			},
			rePassword:function (entity, $error) {
				if (entity.rePassword !== entity.newPassword) {
					$error.rePassword = languageFilter('twoDifferent');
					return true;
				}else {
					delete $error.rePassword;
				}
			}
		};
	}]);

	angular.module('cms.common').factory('editUser', ['_','$q','$http','$global','menuData','baseDialog','$injector', function (_,$q,$http,$global,menuData,baseDialog,$injector) {

		var validationService = $injector.get('editUserValidationService');
		var baseService = $injector.get('baseService');
		var checkHttpResponse =  $injector.get('checkHttpResponse');
		return {
			getRows: getRows,
			getMenus : getMenus,
			login:login,
			logout: logout,
			update: update
		};
		function getRows() {
			return [
				{
					title: 'oldPassword',
					field: 'password',
					editor: 'password',
					required: true
				},
				{
					title: 'newPassword',
					field: 'newPassword',
					editor: 'password',
					required: true,
					tooltip:'regexPassword',
					validate: validationService.newPassword
				},
				{
					title: 'rePassword',
					field: 'rePassword',
					editor: 'password',
					required: true,
					validate: validationService.rePassword
				}
			];
		}

		function getMenus(){
			var defer = $q.defer();
			$http.get(baseService.url('/userAccess/user/permission')).then(checkHttpResponse(function(req){
				defer.resolve(_.map(req.data.data,function(item){
					var menuItem = _.find(menuData,{permission:item.index});
					return angular.extend({},menuItem||{},{permission:item});
				}));
			},function(){
				defer.resolve(menuData);
			}));
			return defer.promise;
		}

		function login(user) {
			return $http.post(baseService.url( '/home/stafflogin'), user);
		}

		function logout() {
			return $http.get(baseService.url('/home/logout')).then(function(){
				$injector.get('$localStorage').user = null;
				$injector.get('$state').go('login');
			});
		}

		function update(title,entity) {
			var defer = $q.defer();
			$http.post(baseService.url('/userAccess/user/changepsw'), {
				userId:entity.userId,
				nickname:entity.name,
				password:entity.password,
				newPassword:entity.newPassword
			}).then(function(req){
				if(req.data.returnCode === '0'){
					defer.resolve();
				}else{
					baseDialog.message(2, title + ' ' + req.data.returnCode, req.data.returnMessage, {}, 'ok', 2000);
				}
			});
			return defer.promise;
		}

	}]);

})(window.angular);