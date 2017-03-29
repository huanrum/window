(function(angular){
	'use strict';
	angular.module('sino.main').controller('mainController',['$scope','_','$localStorage','$injector',function($scope,_,$localStorage,$injector){

		$scope.menus = {
			home:['introduce','course','news'],
			shop:{

			},
			personage:{

			},
			helper:{

			}
		};

		$scope.activeTab = 'home';
		$scope.clickMenu = function(sub){
			$scope.activeTab = sub;
		};

	}]);

})(window.angular);
