(function (angular) {
	'use strict';

	angular.module('cms.main').controller('reportingLoginController', ['$scope','baseController','reportingLoginService', function ($scope,baseController,dataService) {
		$scope.title = 'loginReport';

		$scope.columns = [
			{
				title:'startDataTime',
				field:'startDateTime',
				type:'sinoDate(dd MMM,yyyy HH:mm:ss)',
				isAscending:true
			},
			{
				title:'endDataTime',
				field:'endDateTime',
				type:'sinoDate(dd MMM,yyyy HH:mm:ss)'
			},
			{
				title:'agentID',
				field:'agentId'
			},
			{
				title:'userName',
				field:'loginId'
			},
			{
				title:'remoteAddress',
				field:'remoteAddress'
			},
			{
				title:'device',
				field:'device'
			},
			{
				title:'iosVersion',
				field:'iosVersion'
			},
			{
				title:'efnaVersion',
				field:'efnaVersion'
			},
			{
				title:'loginStatus',
				field:'loginStatus'
			}
		];

		$scope.rows = [
			{
				title:'totalLoginSession',
				field:'loginSessionNo'
			},
			{
				title:'totalLoginUser',
				field:'loginUserNo'
			}
		];

		baseController($scope,{},dataService);

		$scope.filter.sortBy = 'startDateTime';
		$scope.filter.isAscending = false ;
	}]);

})(window.angular);