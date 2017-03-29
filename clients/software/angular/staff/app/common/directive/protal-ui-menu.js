/**
 * Created by Administrator on 2016/4/21.
 */
(function(angular){
	'use strict';

	angular.module('staff.common').directive('protalUiMenu', ['$http','$state','$injector','$global',function($http,$state,$injector,$global) {
		return {
			restrict: "AE",
			template: [
				'<ul><li ng-repeat="it in items"><a ng-bind="it.title" ng-click="it.click()" ng-style="it.getStyle()" ng-class="{selected:it.selected}"></a>',
				'   <ul ng-show="it.selected"><li ng-repeat="sub in it.submenu" ng-click="sub.click()"><a ng-bind="sub.title" ng-class="{selected:sub.selected}"></a></li></ul>',
				'</li></ul>'
			].join(''),
			link: function ($scope) {
				$http.get($global.urls.getMenus).then(function(req){
					$scope.items = req.data && req.data.data;

					angular.forEach($scope.items,function(item){
						item.title = item.title || item.name;
                        item.key = item.key || item.link;
						item.click = function(){
							angular.forEach($scope.items,function(i){i.selected = false;});
							item.selected = true;
						};
						item.getStyle = function(){
                            if(item.icon){
                                return {backgroundImage:'url(images/menu_icon/' + item.icon + ')'};
                            }
						};
                        if(item.key){
                            $global.menus[item.key] = item.title;
                        }
						while(/ /.test(item.icon)){
							item.icon = item.icon.replace(' ','%20');
						}

						angular.forEach(item.submenu,function(child){
							child.title = child.title || child.name;
							child.controller = _hump((child.controller || child.key || child.index)).replace('Controller','');
							child.key = child.key || child.link;
							child.click = function(){
								angular.forEach($scope.items,function(g){angular.forEach(g.submenu,function(i){i.selected = false;});});
								child.selected = true;
								$global.go(child.key,child);
							};

                            $global.menus[child.key] = child.title;
							$global.$stateProvider.state(child.key,{
								url: child.key.toLocaleLowerCase().split('.').pop(),
								views: {
									'homeContainer': {
										template: '<div protal-content-content></div>',
										controller: (child.controller[0].toLocaleLowerCase() +  child.controller.slice(1))+ 'Controller'
									}
								}
							});
						});
					});

					$global.go();
				});
			}
		};


		function _hump(str){
			if (!str) {
				return '&nbsp;';
			}
			var is_ = false,result = '';
			angular.forEach(str,function(char){
				if(/[_\-]/.test(char)){
					is_ = true;
				}else if(char.trim()){
					if(is_){
						result += char.toLocaleUpperCase();
					}else{
						result += char;
					}
					is_ = false;
				}
			});
			return result;
		}

	}]);


})(window.angular);