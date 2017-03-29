(function (angular,_) {
	'use strict';

	function upperFirstChar(prefix, str) {
		if (str && angular.isString(str)) {
			return prefix + str[0].toLocaleUpperCase() + str.slice(1);
		} else {
			return '';
		}
	}

	function arrayToObject(data,primaryKey) {
		if (angular.isArray(data)) {
			return _.zipObject(_.map(data, function (i) {
				return [i[primaryKey||'id'], i];
			}));
		} else {
			return data;
		}
	}

	function url($global,_url){
		return $global.eFNAServiceUrl + _url;
	}

	function staticUrl($global,$injector){
		return function(_url,filter,useToken){
			if(filter){
				if(useToken){
					filter.token = $global.token;
				}
				return url($global,getParameters($injector,_url, filter));
			}else{
				return url($global,_url);
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
				value = $injector.get('$filter')('sinoDate')(value,'yyyyMMDD');
			}
			result.push((replace && replace[field] || field) + '=' + (value || ((angular.isNumber(value) || false === value) ? value : '')));
		}
	}

	function initDownload(hashDownload,$global,sinoDateFilter,download,filter){
		if(hashDownload){
			filter.startDate = sinoDateFilter(new Date().setMonth(new Date().getMonth()-1),$global.dataFormatter);
			filter.endDate = sinoDateFilter(new Date(),$global.dataFormatter);
			return function(){
				download(filter);
			};
		}
	}

	angular.module('cms.common').factory('lookupService',['_','$q','$http','$global',function(_,$q,$http,$global){
		var lookupData = {};

		return lookup;

		function lookup(key, data) {
			var keys = key.split(':');
			if(angular.isArray(data)){
				lookupData[keys[0]] = arrayToObject(data,keys[1]);
			}else if(angular.isString(data)){
				return $http.get(url($global,data)).then(function (req) {
					lookupData[keys[0]] = arrayToObject(req.data.data.list || req.data.data,keys[1]);
				});
			}else if(angular.isObject(data)){
				return $q.all(_.map(data,function(vale,key){
					return lookup(key,vale);
				}));
			}else{
				return lookupData[keys[0]] || {};
			}
		}
	}]);

	angular.module('cms.common').factory('baseService', ['$http', '$global','$injector','lookupService', function ($http, $global, $injector,lookupService) {

		baseService.url = staticUrl($global,$injector);
		baseService.open = openUrl;

		return baseService;

		function openUrl(url,filter){
			window.open(baseService.url(url, filter||{},true));
		}

		function baseService(options) {
			lookupService('',options.lookup);

			return Object.create({
				url:staticUrl($global,$injector),
				list: list,
				open:openUrl,
				download:download,
				new: newData,
				update: updateData,
				delete: deleteData,
				getDownload:getDownload
			});

			function getDownload(filter){
				return initDownload(options.downloadData,$global,$injector.get('$filter')('sinoDate'),download,filter);
			}

			function list(filter) {
				return $http.get(baseService.url(options.loadData.url, filter)).then(options.loadData.then);
			}

			function download(filter) {
				return openUrl(options.downloadData.url, filter);
			}

			function newData(entity) {
				return $http.post(baseService.url(options.newData.url,{}), entity);
			}

			function updateData(entity) {
				return $http.post(baseService.url(options.updateData.url,{}), entity);
			}

			function deleteData(entity) {
				return $http.delete(baseService.url(options.deleteData.url+'/'+ entity.id,{}));
			}
		}
	}]);

	function getValue(item, column) {
		var $injector = angular.element('body').injector();
		if (item && item[column.field] !== null && !angular.isUndefined(item[column.field])) {
			if (column.type) {
				var result = item[column.field],types = angular.isArray(column.type)?column.type:[column.type];
				angular.forEach(types,function(type){
					result = userFilter($injector,result,type);
				});
				return result;
			} else if (column.formatter) {
				return column.formatter(item[column.field], item);
			} else {
				var lookupItems = $injector.get('lookupService')(column.field), lookupItem = lookupItems&&lookupItems[item[column.field]];
				if (lookupItem) {
					return lookupItem.name || lookupItem.title;
				} else {
					return item[column.field];
				}
			}
		}
	}

	function userFilter($injector,result,type){
		var regex = /[\(\)]/;
		if(/^\[.*\]$/.test(type)){
			type = type.slice(1,type.length-1);
			result = $injector.get('_').map(result,function(item){
				return $injector.get('$filter')(type.split(regex)[0])(item, type.split(regex)[1]);
			});
		}else{
			result = $injector.get('$filter')(type.split(regex)[0])(result, type.split(regex)[1]);
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
		var columns = ['title-t$language','field','width-text','noSort-checkbox','hide-checkbox'];
		if($global.isDebug){
			$timeout(function(){
				$scope.toolbars.push({
					info:'columns',
					class:'fa-columns font-green',
					fn:function(){
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


	angular.module('cms.common').factory('baseController', ['_', '$q', '$filter', '$timeout', '$global', 'baseDialog','checkHttpResponse', function (_, $q, $filter, $timeout, $global, baseDialog,checkHttpResponse) {

		return function ($scope, dialogUI, dataService) {
			var defaultScope = {
				isDebug : $global.isDebug,
				toolbars:[],
				filter:{pageSize: 20, pageNumber: 1}
			};
			angular.extend($scope,angular.extend(defaultScope,$scope));
			setting($global,$timeout,$scope,baseDialog,$filter('language'));
			$scope.open = dataService.open;
			$scope.iframe = iframe(dataService);
			$scope.getValue = getValue;
			$scope.sortColumn = sortColumn;
			$scope.setSelected = setSelected;
			$scope.goPage = goPage;
			$scope.refreshData = refreshData;
			$scope.new = add;
			$scope.edit = edit;
			$scope.delete = remove;
			$scope.download = dataService.getDownload($scope.filter);

			function sortColumn(column) {
				column.isAscending = !column.isAscending;
				$scope.filter.sortBy = column.field;
				$scope.filter.isAscending = !column.isAscending;
				$scope.refreshData();
			}

			function setSelected(item){
				$scope.selectedItem = item;
			}

			function goPage(page) {
				$scope.filter.pageNumber = page;
				if ($global.isDebug) {
					baseDialog.animation(page, 'change-page', 2000);
				}
				$scope.refreshData();
			}


			function refreshData() {
				if(comparisionExchange(baseDialog,$filter,$scope.filter,'startDate','endDate')){
					dataService.list($scope.filter).then(checkHttpResponse(function (req) {
						angular.extend($scope, req.data.data);
						$scope.dataList = req.data.data.list;
					}));
				}
			}

			function add(item, type) {
				baseDialog.edit(upperFirstChar('new', $scope.title), dialogUI($scope, dataService, 'new'), item||{}, type).then(function (entity) {
					dataService.new(entity).then(checkHttpResponse(refreshData));
				});
			}

			function edit(item, type) {
				baseDialog.edit(upperFirstChar('edit', $scope.title), dialogUI($scope, dataService, 'edit'), JSON.parse(JSON.stringify(item||{})), type).then(function(entity){
					dataService.update(entity).then(checkHttpResponse(refreshData));
				});
			}


			function remove(item) {
				baseDialog.message(3, 'Delete', '{{\'' + upperFirstChar('delete', $scope.title) + '\'|language}}', {}, 'yes/no').then(function () {
					dataService.delete(item).then(checkHttpResponse(refreshData));
				});
			}

			$timeout($scope.refreshData, 100);
		};
	}]);

})(window.angular,window._);