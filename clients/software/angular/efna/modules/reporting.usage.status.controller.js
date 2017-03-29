(function (angular) {
	'use strict';

	angular.module('cms.main').controller('reportingUsageStatueChangeController', ['$scope','baseController','reportingUsageStatueChangeService', function ($scope,baseController,dataService) {
		$scope.title = 'usageStatusReport';
		$scope.notSort = true;
		$scope.columns = [
			{
				title:'id',
				field:'id'
			},
			{
				title:'eFNAReferenceNumber',
				field:'referenceNo'
			},
			{
				title:'agentID',
				field:'agentId'
			},
			{
				title:'lastUpdateDate',
				field:'lastUpdatedDate',
				type:'sinoDate(dd MMM,yyyy HH:mm:ss)'
			},
			{
				title:'efnaStatus',
				field:'status',
				type:'efnaStatus'
			},
			{
				title:'remoteAddress',
				field:'remoteAddress'
			},
			{
				title:'efnaVersion',
				field:'efnaVersion'
			}
		];

		$scope.searchColumns = [
			{
				title:'id',
				field:'id'
			},
			{
				title:'eFNAReferenceNumber',
				field:'referenceNo'
			},
			{
				title:'agentID',
				field:'agentId'
			}
		];

		$scope.search = function(e){
			if(e.keyCode === 13){
				$scope.refreshData();
			}
		};

		baseController($scope,{},dataService);
	}]);

})(window.angular);