/**
 * Created by Administrator on 2016/4/21.
 */
(function(angular){
	'use strict';

	angular.module('staff.common',['ui.router']);
	angular.module('staff.main',['ui.router','staff.common']);

	angular.module('staff.common').config(['$stateProvider','$global',function ($stateProvider,$global) {
        $global.menus = {home:'Home'};
		$global.$stateProvider = $stateProvider.state('home',{
			url: '/',
			controller:'homeController',
			template:[
				'<div protal-header-container></div>',
				'<div protal-content-container ui-view="homeContainer"></div>',
				'<div protal-footer-container></div>'
			].join('')
		});
	}]);

	angular.module('staff.common').constant('$global',{
        isDebug:true,
        urls: {
            login: '../../../../staff/postlogin',
            getMenus: '../../../../staff/getmenus',
            jcontent:'../../../../staff/getjsoncontent?name='
        },parameters:function(parms) {
            if (parms) {
                this.parameters.data = parms;
            }
            return this.parameters.data;
        },go:function(item) {
            var $state = angular.element('body').injector().get('$state');
            if (!item) {
                $state.go('home');
            } else if (angular.isString(item)) {
                $state.go(item);
            } else {
                item.click();
            }
            this.parameters(arguments);
        },urlPaths:function(){
            var menuStr = '',menus = [],self = this;
            var $state = angular.element('body').injector().get('$state');
            angular.forEach($state.current.name.split('.'),function(path){
                if(path){
                    if(menuStr){
                        menuStr += '.';
                    }
                    menuStr += path;
                    menus.push({title:self.menus[menuStr],key:menuStr,click:function(){$state.go(this.key);}});
                }
            });
            return menus;
        }});

})(window.angular);