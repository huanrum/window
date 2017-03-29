(function (angular) {
	'use strict';

	angular.module('cms.main').factory('guidelineService', ['_','$q','$http','$global','baseService', function (_,$q,$http,$global,baseService) {

		return angular.extend(baseService({
			loadData:{url:'/guideline/list',then:updateThen},
			updateData:{url:'/guideline/'}
		}),{
			fileUrl:'/guideline/viewPdf',
			saveFile:saveFile

		});

		function updateThen(req){
			if(!req.data.data || !req.data.data.list || !req.data.data.list.length){
				req.data.data.list = _.times(2,function(i){return {languageType:i+1};});
			}
			return req;
		}
		function saveFile(file){
			var defer = $q.defer(),formData = new FormData();
			formData.append("file", file);
			$http({
				method: 'POST',
				url: baseService.url('/guideline/pdfFile'),
				data: formData,
				headers: {'Content-Type': undefined},
				transformRequest: function (data) {return data;}
			}).then(function(req){
				if(req.status === 200){
					defer.resolve(req.data);
				}else{
					defer.reject(req);
				}
			});
			return defer.promise;
		}
	}]);

})(window.angular);