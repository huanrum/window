(function (angular) {
	'use strict';

	angular.module('cms.main').factory('historicalService', ['baseService', function (baseService) {

		return angular.extend(baseService({loadData:{url:'/analysis/efnalist'}}),{
			viewpdf:function(item){
				baseService.open('/download/viewpdf/'+item.id);
			},
			download:function(item){
				baseService.open('/download/pdf/'+item.id);
			}
		});
	}]);

})(window.angular);