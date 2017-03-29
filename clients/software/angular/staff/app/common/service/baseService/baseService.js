/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular) {

	'use strict';

	angular.module('staff.common').factory('baseService', ['extendBaseService', function (extendBaseService) {
		function Service() {}

		angular.extend(Service.prototype, extendBaseService);

		function Event() {
			var list = {};
			this.register = function (key, fn) {
				if (angular.isFunction(fn)) {
					list[key] = list[key] || [];
					list[key].push(fn);
				}
			};
			this.unregister = function (key, fn) {
				list[key] = list[key] || [];
				list[key] = list[key].filter(function(i){return i!==fn;});
			};
			this.fire = function (key) {
				var args = arguments;
				angular.forEach(list[key], function (fn) {
					if(angular.isFunction(fn)){
						fn.apply(null, args);
					}
				});
			};
		}

		return function (option) {
			var service = new Service();
			var data = {event: new Event(),list:[]};

			option.name = option.name || 'service-' + Date.now();
			angular.forEach(Service.prototype, function (v, k) {
				if (angular.isFunction(v)) {
					service[k] = function () {
						var args = [].concat.apply([service, option, data],arguments);
						return v.apply(service,args);
					};
				}
			});
			service.register = function () {
				var args = arguments;
				data.event.register.apply(data.event, args);
				return function () {
					data.event.unregister.apply(data.event, args);
				};
			};
			service.unregister = data.event.unregister;
			service.updateOptionFilter = function (filter) {
				option.filter = filter;
			};


			//可以重写的
			service.updateFilter = function(filter){return filter;};
			service.updateLoadedData = function($data,da){
				$data.list = da;
			};

			return service;
		};
	}]);

})(window.angular);