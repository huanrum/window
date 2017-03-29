(function (angular) {
	'use strict';

	var searchColumns = [
		{
			'title':'',
			'field':''
		},
		{
			'title':'status',
			'field':'status',
			'editor':'requestStatus'
		},
		{
			'title':'mamId',
			'field':'mamId'
		},
		{
			'title':'mId',
			'field':'mid'
		},
		{
			'title':'companyName',
			'field':'companyName'
		},
		{
			'title':'requesterBy',
			'field':'requesterName'
		},
		{
			'title':'updateBy',
			'field':'updatedBy'
		}
	];

	function getOperation($scope,userService,manageHttpToken,getActions){
		var injector = angular.element('body').injector(),_ = injector.get('_'),baseDialog = injector.get('baseDialog');
		return function(item){
			var status = item.requestStatus.toLocaleUpperCase();
			if($scope.permission.create && manageHttpToken.hasRole(['BD_Sales_Role'])&& /(SAVE|DRAFT|REJECT)/.test(status)){
				userService.getItem(item,true).then(function(entityActions){
					$scope.create(entityActions[0],'create',getActions((entityActions[0].requesterId === manageHttpToken.user().id)&&'@!$cancel(approveReject)[background-red]'));
				});
			}else {
				userService.getItem(item,true,true).then(function(entityActions){
					var classes = ['background-red','background-green'];
					if(entityActions[1]&&entityActions[1].length){
						$scope.edit(entityActions[0],'view', _.map(entityActions[1],function(action,index){return '@!'+action+'(approveReject)['+(classes[index]||'')+']';})).then(function(req){
							baseDialog.message(1, '', req.data.status && req.data.status.message, {}, 'close[width-6]', 3000);
						});
					}else{
						$scope.view(entityActions[0],/(CANCELLED)/.test(status)?'cancel':'view',[]);
					}
				});
			}
		};
	}

	angular.module('cms.main').controller('mamController', ['$scope','baseController','baseDialog','mamDialogUiService','mamService','manageHttpToken','$stateParams',
		function ($scope,baseController,baseDialog,dialogUi,userService,manageHttpToken,$stateParams) {

		$scope.columns = [
			{
				'title':'status',
				'field':'requestStatus',
				'actions':[
					{
						'title': 'flow',
						'class': 'fa fa-retweet',
						'fn': function (item) {
							userService.getItem(item, true).then(function (entityActions) {
								angular.forEach(entityActions[0].history,function(hi){
									hi.info = dialogUi.initHistory(hi);
								});
								userService.getFlows(entityActions[0].history).then(function (data) {
									baseDialog.message(null, 'flow', '<div sino-mam-flow="entity"></div>', data, '');
								});
							});
						}
					}
				]
			},
			{
				'title':'mId',
				'field':'mid'
			},
			{
				'title':'mamId',
				'field':'mamId'
			},
			{
				'title':'companyName',
				'field':'companyName',
				'tooltip':'M300px'
			},
			{
				'title':'requesterBy',
				'field':'requesterName'
			},
			{
				'title':'updateBy',
				'field':'updatedBy'
			},
			{
				'title':'updateDateTime',
				'field':'updatedTime',
				'type':'sinoDate(+-)'
			},
			{
				'title':'remark',
				'field':'remark',
				'notSort':true,
				'tooltip':'350px'
			}
		];

		$scope.searchColumns = searchColumns;

		$scope.actions = [
			{
				'title':'operation',
				'class':'fa fa-file-text-o',
				'operate':true,
				'fn':getOperation($scope,userService,manageHttpToken,getActions)
			},
			{
				'title':'copy',
				'class':'fa fa-copy',
				'filter':function(){
					return $scope.permission.create &&  manageHttpToken.hasRole(['BD_Sales_Role']);
				},
				'fn':function(item){
					if(!this.filter(item)){
						return;
					}
					userService.getItem(item,null,null,true).then(function(entityActions){
						var entity = entityActions[0];
						delete entity.merchant.id;
						delete entity.merchant.mid;
						$scope.create({
							alternativeRequesterId:entity.alternativeRequesterId,
							alternativeRequesterName:entity.alternativeRequesterName,
							alternativeRequesterAccount:entity.alternativeRequesterAccount,
							merchant:entity.merchant
						},'create',getActions());
					});
				}
			}
		];


		$scope.toolbars = [
			{
				'info':'add',
				'title':'addAMerchant',
				'class':'tool-bars-btn btn-primary font-weight',
				'filter':function(){
					return $scope.permission.create && manageHttpToken.hasRole(['BD_Sales_Role']);
				},
				'fn':function(){
					$scope.create({merchant:{settlementPeriod:2}},'create',getActions());
				}
			}
		];
		baseController($scope,dialogUi,userService,{refreshAfter:refreshAfter});

		function getActions(firstAction){
			return [firstAction || '--','cancel','!@$saveDraft[background-blue]','@$submitApproval[background-green]'];
		}
		function refreshAfter(list){
			var items = window._.filter(list,function(i){return (''+i.mamRequestId) === $stateParams.id;});
			if(items && items[0]){
				$scope.actions[0].fn.call($scope.actions[0],items[0]);
			}
		}
	}]);

})(window.angular);