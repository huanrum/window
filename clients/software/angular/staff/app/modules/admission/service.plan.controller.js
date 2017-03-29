/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular){

	'use strict';

	angular.module('staff.main').controller('pServicePlanController',[
		'$scope','baseGridController','pServicePlanService','protalDialogService',function($scope,baseGridController,pServicePlanService,protalDialogService){

            baseGridController($scope,pServicePlanService,{});

		}]);
})(window.angular);