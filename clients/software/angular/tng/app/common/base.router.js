(function(angular){
	'use strict';

	var menuData = [
		{
			"url":"mam",
			"suburl":":id",
			"class":"fa-building",
			"controller":"mamController",
			"index":"MAM",
			"permissionSum":15
		},
		{
			"url":"maintanence",
			"class":"fa-cogs",
			"subMenus":[
				{
					"url":"check",
					"controller":"checkController",
					"index":"SERVICE_CHECK",
					"permissionSum":15
				},
				{
					"url":"log",
					"controller":"logController",
					"index":"SERVICE_LOG",
					"permissionSum":15
				}
			]
		},
		{
			"url":"system",
			"class":"fa-lock",
			"subMenus":[
				{
					"url":"users",
					"controller":"usersController",
					"index":"USER_ACCOUNT",
					"permissionSum":15
				},
				{
					"url":"role",
					"controller":"roleController",
					"index":"USER_ROLE",
					"permissionSum":15
				},
				{
					"url":"function",
					"controller":"functionController",
					"index":"USER_FUNCTION",
					"permissionSum":15
				},
				{
					"url":"permission",
					"controller":"permissionController",
					"index":"USER_PERMISSION",
					"permissionSum":15
				}
			]
		},
		{
			"url":"batch",
			"class":"fa-dollar",
			"subMenus":[
				{
					"url":"maintain",
					"subMenus":[
						{
							"url":"draft",
							"controller":"draftController",
							"index":"BTU_MAINTAIN",
							"permissionSum":15
						},
						{
							"url":"pending",
							"controller":"pendingController",
							"index":"BTU_MAINTAIN",
							"permissionSum":15
						},
						{
							"url":"approve",
							"controller":"approveController",
							"index":"BTU_MAINTAIN_TEST",
							"permissionSum":15
						},
						{
							"url":"executed",
							"controller":"executedController",
							"index":"BTU_MAINTAIN",
							"permissionSum":15
						}
					]
				},
				{
					"url":"cashflow",
					"controller":"cashflowController",
					"index":"BTU_CASHFLOW",
					"permissionSum":15
				},
				{
					"url":"report",
					"subMenus":[
						{
							"url":"detailsReport",
							"controller":"detailsReportController",
							"index":"BTU_REPORT",
							"permissionSum":15
						},
						{
							"url":"summaryReport",
							"controller":"summaryReportController",
							"index":"BTU_REPORT",
							"permissionSum":15
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
			templateUrl:'assets/templates/main.html?'+window.compileDate
		});

		$stateProvider.state('login',{
			url: '/login',
			controller: 'loginController',
			templateUrl:'assets/templates/login.html?'+window.compileDate
		});

		$stateProvider.state('reset ',{
			url: '/reset/:loginId',
			controller: 'resetController',
			templateUrl:'assets/templates/login.html?'+window.compileDate
		});

		initStatus(menuData,'main');

		function initStatus(list,parentKey){
			angular.forEach(list,function(item){
				var state = {url: item.url+'/'+(item.suburl?item.suburl:''),title:item.title || item.url},key = (parentKey?(parentKey +'.'):'')+item.url;
				if(item.controller){
					state.views = {
						'mainContainer@main':{
							templateUrl: item.templateUrl || 'assets/templates/content-default.html?'+window.compileDate,
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