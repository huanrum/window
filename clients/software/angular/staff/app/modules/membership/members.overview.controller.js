/**
 * Created by Administrator on 2016/6/15.
 */

(function(angular){

	'use strict';

	angular.module('staff.main').controller('pMembersOverviewController',[
		'$scope','baseGridController','pMembersOverviewService','protalDialogService',function($scope,baseGridController,pMembersOverviewService,protalDialogService){
			
			baseGridController($scope,pMembersOverviewService,{});

			$scope.updateRightMenus({title:'Open Url',fn:function(item){
				if(/^@open:/.test(item.fnUrl)){
					window.open(item.fnUrl.replace('@open:',''),null,'width:1200');
				}else{
					window.open('../../../'+item.fnUrl,null,'width:1200');
				}
			}});

		}]);
})(window.angular);