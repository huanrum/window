(function (angular) {
	'use strict';

	angular.module('cms.common').controller('loginController', ['$scope', '$state', '$global', 'manageHttpToken','baseDialog',function ($scope, $state, $global,manageHttpToken,baseDialog) {

		$scope.entity = manageHttpToken.user()|| {};
		$scope.version = $global.version;
		$scope.compileDate = new Date(window.compileDate).toLocaleString();

		$scope.login = function (){
			manageHttpToken.login($scope.entity).then(function (req) {
				if (req.data.status.code) {
					$scope.returnMessage = req.data.status;
				} else {
					$state.go('main');
				}
			});
		};

		$scope.keydown = function(e){
			if(e.keyCode === 13){
				$scope.login();
			}
		};
		$scope.resetLogin = function(){
			$scope.forget = false;
		};

		$scope.forgetPassword = function(forget){
            $scope.btnDisabled = false;
            $scope.returnErrorMessage = "";
            $scope.returnSuccessMessage = "";
			if(!forget){
				if($scope.entity.loginId){
					callService($scope.entity.loginId);
				}else{
					baseDialog.input('inputEmail','', ' ',{height:60},true).then(function(entity){
						callService(entity);
					});
				}
			}else{
				$scope.forget = true;
			}
			function callService(loginId){
				manageHttpToken.send(loginId).then(function(message){
                    $scope.returnError = message.error;
					$scope.returnSuccess = message.success;
                    if(!$scope.returnErrorMessage){
                        $scope.btnDisabled = true;
                    }
				});
			}
		};

		$scope.actions = [
			{
				'title': 'clear',
				'class': 'btn-primary',
				'fn': function () {
					$scope.entity = {};
				}
			},
			{
				'title': 'login',
				'class': 'btn-primary',
				'fn': $scope.login
			}
		];

	}]);

})(window.angular);