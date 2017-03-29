(function (angular) {
	'use strict';

	angular.module('cms.common').controller('resetController', ['$scope', '$stateParams', '$state', 'validationService', 'baseDialog','manageHttpToken',
		function ($scope, $stateParams, $state, validatorService, baseDialog,manageHttpToken) {
			$scope.reset = true;
			$scope.user = {validCode: $stateParams.loginId};
			$scope.$error = {};
			$scope.validaOne = function () {
				if(!validatorService.required.call({title:'newPassword',field:'password'},$scope.user, $scope.$error)){
					return validatorService.password().call({title:'newPassword',field:'password'},$scope.user, $scope.$error);
				}
			};
			$scope.validaTwo = function () {
				return validatorService.rePassword().call({title:'rePassword',field:'repassword',related:'password'},$scope.user, $scope.$error);
			};
			$scope.success = function () {
				if(!baseDialog.message.validate($scope.$error)){
					manageHttpToken.forget($scope.user).then(function () {
						baseDialog.message(1,'','{{entity.content |language}} ',{content:'errorChangePassword'},'ok').then(function(){
							$state.go('login');
						});
					});
				}
			};
		}]);

})(window.angular);