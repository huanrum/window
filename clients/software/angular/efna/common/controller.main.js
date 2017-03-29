(function(angular){
	'use strict';

	function update(self,brothers){
		if (self) {
			angular.forEach(brothers, function (m) {
				m.active = false;
			});
			self.active = true;
		}
	}
	function updateMenuActive($scope,menu, sub, subsub) {
		var activeMenu = subsub || sub || menu;
		if(!activeMenu.active ){
			update(subsub,sub && sub.subMenus);
			update(sub,menu.subMenus);
			update(menu,$scope.menuList);
		}
		return [menu, sub, subsub].filter(function (i) {
			return !!i;
		});
	}
	function findActiveChild(list){
		var activeList = [];
		if(list && list.length){
			var activeChild = _.find(list,function(i){return i.active;}) || list[0];
			activeChild.active = true;
			activeList.push(activeChild);
			activeList.push.apply(activeList,findActiveChild(activeChild.subMenus));
		}
		return activeList;
	}

	function getNextName($global,$state,$scope,next){
		var nextName = next.name;
		if(nextName === 'main'){
			if(!$global.currentName || $global.currentName === 'main'){
				next = $scope.menuList[0];
				while(next.subMenus){
					next = next.subMenus[0];
				}
				nextName = next.name;
			}else{
				nextName = $global.currentName;
			}
		}
		$state.go(nextName);
		return nextName;
	}

	function getActiveList($scope,list,name,path){
		angular.forEach(list, function (menu1) {
			if (menu1.name === name) {
				$scope.activeList = updateMenuActive.apply(null,[$scope].concat(path).concat([menu1]));
			}
			getActiveList($scope,menu1.subMenus,name,[].concat(path).concat([menu1]));
		});
	}

	angular.module('cms.common').controller('mainController',['$scope','$state','_','$localStorage','$global','$injector',function($scope,$state,_,$localStorage,$global,$injector){

		var editUser = $injector.get('editUser');
		$scope.baseUrl = $injector.get('baseService').url('');
		$global.token = $localStorage.token;
		$global.user =  $scope.user = $localStorage.user&&JSON.parse($localStorage.user);

		$scope.logout = function(){
			editUser.logout();
		};
		$scope.setting = function($title){
			var title = $injector.get('$filter')('language')($title);
			$injector.get('baseDialog').edit(title,{rows:editUser.getRows()},angular.extend({},$scope.user),'edit').then(function(entity){
				editUser.update(title,entity).then($scope.logout);
			});
		};
		$scope.clickMenu = function (menu, sub, subsub) {
			var activeList = updateMenuActive($scope,menu, sub,subsub);
			var subList = activeList[activeList.length - 1] && activeList[activeList.length - 1].subMenus;

			var to = activeList.concat(findActiveChild(!subsub&&subList)).map(function (i) {
				return i.url;
			}).join('.');
			$scope.activeList = activeList;
			$state.go('main.' + to);
		};

		if(!$scope.user || Date.now() - $scope.user.date > $global.effectiveInterval){
			$global.currentName = $state.current.name;
			$state.go('login');
		}else{
			editUser.getMenus().then(function(data){
				$scope.menuList = data;
				if(data && data.length){
					getActiveList($scope,$scope.menuList,getNextName($global,$state,$scope,$state.current),[]);
				}
			});
		}

	}]);

})(window.angular);