(function(angular){
	'use strict';

	var menuData = [
		{
			"url":"historical",
			"class":"fa fa-folder-open-o",
			"controller":"historicalController",
			"permission":"m_Historical_Records"
		},
		{
			"url":"guideline",
			"class":"fa-desktop",
			"controller":"guidelineController",
			"templateUrl":'templates/content-guideline.html',
			"permission":"m_FNA_Guideline"
		},
		{
			"url":"version",
			"class":"fa-random",
			"controller":"versionController",
			"permission":"m_Version_Control"
		},
		{
			"url":"user",
			"class":"fa-users",
			"controller":"userController",
			"permission":"m_Access_Control"
		},
		{
			"url":"reporting",
			"class":"fa-building-o",
			"permission":"m_Reporting",
			"subMenus":[
				{
					"url":"login",
					"controller":"reportingLoginController"
				},
				{
					"url":"usage",
					"subMenus":[
						{
							"url":"file",
							"title":'usageFileReport',
							"controller":"reportingUsageFileSummaryController"
						},
						{
							"url": "status",
							"title":'usageStatusReport',
							"controller": "reportingUsageStatueChangeController"
						}
					]
				}
			]
		}
	];

	angular.module('cms.common').value('menuData',menuData);

	angular.module('cms.common').config(['$stateProvider',function ($stateProvider) {
		$stateProvider.state('main',{
			url: '/',
			controller: 'mainController',
			templateUrl:'templates/main.html'
		});

		$stateProvider.state('login',{
			url: '/login',
			controller: 'loginController',
			templateUrl:'templates/login.html'
		});

		initStatus(menuData,'main');

		angular.element(function(){
			if(!window.location.href.match(/#\//)){
				angular.element('body').injector().get('$state').go('main');
			}else if(/#.*[A-Z].*/.test(window.location.href)){
				var urls = window.location.href.split('#');
				window.location.href = urls[0] + '#'+urls[1].toLocaleLowerCase();
			}
		});

		function initStatus(list,parentKey){
			angular.forEach(list,function(item){
				var state = {url: item.url+'/',title:item.title || item.url},key = (parentKey?(parentKey +'.'):'')+item.url;
				if(item.controller){
					state.views = {
						'mainContainer@main':{
							templateUrl: item.templateUrl || 'templates/content-default.html',
							controller: item.controller
						}
					};
				}
				$stateProvider.state(key,state);
				item.name = key;
				initStatus(item.subMenus,key);
			});
		}
	}]);

})(window.angular);