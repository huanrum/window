(function(angular){
	'use strict';

	angular.module('cms.main').controller('historicalController',['$scope','$http','$global','baseController','baseDialog','historicalService',
		function($scope,$http,$global,baseController,baseDialog,historicalService){

		$scope.title = 'historical';
		$scope.columns = [
			{
				title:'eFNAReferenceNumber',
				field:'fnaNo',
				width:'400px'
			},
			{
				title:'policyHolderName',
				field:'policyName',
				width:'200px',
				tooltip:'200px'
			},
			{
				title:'status',
				field:'status',
				width:'140px',
				type:'efnaStatus'
			},
			{
				title:'telephone',
				field:'telephone',
				width:'140px'
			},
			{
				title:'applicationReferenceNumber',
				field:'policyNo',
				width:'350px'
			},
			{
				title:'agentID',
				field:'agentId',
				width:'140px'
			},
			{
				title:'agentName',
				field:'agentName',
				width:'200px',
				tooltip:'200px'
			},
			{
				title:'date',
				field:'date',
				width:'100px',
				type:'sinoDate(dd MMM,yyyy)'
			}
		];
		$scope.actions = [
			{
				title:'viewPDF',
				class:'fa-eye',
				disable:function(item){
					return item.status !== '2';
				},
				fn:historicalService.viewpdf
			},
			{
				title:'download',
				class:'fa-download',
				disable:function(item){
					return item.status !== '2';
				},
				fn:historicalService.download
			}
		];

		$scope.search = function(e){
			if(e.keyCode === 13){
				$scope.refreshData();
			}
		};

		baseController($scope,{},historicalService);



	}]);

})(window.angular);