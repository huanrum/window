(function (angular) {
	'use strict';

	angular.module('cms.main').factory('mamService', ['_','$q','$http','baseService','helper','$injector', function (_,$q,$http,baseService,helper,$injector) {

		var service = baseService('mam','/merchants',{
			'lookup':{
				'mamTitle':[{name:'Mr',id:1},{name:'Miss',id:2},{name:'Mrs',id:3}],
				'alternativeRequester':'[ana]/account/listBySalesRole',
				'merchantAgent':'/dropdownlists/merchantType',
				'mamType':'/dropdownlists/clientType',
				'settlementMethod':'/dropdownlists/settlementMethod',
				'requestStatus':'/dropdownlists/getRequestStatusConfig',
				'businessNature':{
					'url':'/dropdownlists/businessNature',
					'to':function(i){
						i.name = i[helper.upperFirstChar('natureName',helper.language())];
						i.other = 'Others' === i.natureNameEn;
					}
				},
				'bankCode:code':{
					'url':'/dropdownlists/bank',
					'to':function(i){
						i.title = i.code +' - '+ i.name;
					}
				}
			}
		});

		return angular.extend(service,{
			'saveDraft':saveSubmit(false),
			'submitApproval':saveSubmit(true),
			'getFlows':getFlows($http,$q,_,service),
			'getItem':getItem($http,$q,_,$injector.get('checkHttpResponse'),service),
			'approveReject':approveReject
		});

		function saveSubmit(isSubmit){
			var languageFilter = $injector.get('$filter')('language');
			return function(item){
				delete item.completedTime;
				delete item.updatedTime;
				delete item.history;
				if(!item.merchant  || !item.merchant.companyName){
					var defer = $q.defer();
					defer.resolve({data:{status:{code:'0',message:languageFilter('companyName')+' : '+languageFilter('errorMessageIsRequired')}}});
					return defer.promise;
				}else{
					return $http.post(service.url('/merchants',{submit:isSubmit}),item);
				}
			};
		}

		function approveReject(entity,actionName){
			var defer = $q.defer(),checkHttpResponse = $injector.get('checkHttpResponse');
			$http.post(service.url('/merchants/action'),{formInstanceId:entity.requestFormInstanceId,actionName:actionName,remark:entity.comment}).then(checkHttpResponse(function(req){
				defer.resolve(req);
			}));
			return defer.promise;
		}

	}]);

	function getFlows($http,$q,_,service){
		return function (flows){
			var defer = $q.defer();
			if(getFlows.data){
				defer.resolve(initFlows(getFlows.data,flows));
			}else{
				$http.get(service.url('/merchants/state')).then(function(req){
					getFlows.data = _.map(_.groupBy(req.data.data,'currentStateId'),function(nodes){
						return {
							'id':nodes[0].currentStateId,
							'name':nodes[0].currentStateName,
							'links': _.zipObject(_.map(nodes,function(i){return i.actionName;}), _.map(nodes,function(i){return i.nextStateId;}))
						};
					});
					defer.resolve(initFlows(getFlows.data,flows));
				});
			}
			return defer.promise;

			function initFlows($data,$flows){
				var nodes = JSON.parse(JSON.stringify($data));

				angular.forEach(nodes,function(node){
					angular.forEach(node.links,function(to,key){
						node.links[key] = _.find(nodes,{id:to});
					});
				});

				return {
					nodes:nodes,
					flows:_.map($flows,function(flow){
						var actionName = flow.actionName.replace(flow.description,'').trim();
						var stateName = flow.stateName || flow.description.replace(flow.actionName,'').trim();
						var node = _.find(nodes,function(n){return new RegExp(stateName || 'start','i').test(n.name);});
						return {from:node,to:node.links[actionName],data:flow.info};
					})
				};
			}
		};
	}

	function getItem($http,$q,_,checkHttpResponse,service){
		return function (item,needRemark,needActions,isCopy){
			var defer = $q.defer();
			$http.get(service.url('/merchants/'+item.mamRequestId,{isCopy:!!isCopy})).then(checkHttpResponse(function(req){
				var entity = req.data.data,actions = [];
				$q.all([
					needRemark && $http.get(service.url('/merchants/remark',{formInstanceId:req.data.data.requestFormInstanceId})).then(checkHttpResponse(function(remark){
						angular.extend(entity,{history:remark.data.data});
					})),
					needActions&&$http.get(service.url('/merchants/permission',{formInstanceId:entity.requestFormInstanceId})).then(checkHttpResponse(function(acs){
						actions =_.map(_.filter(acs.data.data,function(i){return !!i.actionName;}),function(i){return i.actionName;}).reverse();
					}))
				]).then(function(){
					delete entity.comment;
					defer.resolve([entity,actions]);
				});
			}));
			return defer.promise;
		};
	}


})(window.angular);