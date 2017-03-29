/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular){
	
	'use strict';
	
	angular.module('staff.common').directive('protalFooterContainer',['$compile','$global',function($compile,$global){

		function getTemplate(){
			return [
				'<div class="protal-footer-left">',
				'   <select ng-model="footerType"><option ng-repeat="op in options" value="{{op.venueCode}}">{{op.venueName}}</option></select>',
				'   <div><span class="icon icon-beacon" ng-click="toggleBeacon()"></span></div>',
				'</div>',
				'<div class="protal-footer-center"></div>',
				'<div class="protal-footer-right"></div>'
			].join('');
		}
			return {
				restrict: "AE",
				scope:'=',
				template:getTemplate(),
				link: function ($scope) {
					$scope.toggleBeacon = function(){

					};
				}
			};

		}]);
})(window.angular);