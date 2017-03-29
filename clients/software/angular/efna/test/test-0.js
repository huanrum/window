(function (angular) {
	'use strict';

	angular.module('cms.main').factory('test-0', ['$timeout','$state','$localStorage',function ($timeout,$state,$localStorage) {

		return function getList() {
			return [
				function () {
					$localStorage.user = null;
					$state.go('login');
				},
				1000,
				function($,simulator){
					simulator($('.login-modal').scope().user,{
						username:  'seto',
						password:'z12345678'
					});
				},
				8000,
				'#login',
				4000,

				//************************************//
				'#menu-historical',
				1000,
				'#status',
				'#status',
				1000,
				function($){
					//$('#download-0').click();
				},
				3000,
				'#nextPage',
				1000,
				'#row-2',
				1000,
				'#row-10',
				1000,
				'#row-5',
				2000,
				'#nextPage',
				2000,
				'#nextPage',
				2000,
				'#firstPage',
				2000,
				function($,simulator){
					var scope = $('#filter-search').scope();
					simulator(scope.filter,{search: '111'},function(){
						scope.search({keyCode:13});
					});
				},
				3000,
				function($){
					var scope = $('#filter-search').scope();
					scope.filter.search = '';
					scope.search({keyCode:13});
				},
				4000,

				//************************************//
				'#menu-guideline',
				1000,
				'#edit',
				2000,
				function($){
					var scope = $('#editGuideline').scope();
					$('#entity-1--path+a').click();
				},
				'#confirm',
				4000,

				//************************************//
				'#menu-version',
				1000,
				'#add',
				1000,
				function($,simulator){
					simulator($('#newVersion').scope().entity,{
						versionNo:  Math.floor(Math.random() * 10000),
						downloadLink:'http://www.baidu.com',
						forceUpdate:false
					});
				},
				20000,
				'#confirm',
				2000,
				'#no',
				1000,
				'#row-0',
				2000,
				'#edit-0',
				1000,
				function($,simulator){
					simulator($('#editVersion').scope().entity,{
						versionNo:  Math.floor(Math.random() * 10000),
						forceUpdate:true
					});
				},
				4000,
				'#confirm',
				2000,
				'#row-0',
				2000,
				'#push-0',
				2000,
				'#delete-0',
				1000,
				'#no',
				4000,

				//************************************//
				'#menu-user',
				1000,
				'#add',
				1000,
				function($,simulator){
					simulator($('#newUser').scope().entity,{
						loginId:'T-'+Math.floor(Math.random() * 10000),
						nickname:Math.floor(Math.random() * 10000),
						password:'a12345678',
						rePassword:'a12345678',
						roleIds:'1,3,4,5,6,7'
					});
				},
				20000,
				'#confirm',
				1000,
				'#row-0',
				2000,
				'#edit-0',
				1000,
				function($,simulator){
					simulator($('#editUser').scope().entity,{roleIds: '1,3,4,5,8,11'});
				},
				6000,
				'#confirm',
				1000,
				'#row-0',
				2000,
				'#delete-0',
				1000,
				'#no',
				2000,
				function($,simulator){
					var scope = $('#filter-search').scope();
					simulator(scope.filter,{search: '111'},function(){
						scope.search({keyCode:13});
					});
				},
				3000,
				function($){
					var scope = $('#filter-search').scope();
					scope.filter.search = '';
					scope.search({keyCode:13});
				},
				4000,

				//************************************//
				'#menu-reporting',
				1000,
				'#menu-efna',
				1000,
				function($,simulator){
					simulator($('#filter-start').scope().filter,{start: '2015/12/12',end: '2015/12/12'});
				},
				10000,
				'#download',
				1000,
				'#cancel',
				4000,

				'#menu-login',
				1000,
				function($,simulator){
					simulator($('#filter-start').scope().filter,{start: '2015/12/12',end: '2015/12/12'});
				},
				10000,
				'#download',
				1000,
				'#cancel',
				4000,

				'#menu-usage',
				1000,
				'#file',
				1000,
				function($,simulator){
					simulator($('#filter-start').scope().filter,{start: '2015/12/12',end: '2015/12/12'});
				},
				10000,
				'#download',
				1000,
				'#cancel',
				4000,

				'#menu-status',
				1000,
				function($,simulator){
					simulator($('#filter-start').scope().filter,{start: '2015/12/12',end: '2015/12/12'});
				},
				10000,
				'#download',
				1000,
				'#cancel',
				4000
			];
		};
	}]);

})(window.angular);