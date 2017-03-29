
(function(angular){

	'use strict';

	angular.module('sino.main').controller('courseController',['$scope','$http',function($scope,$http){


		$scope.getSrc = function(item){
			return '../../../../ExplorerFile/Get?path='+item;
		};

		$http.get($scope.getSrc('D:\\迅雷下载\\')).then(function(req){
			$scope.medias = req.data.filter(function(i){return /\.[mp4|mkv|rmvb]+$/.test(i.path);});
		});

	}]);
})(window.angular);