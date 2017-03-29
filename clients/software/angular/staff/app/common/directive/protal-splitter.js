/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular){
	
	'use strict';

	angular.module('staff.common').directive('protalSplitter',['$timeout','$global',function($timeout,$global) {
		return {
			restrict: "AE",
			scope: {},
			link: function ($scope, element, attr) {
				$timeout(function(){
					if(attr.protalSplitter){
						element.css({width:element.next().width(),height:'5px',top:element.prev().height()});
						drag(element,false);
					}else{
						element.css({height:element.next().height(),width:'5px',left:element.prev().width()});
						drag(element,true);
					}
				});
			}
		};


		function drag(element,ishorizontal){
			var eTemp = null;
			element.on('mousedown',function(e){
				eTemp = e;
				element.prev().on('mousemove',move).on('mouseup',up);
				element.next().on('mousemove',move).on('mouseup',up);
				element.on('mouseup',up);
			});

			function up(){
				eTemp = null;
				element.prev().off('mousemove',move).off('mouseup',up);
				element.next().off('mousemove',move).off('mouseup',up);
				element.off('mouseup',up);
			}

			function move(e){
				if(!ishorizontal){
					element.prev().css('height',parseFloat(element.prev().css('height')) + e.clientY - eTemp.clientY);
					element.next().css('height',parseFloat(element.next().css('height')) - e.clientY + eTemp.clientY);
					element.css('top',parseFloat(element.css('top')) + e.clientY - eTemp.clientY);
					element.next().css('top',parseFloat(element.next().css('top')) + e.clientY - eTemp.clientY);
				}else{
					element.prev().css('width',parseFloat(element.prev().css('width')) + e.clientX - eTemp.clientX);
					element.next().css('width',parseFloat(element.next().css('width')) - e.clientX + eTemp.clientX);
					element.css('left',parseFloat(element.css('left')) + e.clientX - eTemp.clientX);
					element.next().css('left',parseFloat(element.next().css('left')) + e.clientX - eTemp.clientX);
				}
				eTemp = e;
			}
		}

	}]);
})(window.angular);