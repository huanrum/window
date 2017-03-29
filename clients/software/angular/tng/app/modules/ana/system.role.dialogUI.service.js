(function (angular) {
	'use strict';


	function getFunctions(_,helper,lookupService,entity){
		var temp = {};
		return function(item){
			if(temp[item.applicationCode]){
				entity.functionList = temp[item.applicationCode];
			}else{
				var functions = _.map(_.filter(lookupService('functions'),function(i){return i.application.code === item.applicationCode;}),function(i){return angular.copy(i);});
				angular.forEach(functions,function(func){
					var entityFunc = _.find(entity.functionList,{code:func.code});
					var permissionList = _.filter(lookupService('permission'),function(i){return helper.and(func.permissionSum , i.id);});
					if(entityFunc){
						func.permission  = helper.permissionSum(entityFunc.permissionSum,permissionList);
					}
					func.options = _.zipObject(_.map(permissionList,function(i){return i.id;}),_.map(permissionList,function(i){return {name:i.name,sort: i.id,description: i.description};}));
				});

				entity.functionList = functions;
				temp[item.applicationCode] = functions;
			}
		};
	}

	angular.module('cms.main').factory('roleDialogUiService', ['_','$filter','lookupService','helper',function (_,$filter,lookupService,helper) {

		function collectEntity(entity){
			return angular.extend({},entity,{
				functionList: _.filter(_.map(entity.functionList,function(i){
					return {
						code:i.code,
						permissionSum:helper.permissionSum(i.permission)
					};
				}),function(i){return i.permissionSum;})
			});
		}

		return function() {
			return {
				'width':900,
				'class':'role-dialog',
				'rows':getRows,
				'collectEntity':collectEntity
			};

			function getRows(entity){
				if(entity.application){
					entity.applicationCode = entity.application.code;
					delete entity.application;
				}

				return {
					'$empty$base':{
						'left':[
							{
								'title':'role',
								'field':'name',
								'editor':'text',
								'required': true,
								'width':0.333,
								'validate':'length(20)'
							},
							{
								'title':'description',
								'field':'description',
								'editor':'text',
								'required': true,
								'width':0.666,
								'validate':'length(200)'
							},
							{
								'title':'inOutSide',
								'field':'type',
								'width':0.333,
								'editor': _.map(lookupService('inOutSide')),
								'disable':true
							},
							{
								'title':'application',
								'field':'applicationCode',
								'width':0.666,
								'editor': _.filter(_.map(lookupService('module')),function(i){return i.isDisplay;}),
								'change':getFunctions(_,helper,lookupService,entity)
							}
						]
					},
					'$empty$function':{
						'left': [
							{
								'field': 'functionList',
								'editor':'sino-table',
								'mime':[
									{'title':'function','field':'code','width':'20%'},
									{'title':'description','field':'description','width':'40%'},
									{'title':'permission','field':'permission','width':'30%','editor':function(scope,column,$columnStr){
											return '<input sino-multiple="it.options" class="form-control" ng-model="it[' + $columnStr + '.field]" ' + ((!column.editor || column.disable) && 'disabled') + ' sino-use-id>';
									}},
									{'title':'description','field':'description','width':'10%',editor:function(){
										return '<div  class="sino-multiple-fa" sino-tooltip="150" ng-repeat="op in it.options">{{op.description || "&nbsp;"}}</div>';
									}}
								]
							}
						]
					}
				};
			}

		};
	}]);

})(window.angular);