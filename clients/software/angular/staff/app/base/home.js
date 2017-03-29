/**
 * Created by Administrator on 2016/6/13.
 */
(function(angular){

	'use strict';

	var url = "//query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22shenzhen%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=setWeather";
	var default_img = 'images/loading_36x36.gif';
	var weatherUrl = (window.location.protocol === 'https:' ? 'https:' : 'http:') + url;

	function getNowDateTime(date,fomatter){
		if(!date){
			date = new Date();
		}
		fomatter = fomatter || 'yyyy-MM-dd HH:mm';
		return fomatter.
			replace('YYYY',repair(date.getFullYear(),4)).
			replace('yyyy',repair(date.getFullYear(),4)).
			replace('MM',repair(date.getMonth() + 1,2)).
			replace('DD',repair(date.getDate(),2)).
			replace('dd',repair(date.getDate(),2)).
			replace('HH',repair(date.getHours(),2)).
			replace('hh',date.getHours()>12?('PM '+repair(date.getHours()-12,2)):('AM '+repair(date.getHours(),2))).
			replace('mm',repair(date.getMinutes(),2)).
			replace('ss',repair(date.getSeconds(),2)).
			replace('fff',repair(date.getMilliseconds(),3));
		function repair(value,place,char){
			value = '' + value;
			while(value.length < place){
				value = (char||0) + value;
			}
			return value;
		}
	}

	angular.module('staff.common').controller('homeController',[
		'$scope','$http','$timeout','$interval','$global',function($scope,$http,$timeout, $interval,$global){

			angular.element('<script src="'+weatherUrl+'"></script>').appendTo('body');

			$scope.userName = $global.username;
			$scope.userNo = $global.userNo;
			$scope.location = $global.location;
			$scope.curTime = getNowDateTime();
			$scope.weatherImg = default_img;
			$scope.low = '--';
			$scope.high = '--';



			$http.get($global.urls.jcontent + 'footer').then(function(req){
				if(req.data.returnCode === '0' && req.data.data){
					$scope.options = JSON.parse(req.data.data.content);
				}
			});

			$timeout(function(){
				$interval(function(){
					$scope.curTime = getNowDateTime();
				},1000 * 60);
			},(60 - new Date().getSeconds()) * 1000);

			window.setWeather = function(data) {
				if (data && data.query && data.query.results && data.query.results.channel && data.query.results.channel.item && data.query.results.channel.item.forecast) {
					var today = data.query.results.channel.item.forecast[0];

					$scope.low = parseInt((today.low - 32) * 5 / 9);
					$scope.high = parseInt((today.high - 32) * 5 / 9);
					$scope.weatherImg = 'http://l.yimg.com/a/i/us/we/52/' + today.code + '.gif';
					$scope.$apply();
				}
			};
		}]);
})(window.angular);