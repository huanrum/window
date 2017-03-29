(function (angular) {
	'use strict';

	var dataFormatter = 'yyyyMMDD';

	function urlHelper($global,module,_url){
		if(/^http/.test(_url)){
			return _url;
		}else{
			return $global.service(module) + _url;
		}
	}

	function staticUrl(module,$global,$injector){
		return function(_url,filter,useToken){
			if(filter){
				if(useToken){
					filter.token = $global.token;
				}
				return urlHelper($global,module,getParameters($injector,_url, filter));
			}else{
				return urlHelper($global,module,_url);
			}
		};
	}

	function getParameters($injector,url, data, replace) {
		var result = [];
		angular.forEach(data, to);
		if (result.length) {
			return url + (/\?/.test(url) ? '&' : '?') + result.join('&');
		} else {
			return url;
		}

		function to(value, field){
			if (angular.isDate(value)) {
				value = $injector.get('$filter')('sinoDate')(value,dataFormatter);
			}
			result.push((replace && replace[field] || field) + '=' + (value || ((angular.isNumber(value) || false === value) ? value : '')));
		}
	}

	function initDownload(hashDownload,sinoDateFilter,download,filter){
		if(hashDownload){
			filter.startDate = sinoDateFilter(new Date().setMonth(new Date().getMonth()-1),dataFormatter);
			filter.endDate = sinoDateFilter(new Date(),dataFormatter);
			return function(){
				download(filter);
			};
		}
	}

	function httpLookup($injector,lookup,lookupData,keys,lookupUrl,to){
		var $global = $injector.get('$global'),$http = $injector.get('$http'),helper = $injector.get('helper');
		var modules = /^\[(.*)\]/.exec(lookupUrl);
		return $http.get(urlHelper($global,modules&&modules[1],lookupUrl.replace(/^\[(.*)\]/,''))).then(function (req) {
			if(req && req.data && req.data.data){
				if(angular.isArray(req.data.data.list || req.data.data)){
					lookupData[keys[0]] = helper.arrayToObject(req.data.data.list || req.data.data,keys[1],to);
				}else{
					angular.forEach(req.data.data.list || req.data.data,function(v,k){
						lookup(k,v,null);
					});
				}
			}
		});
	}

	angular.module('cms.common').factory('lookupService',['_','$q','$http','$injector','$global','helper',function(_,$q,$http,$injector,$global,helper){
		var lookupData = {};

		return lookup;

		function lookup(key, data,to) {
			var keys = key.split(':');
			if(data){
				if(angular.isArray(data)){
					lookupData[keys[0]] = helper.arrayToObject(data,keys[1],to);
				}else if(angular.isString(data) || data.url){
					return httpLookup($injector,lookup,lookupData,keys,data.url || data,data.to || to);
				}else if(angular.isObject(data)){
					return $q.all(_.map(data,function(vale,key){
						return lookup(key,vale,null);
					}));
				}
			}else{
				return lookupData[keys[0]] || {};
			}
		}
	}]);


	function complement(module,options){
		angular.forEach(options.lookup,function(url,key){
			if(url.url){
				if(!/^\[.*\]/.test(url.url)){
					url.url = '['+module+']'+url.url;
				}
			}else{
				if(!/^\[.*\]/.test(url)){
					options.lookup[key] = '['+module+']'+url;
				}
			}
		});
	}

	function upload($http,$q,getReadUrl,options){
		return function(file){
			var defer = $q.defer(),formData = new FormData();
			formData.append("file", file);
			$http({
				method: 'POST',
				url: this.url(getReadUrl(options.uploadData)),
				data: formData,
				headers: {'Content-Type': undefined},
				transformRequest: function (data) {return data;}
			}).then(function(req){
				if(req.status === 200){
					defer.resolve(req);
				}else{
					defer.reject(req);
				}
			});
			return defer.promise;
		};
	}

	function openUrl($global,$injector,module){
		return function(url,filter){
			window.open(staticUrl(module,$global,$injector)(url, filter,true));
		};
	}

	angular.module('cms.common').factory('baseService', ['$q','$http', 'helper','$global','$injector','lookupService', function ($q,$http,helper, $global, $injector,lookupService) {

		baseService.url = staticUrl('',$global,$injector);
		baseService.open = openUrl($global,$injector,'');

		return baseService;

		function baseService(module,serviceUrl,options,extendApi) {
			if(angular.isObject(serviceUrl)){
				extendApi = options;
				options = serviceUrl;
				serviceUrl = '';
			}
			options = options || {};

			complement(module,options);

			var service = {
				'url':staticUrl(module,$global,$injector),
				'lookup':lookup,
				'list': list,
				'get':options.get && get,
				'open':openUrl($global,$injector,module),
				'upload':upload($http,$q,getReadUrl,options),
				'download':download,
				'create': createData,
				'update': updateData,
				'remove': removeData,
				'getDownload':getDownload
			};

			return angular.extend(Object.create(service),extendApi);

			function getReadUrl(urlOption){
				return helper.truthValue(helper.value(urlOption,'url'),serviceUrl);
			}

			function getDownload(filter){
				return initDownload(options.downloadData,$injector.get('$filter')('sinoDate'),download,filter);
			}

			function lookup(){
				lookupService('',options.lookup);
			}

			function list(filter) {
				return $http.get(service.url(getReadUrl(options.loadData), filter)).then(helper.value(options.loadData,'then'));
			}

			function get(entity) {
				var defer = $q.defer();
				$http.get(service.url(getReadUrl(options.get)+'/'+ helper.value(entity,['id','code']),{})).then($injector.get('checkHttpResponse')(function(req){
					defer.resolve(req);
				}));
				return defer.promise;
			}

			function download(filter) {
				return service.open(helper.value(options.downloadData,'url'), filter);
			}

			function createData(entity) {
				return $http.post(service.url(getReadUrl(options.createData),{}), entity);
			}

			function updateData(entity) {
				return $http.put(service.url(getReadUrl(options.updateData),{}), entity);
			}

			function removeData(entity) {
				return $http['delete'](service.url(getReadUrl(options.removeData)+'/'+ helper.value(entity,['id','code']),{}));
			}
		}
	}]);

	function getValue($injector) {
		var $filter = $injector.get('$filter'),value = $injector.get('helper').value,_ = $injector.get('_');
		return function(item, column){
			var result = value(item,column.field);
			if (column.formatter) {
				result = column.formatter( value(item,column.field), item);
			}else if (item &&  value(item,column.field) !== null && !angular.isUndefined(value(item,column.field))) {
				if (column.type) {
					var types = angular.isArray(column.type)?column.type:[column.type];
					result = angular.isObject( value(item,column.field))?angular.copy( value(item,column.field)): value(item,column.field);
					angular.forEach(types,function(type){
						result = userFilter(_,$filter,result,type);
					});
				} else {
					result =  value(item,column.field);
				}
			}
			if(angular.isArray(result)){
				result = userFilter(_,$filter,result,'array');
			}
			return $injector.get('$sce').trustAsHtml((angular.isUndefined(result)?'':result)+'');
		};
	}

	function userFilter(_,$filter,result,type){
		var regex = /[\(\)]/;
		if(/^\[.*\]$/.test(type)){
			type = type.slice(1,type.length-1);
			result = _.map(result,function(item){
				return $filter(type.split(regex)[0])(item, type.split(regex)[1]);
			});
		}else{
			result = $filter(type.split(regex)[0])(result, type.split(regex)[1]);
		}
		return result;
	}

	function comparisionExchange (baseDialog,$filter,obj,field1,field2){
		var sinoDate = $filter('sinoDate');
		if (obj[field1] > obj[field2]) {
			var temp = obj[field1];
			obj[field1] = obj[field2];
			obj[field2] = temp;
		}
		if((field1 in obj || field2 in obj) && (!obj[field1] || !obj[field2])){
			return false;
		}
		if(obj[field1] && obj[field2] && sinoDate(obj[field2],'yyyyMMdd') - sinoDate(obj[field1],'yyyyMMdd') > 10000){
			baseDialog.message(2, 'dateInterval', '{{\'dateIntervalMessage\'|language}}', {}, '', 2000);
			return false;
		}

		return true;
	}

	function iframe(dataService){
		return function (url,filter,size){
			size = size &&size.split('*') || [400,600];
			return function(){
				return '<iframe src="'+dataService.url(url,filter,true)+'" width="'+size[0]+'" height="'+size[1]+'" style="background: #999999;"></iframe>';
			};
		};
	}

	function setting($global,$timeout,$scope,baseDialog,language){
		var columns = ['title-t$language','field','width-text','hide-checkbox'];
		if($global.isDebug){
			$timeout(function(){
				$scope.toolbars.push({
					'info':'columns',
					'class':'fa-columns font-green',
					'fn':function(){
						baseDialog.grid(language($scope.title+'Menu')+' '+language('columns'),columns,eachCopy($scope.columns)).then(function(items){
							eachCopy(items,$scope.columns);
						});
					}
				});
			}, 100);
		}

		function eachCopy(items,list){
			list = list || [];
			angular.forEach(items,function(item,index){
				list[index] = angular.extend(list[index] || {},item);
			});
			return list;
		}
	}

	function getActions(_,$scope,dataService){
		var actions = {
			'edit': {
				'title': 'edit',
				'class': 'fa-edit',
				'operate':true,
				'disable':function(){
					return !$scope.permission.edit;
				},
				'fn': function (item) {
					if(!$scope.permission.edit){
						return;
					}
					if(dataService.get){
						dataService.get(item).then(function(req){
							$scope.edit(req.data.data,'confirm',['@confirm']);
						});
					}else{
						$scope.edit(item, 'confirm', ['@confirm']);
					}
				}
			},
			'remove': {
				'title': 'remove',
				'class': 'fa fa-fw fa-trash',
				'disable':function(){
					return !$scope.permission['delete'];
				},
				'fn': function (item) {
					if(!$scope.permission.edit){
						return;
					}
					$scope.remove(item, 'confirm');
				}
			}
		};

		if($scope.actions){
			return _.filter(_.map($scope.actions,function(ac){
				if(angular.isObject(ac)){
					return ac;
				}else if(actions[ac]){
					return actions[ac];
				}
			}),function(i){return !!i;});
		}else{
			return _.map(actions);
		}
	}

	function getOperate(_,$scope){
		return function(e,item){
			if(!angular.element(e.target).attr('ng-click') || e.target === e.currentTarget){
				var operate = _.find($scope.actions,{operate:true});
				if(operate){
					operate.fn(item);
				}
			}
		};
	}

	function getAddToolbar($scope){
		return {
			'info':'add',
			'title':$scope.addButtonTitle,
			'class':'font-green tool-bars-btn',
			'fn':function(){
				$scope.create({},'confirm',['@confirm']);
			}
		};
	}

	function getPage($scope,$global,$injector){
		angular.extend(goPage,{
			first:function(){goPage(1);},
			prev:function(){goPage(Math.max(1,$scope.filter.pageNo-1));},
			next:function(){goPage(Math.min($scope.totalPages,$scope.filter.pageNo+1));},
			last:function(){goPage($scope.totalPages);}
		});
		return goPage;
		function goPage(page) {
			$scope.filter.pageNo = page;
			if ($global.isDebug) {
				$injector.get('baseDialogAnimation')(page, 'change-page', 2000);
			}
			$scope.refreshData();
		}
	}

	function createAction($injector,$scope,dialogUI,dataService,ac){
		var _ = $injector.get('_'),$q = $injector.get('$q'),helper = $injector.get('helper'),baseDialog = $injector.get('baseDialog'),checkHttpResponse = $injector.get('checkHttpResponse');
		if(dialogUI){
			return function (item, type,actions) {
				var defer = $q.defer();
				baseDialog.edit(helper.upperFirstChar(ac, $scope.title), dialogUI($scope, dataService, ac), JSON.parse(JSON.stringify(item)), type,actions).then(function(entity,action,close,keep){
					var api = (dataService[action[0]] || dataService[action] || dataService[(ac === 'edit')?'update':'create']);
					if(api){
						return api(entity,action[1]).then(checkHttpResponse(function(req){
							if(close){
								close();
							}
							defer.resolve(req);
							$scope.refreshData();
						},keep),keep);
					}else{
						defer.resolve(entity,action,close,keep);
					}
				});
				return defer.promise;
			};
		}else{
			return function(e,item){
				var defaultUlOption = {
					width:1000,
					disable:function(){
						return true;
					},
					rows: _.map($scope.columns,function(i) {
							return {
								title: i.title,
								field: i.field,
								editor:i.tooltip && i.tooltip / 100
							};
						})
				};
				baseDialog.edit('view', dialogUI?dialogUI($scope, dataService, 'view'):defaultUlOption, item,'',[]);
			};
		}
	}

	function searchEditor(_,helper,lookupService,$scope){
		return function(){
			if(!$scope.filter.searchBy && helper.value($scope.searchColumns,'length')===1){
				$scope.filter.searchBy = $scope.searchColumns[0].field;
			}
			var column = _.find($scope.searchColumns,function(i){return i.field === $scope.filter.searchBy;});
			if(column){
				if(angular.isString(column .editor)){
					return _.union([''],_.map(lookupService(column.editor),function(i){return helper.value(i,['value','code','id']);}));
				}else if(angular.isFunction(column.editor)){
					return column .editor();
				}
				return column .editor;
			}
		};
	}

	function refreshData($q,checkHttpResponse,$filter,baseDialog,$scope,dataService){
		return function (reSetting) {
			var defer = $q.defer();
			if(reSetting && angular.isDefined($scope.filter.pageNo)){
				$scope.filter.pageNo = 1;
			}
			if(comparisionExchange(baseDialog,$filter,$scope.filter)){
				dataService.list($scope.filter).then(checkHttpResponse(function (req) {
					angular.extend($scope, req.data.data);
					$scope.dataList = req.data.data.list || req.data.data.content || req.data.data;
					defer.resolve();
				}));
			}
			return defer.promise;
		};
	}

	angular.module('cms.common').factory('baseController', ['_', '$q', '$injector', '$timeout', '$global', 'baseDialog','checkHttpResponse', function (_, $q, $injector, $timeout, $global, baseDialog,checkHttpResponse) {

		var helper = $injector.get('helper'),$interval = $injector.get('$interval');

		return function ($scope, dialogUI, dataService,extendOption) {
			var activeMenu = helper.truthValue(_.last($scope.activeList),{});
			var defaultScope = {
				isDebug : $global.isDebug,
				toolbars:[],
				filter:{pageSize:20, pageNo: 1}
			};
			angular.extend($scope,activeMenu,{title:activeMenu.url},angular.extend(defaultScope,$scope));
			setting($global,$timeout,$scope,baseDialog,$injector.get('$filter')('language'));
			$injector.get('manageHttpToken').allPermission($scope);
			$scope.open = dataService.open;
			$scope.iframe = iframe(dataService);
			$scope.getValue = getValue($injector);
			$scope.sortColumn = sortColumn;
			$scope.selected = selected;
			$scope.goPage = getPage($scope,$global,$injector);
			$scope.refreshData = refreshData($q,checkHttpResponse,$injector.get('$filter'),baseDialog,$scope,dataService);
			$scope.create = createAction($injector,$scope,dialogUI,dataService,'create');
			$scope.edit = createAction($injector,$scope,dialogUI,dataService,'edit');
			$scope.view = createAction($injector,$scope,dialogUI,dataService,'view');
			$scope.remove = remove;
			$scope.download = dataService.getDownload($scope.filter);
			$scope.searchEditor = searchEditor(_,helper,$injector.get('lookupService'),$scope);
			$scope.actions = getActions(_,$scope,dataService);
			$scope.operate = getOperate(_,$scope);
			if($scope.addButtonTitle && helper.value($scope.permission,'create')){
				$scope.toolbars.push(getAddToolbar($scope));
			}

			$scope.search = function(e){
				if(e.keyCode === 13){
					$scope.refreshData();
				}
			};

			function sortColumn(column) {
				column.isAscending = !column.isAscending;
				$scope.filter.sortBy = column.field.split('.').pop();
				$scope.filter.isAscending = !column.isAscending;
				$scope.refreshData();
			}
			function selected(item){
				if(angular.isDefined(item)){
					$scope.selectedItem = item;
				}
				return $scope.selectedItem;
			}

			function remove(item) {
				var defer = $q.defer();
				baseDialog.message('fa fa-trash-o', 'confirmDeleteTitle', '{{\'confirmDeleteContent\'|language}}', {}, 'no/yes').then(function () {
					return dataService.remove(item).then(checkHttpResponse(function(){
						if($scope.dataList.length === 1){
							$scope.filter.pageNo = Math.max($scope.filter.pageNo-1,1);
						}
						$scope.refreshData();
						defer.resolve();
					}));
				});
				return defer.promise;
			}
			$timeout(function(){
				$scope.refreshData().then(function(){
					if(helper.value(extendOption ,'refreshAfter')){
						extendOption.refreshAfter($scope.dataList);
					}
				});
				dataService.lookup();
				if($scope.$interval){
					var interval = $interval($scope.refreshData,$scope.$interval);
					$scope.$on('$destroy',function(){
						$interval.cancel(interval);
					});
				}
			}, 100);
		};
	}]);

})(window.angular);