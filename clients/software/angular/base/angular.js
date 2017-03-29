/**
 * Created by sus on 2016/1/8.
 */
(function($e,angular){
	'use strict';

	$e(function base(){

		initialization(angular.module('angular.base',[]));

		return {
			title:'Base',
			sign:'Waiting Learn(ng-book 458)',
			fn:function(panel,base){
				panel.classList.add('angular-base');
				angular.element(base.template).find('.angular-base').appendTo(panel);
				angular.bootstrap(panel,['angular.base']);
			}
		};

		function initialization(module){

			module.controller('angularBaseController',
				['$scope',function($scope) {

					$scope.decimals = 21.23456789 + Math.random();

					$scope.liName = 'Li-';
					$scope.items = ['aa','bb','cc','dd'];

					$scope.personName = 'Ari';

					$scope.decrement = function() {
						$scope.count = $scope.count - 1;
					};

					$scope.cities = [
						{name: 'Seattle'},
						{name: 'San Francisco'},
						{name: 'Chicago'},
						{name: 'New York'},
						{name: 'Boston'}
					];

				}]);

			module.controller('angularBaseMyController',
				['$scope',function($scope) {

				}]);
		}
	});

	$e(function service(){

		initialization(angular.module('angular.service',[]));
		return {
			title:'Service',
			fn:function(panel,base){
				panel.classList.add('angular-service');
				angular.element(base.template).find('.angular-service').appendTo(panel);
				angular.bootstrap(panel,['angular.service']);
			}
		};

		function initialization(module) {

			module.controller('angularServiceController',
				['$scope',function($scope) {
					$scope.items = [
						{name:'factory',content:'• name (string) • getFn (function)'},
						{name:'service',content:'• name (string) • constructor (function)'},
						{name:'constant',content:'• name (string) • value (constant value)'},
						{name:'value',content:'• name (string) • value (value)'},
						{name:'provider',content:'.provider("myService", {$get: function() {return {"username": "auser"}}});'}
					];
				}]);
		}

	});

	$e(function directive(){

		initialization(angular.module('angular.directive',[]));
		return {
			title:'Directive',
			fn:function(panel,base){
				panel.classList.add('angular-directive');
				angular.element(base.template).find('.angular-directive').appendTo(panel);
				angular.bootstrap(panel,['angular.directive']);
			}
		};

		function initialization(module) {

			module.directive('angularBaseEmailEditor',
				['$compile',function($compile) {

					return {
						restrict: 'A',
						scope: false,
						link:linker
					};

					function linker (scope, elem, attrs) {
						var temp =['<div id="emailEditor">',
										'<input ng-model="to" type="email" placeholder="Recipient" />',
										'<textarea ng-model="emailBody"></textarea>',
									'</div>',
									'<div id="emailPreview">',
										'<pre>__ previewText __</pre>',
									'</div>',
									'<div ng-bind="myUrl"></div>'].join('');
						var linkFn = $compile(temp);
						var content = linkFn(scope);
						elem.append(content);
					}
				}]);

			module.directive('sidebox', function() {
				return {
					restrict: 'EA',
					scope: {
						title: '@'
					},
					transclude: true,
					template: ['<div class="sidebox">',
									'<div class="content">',
										'<h2 class="header">{{ title }}</h2>',
										'<span class="content" ng-transclude></span>',
									'</div>',
								'</div>'].join('')
				};
			});

			module.directive('link', function() {
				return {
					restrict: 'EA',
					transclude: true,
					controller:
						function($scope, $element, $transclude) {
							$transclude(function(clone) {
								var a = angular.element('<a>');
								a.attr('href', clone.text());
								a.text(clone.text());
								$element.append(a);
							});
						}
				};
			});
		}
	});

	$e(function controller($,$q,template){

		initialization(angular.module('angular.controller',[]));
		return {
			title:'Controller',
			fn:function(panel,base){
				panel.classList.add('angular-controller');
				angular.element(base.template).find('.angular-controller').appendTo(panel);
				angular.bootstrap(panel,['angular.controller']);
			}
		};

		function initialization(module){

			module.controller('angularControllerController',
				['$scope',function($scope) {

					$scope.entity = {text: new Date().toLocaleString()};

				}]);

			module.controller('MainController', function() {
				this.name = "Ari";
			});
		}
	});

	$e(function configuration($,$q,template){
		initialization(angular.module('angular.configuration',[]));
		return {
			title:'Configuration',
			fn:function(panel,base){
				panel.classList.add('angular-configuration');
				angular.element(base.template).find('.angular-configuration').appendTo(panel);
				angular.bootstrap(panel,['angular.configuration']);
			}
		};

		function initialization(module) {

			module.service('AuthService',function(){
				return {userLoggedIn: function(){}};
			});

			module.controller('angularConfigurationController',
				['$scope','$location',function($scope,$location) {

					$scope.$locationItems =  [
						{name:'path',value:$location.path()},
						{name:'replace',value:$location.replace()},
						{name:'absUrl',value:$location.absUrl()},
						{name:'hash',value:$location.hash()},
						{name:'host',value:$location.host()},
						{name:'port',value:$location.port()},
						{name:'protocol',value:$location.protocol()},
						{name:'search',value:$location.search()},
						{name:'url',value:$location.url()}
					];

					$scope.$injectItems =  [
						{name:'annotate',value:'injector.annotate(function($q, greeter) {});'},
						{name:'get',value:'get(serviceName)'},
						{name:'has',value:'has(serviceName)'},
						{name:'instantiate',value:'instantiate(Type,locals)'},
						{name:'invoke',value:'invoke(fn,self,locals)'}
					];

				}]);

			module.config(function($provide, $compileProvider) {
				$provide.factory('myFactory', function() {
					var service = {};
					return service;
				});
				$compileProvider.directive('myDirective',
					function() {
						return {
							template: '<button>Click me</button>'
						};
					});
			});

			module.run(function($rootScope, AuthService) {
				$rootScope.$on('$routeChangeStart',
					function(evt, next, current) {
						// If the user is NOT logged in
						if (!AuthService.userLoggedIn()) {
							if (next.templateUrl === "login.html") {
								// Already heading to the login route so no need to redirect
							} else {
								$location.path('/login');
							}
						}
					});
			});

			//module.config(['$routeProvider', function($routeProvider) {
			//	$routeProvider
			//		.when('/', {
			//			templateUrl: 'views/home.html',
			//			controller: 'HomeController'
			//		})
			//		.when('/login', {
			//			templateUrl: 'views/login.html',
			//			controller: 'LoginController'
			//		})
			//		.when('/dashboard', {
			//			templateUrl: 'views/dashboard.html',
			//			controller: 'DashboardController',
			//			resolve: {
			//				user: function(SessionService) {
			//					return SessionService.getCurrentUser();
			//				}
			//			}
			//		})
			//		.otherwise({
			//			redirectTo: '/'
			//		});
			//}]);


		}
	});

})(window.$ehr,window.angular);