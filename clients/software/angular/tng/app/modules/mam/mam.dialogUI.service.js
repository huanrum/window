(function (angular) {
	'use strict';

	function initSomeFunc(helper,method) {
		return {
			'disable': function (entity, type) {
				return type !== 'create';
			},
			'hideRow': function (entity, row,option) {
				if (method === 'create' || option.type === 'cancel') {
					return false;
				}
				return angular.isUndefined(helper.value(entity, row.field));
			},
			'footer': function (entity) {
				var isView = method !== 'create' || (method === 'create' && entity.history);
				return helper.value(entity.history,'length') && angular.element([
						'<br><div ng-if="entity.history"><fieldset><legend>{{\'comment\'|language}}</legend>',
						'	<div>',
						'	<div ng-repeat="pin in entity.history">',
						'		{{pin.updateTime|sinoDate}} - {{pin.updateBy}} {{pin.description}} : <i>{{pin.remark || \'(no comment)\'}}</i>',//description
						'	</div>',
						((method !== 'view' && isView) ? '<br><textarea rows="6" data-ng-model="entity.comment" class="form-control"></textarea>' : ''),
						'</div></fieldset></div>'
					].join(''));
			}
		};
	}

	function getAlternativeRequesterList(lookupService,manageHttpToken,method,entity){
		var alternativeRequesterList = {};
		angular.forEach(lookupService('alternativeRequester'),function(item,k){
			if(method ==='create'){
				if(k !== manageHttpToken.user().id){
					alternativeRequesterList[k] = item;
				}
			}else{
				if(k !== entity.requesterId){
					alternativeRequesterList[k] = item;
				}
			}
		});
		if(entity.merchant.id && entity.alternativeRequesterId && !alternativeRequesterList[entity.alternativeRequesterId]){
			alternativeRequesterList[entity.alternativeRequesterId] = {id:entity.alternativeRequesterId,name:entity.alternativeRequesterName,account:entity.alternativeRequesterAccount};
		}
		return alternativeRequesterList;
	}

	function businessNatureFilter(_,helper,lookupService,filterValue){
		var children =  _.filter(_.map(lookupService('businessNature')),function(i){return (i.parentId+'') === (filterValue+'');});
		if(children.length){
			return  children;
		}else{
			return helper.value(lookupService('businessNature'),filterValue+'.other')? '':null;
		}
	}

	function initBusinessNature(helper,lookupService){
		return {
			get:function(entity){
				entity.merchant.businessNatureId = helper.truthValue(entity.merchant.businessNature3,entity.merchant.businessNature2,entity.merchant.businessNature1,entity.merchant.businessNatureId);
				if(!entity.merchant.businessNatureId || entity.merchant.businessNatureId === 'undefined'){
					delete entity.merchant.businessNatureId;
				}else if(!lookupService('businessNature')[entity.merchant.businessNatureId]){
					entity.merchant.businessNatureOther = entity.merchant.businessNatureId;
					entity.merchant.businessNatureId = 0;
					if(lookupService('businessNature')[entity.merchant.businessNature3]){
						entity.merchant.businessNatureId = entity.merchant.businessNature3;
					}else if(lookupService('businessNature')[entity.merchant.businessNature2]){
						entity.merchant.businessNatureId = entity.merchant.businessNature2;
					}else{
						entity.merchant.businessNatureId = entity.merchant.businessNature1;
					}
				}
				delete entity.merchant.businessNature3;
				delete entity.merchant.businessNature2;
				delete entity.merchant.businessNature1;
				return entity;
			},
			set:function(entity){
				var value = entity.merchant.businessNatureId,values = [];
				if(entity.merchant.businessNatureOther){
					values.unshift(entity.merchant.businessNatureOther);
				}
				while(value){
					values.unshift(value + '');
					value = helper.value(lookupService('businessNature'),value+'.parentId');
				}
				entity.merchant.businessNature3 = values[2];
				entity.merchant.businessNature2 = values[1];
				entity.merchant.businessNature1 = values[0];
			}
		};
	}

	function businessNatureChange(_,$timeout,helper,lookupService){
		return function(entity,rows){
			var self = this;
			$timeout(function(){
				angular.forEach(_.filter(rows && rows.$empty$2.left,function(i){return i.related === self.field;}),function(row){
					row.mime.data = businessNatureFilter(_,helper,lookupService,helper.value(entity,row.related));
					if(row.mime.data){
						helper.value(entity,row.field,(helper.value(row.mime.data,'0.id')||'')+'');
					}else{
						helper.value(entity,row.field,null);
					}
					businessNatureChange(_,$timeout,helper,lookupService).call(row,entity,rows);
				});
			},200);
		};
	}

	function getGroup2(_,$timeout,helper,lookupService,entity){
		return [
			{
				'title': 'mamTitle',
				'field': 'merchant.ownerTitle',
				'width':0.333,
				'editor': _.map(lookupService('mamTitle'))
			},
			{
				'title':'mamType',
				'field':'merchant.merchantType',
				'width':0.333,
				'editor': _.map(lookupService('merchantAgent'))
			},
			0.333,
			{
				'title': 'beneficiaryOwner',
				'field': 'merchant.ownerName',
				'width':0.333,
				'required': true,
				'editor': 'text',
				'length':100,
				'validate':'length(100)'
			},
			0.666,
			{
				'title': 'companyName',
				'field': 'merchant.companyName',
				'required': true,
				'width':0.333,
				'editor': 'text',
				'length':200,
				'validate':'length(200)'
			},
			{
				'title': 'businessRegistration',
				'field': 'merchant.businessRegistrationNumber',
				'required': true,
				'width':0.333,
				'editor': 'text',
				'length':30,
				'validate':'length(30)'
			},
			0.333,
			{
				'title': 'businessNature',
				'field': 'merchant.businessNature1',
				'required': true,
				'width':0.333,
				'default': false,
				'editor': businessNatureFilter(_,helper,lookupService,0) || 'text',
				'length':50,
				'validate':'length(50)',
				'change':businessNatureChange(_,$timeout,helper,lookupService)
			},
			{
				'title': '$empty$businessNature2',
				'field': 'merchant.businessNature2',
				'related': 'merchant.businessNature1',
				'width':0.155,
				'ratio': 0.00001,
				'editor': 'sino-edit-select',
				'required': true,
				'noTooltip':true,
				'mime':{
					'data':businessNatureFilter(_,helper,lookupService,helper.value(entity,'merchant.businessNature1'))
				},
				'length':50,
				'validate':'length(50)',
				'hide': function (entity, row) {
					return helper.truthValue(!helper.value(entity, row.related) , row.mime.data === null,row.mime.data === undefined) ;
				},
				'change':businessNatureChange(_,$timeout,helper,lookupService)
			},
			{
				'title': '$empty$businessNature3',
				'field': 'merchant.businessNature3',
				'related': 'merchant.businessNature2',
				'width':0.179,
				'ratio': 0.00001,
				'editor': 'sino-edit-select',
				'required': true,
				'noTooltip':true,
				'mime':{
					'data':businessNatureFilter(_,helper,lookupService,helper.value(entity,'merchant.businessNature2'))
				},
				'length':50,
				'validate':'length(50)',
				'hide': function (entity, row) {
					return helper.truthValue(!helper.value(entity, row.related) , row.mime.data === null,row.mime.data === undefined) ;
				}
			},
			0.333,
			{
				'title': 'displayNameEN',
				'field': 'merchant.displayNameEN',
				'required': true,
				'width':0.333,
				'editor': 'text',
				'length':200,
				'validate':'length(200,en)'
			},
			{
				'title': 'displayNameTC',
				'field': 'merchant.displayNameTC',
				'required': true,
				'width':0.333,
				'editor': 'text',
				'length':200,
				'validate':'length(200,zhTw)'
			},
			{
				'title': 'displayNameSC',
				'field': 'merchant.displayNameCN',
				'required': true,
				'width':0.333,
				'editor': 'text',
				'length':200,
				'validate':'length(200,zhCn)'
			},
			{
				'title': 'tradingNameEN',
				'field': 'merchant.tradingNameEN',
				'width':0.333,
				'editor': 'text',
				'length':200,
				'validate':'length(200,en)'
			},
			{
				'title': 'tradingNameTC',
				'field': 'merchant.tradingNameTC',
				'width':0.333,
				'editor': 'text',
				'length':200,
				'validate':'length(200,zhTw)'
			},
			{
				'title': 'tradingNameSC',
				'field': 'merchant.tradingNameCN',
				'width':0.333,
				'editor': 'text',
				'length':200,
				'validate':'length(200,zhCn)'
			}
		];
	}

	function getPrimaryContact(_,$timeout,helper,lookupService){
		return [
			{
				'title': 'mamTitle',
				'field': 'merchant.contactPersonTitle',
				'required': true,
				'width':0.333,
				'editor': _.map(lookupService('mamTitle'))
			},
			{
				'title': 'fullName',
				'field': 'merchant.contactPersonName',
				'required': true,
				'width':0.333,
				'editor': 'text',
				'length':100,
				'validate':'length(100)'
			},
			0.333,
			{
				'title': 'contactPhoneNumber',
				'field': 'merchant.contactNumber',
				'required': true,
				'width':0.333,
				'editor': 'text',
				'length':20,
				'validate':'phone(20)'
			},
			{
				'title': 'emailAddress',
				'field': 'merchant.contactEmail',
				'required': true,
				'width':0.333,
				'editor': 'text',
				'length':100,
				'validate':'email(100)'
			}
		];
	}

	function getSettlementInformation(_,$timeout,helper,lookupService){
		return [
			{
				'title':'settlementMethod',
				'field':'merchant.settlementMethod',
				'required': true,
				'width':0.333,
				'editor':_.map(lookupService('settlementMethod'))
			},
			0.666,
			{
				'title':'bankName',
				'field':'merchant.bankCode',
				'required': true,
				'width':0.333,
				'type':'lookup:\'bankCode,name\''
			},
			{
				'title':'bankCode',
				'field':'merchant.bankCode',
				'required': true,
				'width':0.333,
				'type':'lookup:\'bankCode,code\'',
				'editor':'sino-search-select',
				'mime':_.map(lookupService('bankCode'))
			},
			{
				'title':'branchAccountNumber',
				'field':'merchant.accountNo',
				'width':0.333,
				'editor':'text',
				'length':50,
				'validate':'length(50)'
			},
			{
				'title':'bankAccountName',
				'field':'merchant.bankAccountName',
				'required': true,
				'width':0.333,
				'editor':'text',
				'length':20,
				'validate':'length(20)'
			},
			{
				'title':'transactionChargeRate',
				'field':'merchant.transactionRate',
				'required': true,
				'width':0.333,
				'editor':'text',
				'validate':'float(2,2)'
			},
			{
				'title':'settlementPeriod',
				'field':'merchant.settlementPeriod',
				'required': true,
				'width':0.333,
				'editor':'text',
				'validate':'number(2)'
			}
		];
	}

	angular.module('cms.main').factory('mamDialogUiService', ['_','helper','$timeout','lookupService','$filter','manageHttpToken',function (_,helper,$timeout,lookupService,$filter,manageHttpToken) {
		function collectEntity(entity){
			var item = initBusinessNature(helper,lookupService).get(JSON.parse(JSON.stringify(entity)));
			if(!item.comment){
				delete item.comment;
			}
			return item;
		}
		uiService.initHistory = function(pin){
			return '['+$filter('sinoDate')(pin.updateTime)+'] ['+pin.description+'] '+ pin.updateBy +':'+ pin.remark;
		};
		return uiService;

		function uiService($scope,dataService,method) {
			return angular.extend(initSomeFunc(helper,method),{
				'method':method,
				'class':'mam-dialog',
				'width':1260,
				'rows':getRows,
				'defaultRatio':1,
				'collectEntity':collectEntity
			});

			function getRows(entity){
				var alternativeRequesterList = getAlternativeRequesterList(lookupService,manageHttpToken,method,entity);
				initBusinessNature(helper,lookupService).set(entity);

				return {
					'$empty$1': {
						'left': [
							{
								'title': 'mamId',
								'field': 'mamId',
								'class':'border-none',
								'width':0.333,
								'hide':method ==='create'
							},
							{
								'title':'merchantAgent',
								'field':'merchant.clientType',
								'required': true,
								'width':0.333,
								'editor': _.map(lookupService('mamType'))
							},
							0.333,
							{
								'title': 'mId',
								'field': 'merchant.mid',
								'class':'border-none',
								'width':0.333,
								'hide':method ==='create'
							},
							0.666,
							{
								'title': 'alternativeRequester',
								'field': 'alternativeRequesterId',
								'required': true,
								'default': false,
								'width':0.333,
								'editor': _.map(alternativeRequesterList),
								'change':function(entity){
									var alternativeRequester = alternativeRequesterList[entity.alternativeRequesterId];
									if(alternativeRequester){
										entity.alternativeRequesterName = alternativeRequester.name;
										entity.alternativeRequesterAccount = alternativeRequester.account ;
									}
								}
							}
						]
					},
					'$empty$2':{
						'left': getGroup2(_,$timeout,helper,lookupService,entity)
					},
					'primaryContact':{
						'left': getPrimaryContact(_,$timeout,helper,lookupService)
					},
					'settlementInformation':{
						'left': getSettlementInformation(_,$timeout,helper,lookupService)
					},
					'$empty$xy': {
						'left': [
							{
								'title':'particular',
								'field':'merchant.particular',
								'editor':3,
								'ratio':3/16,
								'length':100,
								'validate':'length(100)'
							}
						]
					},
					'$empty$remark': {
						'left': [
							{
								'title':'remark',
								'field':'merchant.remark',
								'editor':3,
								'ratio':3/16,
								'length':100,
								'validate':'length(100)'
							}
						]
					}
				};
			}

		}
	}]);

})(window.angular);