/**
 * Created by Administrator on 2016/6/15.
 */

(function(angular){

	'use strict';

	angular.module('staff.main').controller('pDayPassController',[
		'$scope','baseGridController','pDayPassService','protalDialogService',function($scope,baseGridController,pDayPassService,protalDialogService){

			baseGridController($scope,pDayPassService,{});

			$scope.updateRightMenus({title:'To',fn:function(item){

			}});

		}]);
})(window.angular);