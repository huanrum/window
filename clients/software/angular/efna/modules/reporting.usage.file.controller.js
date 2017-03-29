(function (angular) {
	'use strict';

	angular.module('cms.main').controller('reportingUsageFileSummaryController', ['$scope','baseController','reportingUsageFileSummaryService', function ($scope,baseController,dataService) {
		$scope.title = 'usageFileReport';
		$scope.columns = [
			{
				title:'id',
				field:'id',
				width:'50px'
			},
			{
				title:'eFNAReferenceNumber',
				field:'referenceNo',
				width:'450px'
			},
			{
				title:'agentID',
				field:'agentId'
			},
			{
				title:'createDate',
				field:'createdDate',
				type:'sinoDate(dd MMM,yyyy)'
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
				title:'policyowner',
				field:'policyOwner'
			},
			{
				title:'application',
				field:'policyNo'
			}
		];

		$scope.rows = [
			{
				title:'totalIncompleted',
				field:'incompletedNo'
			},
			{
				title:'totalCompleted',
				field:'completedNo'
			},
			{
				title:'totalSubmitted',
				field:'submittedNo'
			},
			{
				title:'totalHousekeepingCleared',
				field:'housekeepingClearedNo'
			},
			{
				title:'iosVersion',
				field:'iosVersionList',
				type:'array'
			},
			{
				title:'ipadVersion',
				field:'iPadVersionList',
				type:'array'
			},
			{
				title:'efnaVersion',
				field:'efnaVersionList',
				type:'array'
			},
			{
				title:'efnaStatus',
				field:'efnaStatusList',
				type:['[efnaStatus]','array']
			}
		];

		baseController($scope,{},dataService);

	}]);

})(window.angular);