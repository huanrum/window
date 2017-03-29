/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular) {

	'use strict';


	angular.module('staff.common').factory('extendBaseService', ['$http', function ($http) {
		return {
			getName: getName,
			getColumns: noThing,
			load: load,
			postData:postData,
			getList: getList
		};

		function noThing() {}

		function getName(self,option, data) {
			return option.name;
		}

		function load(self,option, data) {
			var filters = '';
			angular.forEach(self.updateFilter&&self.updateFilter(option.filter) || option.filter,function(v,k){
				if(filters){
					filters += '&';
				}
				filters += k+'='+v;
			});
			filters = filters?((option.loadUrl.indexOf('?')!==-1?'&':'?')+filters):'';
			$http.get(option.loadUrl+filters).then(function(req){
				self.updateLoadedData(data,req.data || {});
				data.event.fire('load');
			});
		}

		function postData(self,option, data, item){
			$http.post(option.updateUrl,item).then(function(req){
				var items = data.list.filter(function(i){return i.id === req.data.id;});
				if(items && items[0]){
					angular.extend(items[0],req.data);
				}else{
					data.list.push(req.data);
				}
				data.event.fire('load');
			});
		}

		function getList(self,option, data) {
			data.list = data.list || [];
			return data.list;
		}
	}]);

})(window.angular);