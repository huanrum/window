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
	function findActiveChild(_,list){
		var activeList = [];
		if(list && list.length){
			var activeChild = _.find(list,function(i){return i.active;});
			if(activeChild){
				activeChild.active = true;
				activeList.push(activeChild);
				activeList.push.apply(activeList,findActiveChild(_,activeChild.subMenus));
			}
		}
		return activeList;
	}

	function getNextName($global,$state,$scope,next,params){
		var nextName = next.name;
		if(nextName === 'main'){
			if(!$global.currentName || $global.currentName === 'main'){
				next = $scope.menuList[0];
				while(next.subMenus && next.subMenus[0]){
					next = next.subMenus[0];
				}
				nextName = next.name;
			}else{
				nextName = $global.currentName;
			}
		}
		$state.go(nextName,params);
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

	function getUserOption(_,$global){
		return {
			'width':420,
			'class':'dialog-user-option',
			'header':angular.element('<i class="fa fa-5x fa-user-circle-o"></i>'),
			'rows': [
				{
					'title': 'userName',
					'field': 'userName'
				},
				{
					'title': 'contact',
					'field': 'phone'
				},
				{
					'title': 'email',
					'field': 'loginId'
				},
				{
					'title': 'language',
					'field': 'language',
					'editor': _.map($global.languageList,function(v,k){
						return {title:k,value:v};
					})
				},
				{
					'title': 'role',
					'field': 'roles',
					'class':'role-min',
					'type':'$html$array(<div class="form-control" sino-tooltip="true">{i}</div>)'
				}
			]
		};
	}
	function getChangePassword(){
		return {
			'width':420,
			'rows': [
				{
					'title': 'oldPassword',
					'field': 'originalPassword',
					'editor': 'password'
				},
				{
					'title':'newPassword',
					'field':'newPassword',
					'editor': 'password',
					'required':true,
					'related':'originalPassword',
					'validate':'password()'
				},{
					'title':'rePassword',
					'field':'reNewPassword',
					'editor': 'password',
					'related':'newPassword',
					'validate':'rePassword()'
				}
			]
		};
	}

	function updateMinMenu($global,$scope){
		return function(value){
			if(angular.isUndefined(value)){
				$scope.minMenu = $global.isDebug && !$scope.minMenu;
			}else{
				$scope.minMenu = $global.isDebug && !!value;
			}
		};
	}

	angular.module('cms.common').controller('mainController',['$scope','$state','_','$global','$injector','lookupService',function($scope,$state,_,$global,$injector,lookupService){

		var manageHttpToken = $injector.get('manageHttpToken'),helper = $injector.get('helper');
		$global.user = manageHttpToken.user();

		$scope.version = $global.version;
		$scope.baseUrl = $injector.get('baseService').url('');
		$scope.user = $global.user;

		$scope.updateMinMenu = updateMinMenu($global,$scope);
		$scope.logout = manageHttpToken.logout;
		$scope.helper = function(){
			window.console.log('开发中...');
		};

		$scope.showMyProfile = function($title){
			$injector.get('baseDialog').edit($injector.get('$filter')('language')($title),getUserOption(_,$global),$scope.user,'confirm',['@confirm']).then(function(entity){
				if($global.language !== entity.language){
					manageHttpToken.language({
						id:entity.id,
						name:entity.userName,
						mobile:entity.phone,
						email:entity.loginId,
						language:entity.language
					}).then(function(){
						$global.refreshLanguage(entity.language);
						manageHttpToken.user(entity);
					});

				}
			});
		};
		$scope.changePassword = function($title){
			$injector.get('baseDialog').edit($injector.get('$filter')('language')($title),getChangePassword(),{},'confirm',['@confirm']).then(function(entity){
				manageHttpToken.changePassword(entity).then(function(){
					$injector.get('baseDialog').message(1,'@succeed','{{entity.content |language}} ',{content:'errorChangePassword'},'confirm').end(function(){
						manageHttpToken.logout();
					});

				});
			});
		};

		$scope.clickMenu = function (menu, sub, subsub) {
			var activeList = updateMenuActive($scope,menu, sub,subsub);
			var subList = helper.value(activeList[activeList.length - 1] ,'subMenus');

			activeList = activeList.concat(findActiveChild(_,!subsub&&subList));
			if(!activeList[activeList.length - 1].subMenus || !activeList[activeList.length - 1].subMenus.length){
				$scope.activeList = activeList;
				$state.go('main.' + $scope.activeList.map(function (i) {return i.url;}).join('.'));
			}
		};

		if(!$scope.user || manageHttpToken.over()){
			$global.currentName = $state.current.name;
			$global.params = $state.params;
			$state.go('login');

		}else{
			lookupService('module','/application');
			lookupService('inOutSide',[{id:'i',name:'internal'},{id:'e',name:'external'}]);

			manageHttpToken.menus().then(function(data){
				$scope.menuList = data;
				if(data && data.length){
					getActiveList($scope,$scope.menuList,getNextName($global,$state,$scope,$state.current,$global.params),[]);
				}
			});
		}
	}]);

})(window.angular);