/**
 * Created by Administrator on 2016/4/21.
 */
(function(angular){
	'use strict';

		angular.module('staff.common').directive('protalLoginDialog', ['$http','$compile','$rootScope','$global',function($http,$compile,$rootScope,$global) {

			function getTemplate() {
				return [
					'<div class="modal-login-dialog">',
					'	<div class="dialog-parent">',
					'	    <div class="dialog">',
					'	        <header>',
					'	            <label ng-bind="title"></label>',
					'	        </header>',
					'	        <section>',
					'	            <img ng-src="{{img}}" ng-hide="!img">',
					'	            <table>',
					'	                <tbody>',
					'	                    <tr>',
					'	                        <td></td>',
					'	                        <td><h4>Login Id</h4></td>',
					'	                        <td><input ng-model="username"></td>',
					'	                	    <td></td>',
					'	                	</tr>',
					'	                	<tr>',
					'	                	    <td></td>',
					'	                	    <td><h4>Password</h4></td>',
					'	                        <td><input ng-model="password" type="password"></td>',
					'	                	    <td></td>',
					'	                	</tr>',
					'	                	<tr>',
					'	                	    <td></td>',
					'	                	    <td colspan="2">',
					'	                	        <button ng-click="login()">Login</button>',
					'	                	    </td>',
					'	                	    <td></td>',
					'	                	</tr>',
					'	                	<tr>',
					'	                	    <td colspan="4">',
					'	                	        <a class="ng-btn">Location:</a>&nbsp;<span>Front Desk 1</span>',
					'	                            <a class="ng-btn">Reset Password</a>',
					'	                        </td>',
					'	                    </tr>',
					'	                </tbody>',
					'	            </table>',
					'	        </section>',
					'	        <footer>',
					'	            <span ng-repeat="buttonItem in buttons">',
					'		            <button ng-click="buttonItem.fn($even)">',
					'		                 <i ng-bind="buttonItem.name"></i>',
					'		            </button>',
					'		        </span>',
					'	        </footer>',
					'       </div>',
					'   </div>',
					'</div>'
				].join('');
			}

			return {
				restrict: "AE",
				template: getTemplate(),
				link: function ($scope, element) {
					$scope.title = 'Login Dialog';
					$scope.img = 'images/login.png';

					$scope.username = 'seto1';
					$scope.password = 'a1234567';

					$scope.login = function login() {
						$http({
							method: 'POST',
							url: $global.urls.login,
							data: {
								"username": $scope.username,
								"password": $scope.password,
								"location": $scope.location || 'FD1',
								"validCode": ''
							}
						}).then(function (req) {
							if (req.data.returnCode === '0') {
								$global.location = req.config.data.location;
								$global.username = req.data.data.name;
								$global.userNo = req.data.data.id;
								$global.token =  req.data.data.token;
								$global.sessionId =  req.data.data.sessionId;
								element.parent().append($compile(angular.element('<header/><div protal-ui-menu></div><div protal-splitter/><div ui-view></div>'))($rootScope.$new()));
								element.remove();
							}
						});
					};

					if($global.isDebug){
						$scope.login();
					}
				}
			};
		}]);


})(window.angular);