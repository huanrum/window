(function(angular){
	'use strict';

	angular.module('sino.common',[]);
	angular.module('sino.main', ['sino.common']);


	angular.module('sino.common').value('$localStorage', window.localStorage);
	angular.module('sino.common').value('$global',{});
	angular.module('sino.common').value('_', window._);

	function scrollTop(element,index,callBack){
		element.each(function(i,el){
			if(index === true){
				index = el.index + 1;
			}else if(index === false){
				index = el.index - 1;
			}
			if(index>-1 && index<this.offsetHeight / angular.element(el).height()){
				el.index = index;
				angular.element(el).animate({'scrollTop':index * angular.element(el).height()},callBack);
			}
		});
	}


	angular.module('sino.common').filter('language',['$global','$localStorage','$injector',function($global,$localStorage,$injector){
		var language = ($localStorage.language || 'en').split('-').map(function(i){
			return i[0].toLocaleUpperCase()+ i.slice(1, i.length);
		}).join('');

		return function(value,defaultValue){
			return $injector.get('language'+language)[value] || defaultValue || $injector.get('language$en')[value] || value;
		};
	}]);

	angular.module('sino.common').directive('sinoMenu',['$filter',function($filter){
		return {
			restrict: 'A',
			link: function (scope, element,attrs) {
				var childrenMenu = angular.element('<ul style="display: none"></ul>').appendTo(element);
				element.hover(function(){
					childrenMenu.show();
				},function(){
					childrenMenu.hide();
				});
				angular.forEach(scope.$eval(attrs.sinoMenu),function(controller,index){
					var li = angular.element('<li></li>').html($filter('language')(controller)).appendTo(childrenMenu).click(function(){
						scrollTop(angular.element('.sino-content .tab-panel'),index);
					});
				});
			}
		};
	}]);

	angular.module('sino.common').directive('sinoScroll',['$timeout',function($timeout){
		return function(scope,element){
			element.on('scroll',scrollTo);
			scope.$on('$destroy',function(){
				element.off('scroll',scrollTo);
			});
		};

		function scrollTo(event) {
			if(!event.target.isRunning){
				event.target.isRunning = true;
				$timeout(function(){
					event.target.index = event.target.index || 0;
					var element = angular.element(event.target),float = element.scrollTop() - event.target.index * element.height();
					if(float>0.01||float<-0.01){
						scrollTop(element,float>0,function(){
							event.target.isRunning = false;
						});
					}else{
						event.target.isRunning = false;
					}
				},500);
			}


		}
	}]);

	angular.module('sino.common').directive('sinoHtml',['$http','$compile',function($http,$compile){
		return {
			restrict: 'A',
			link: function (scope, element,attrs) {
				element.attr('sino-html',null);
				$http.get(scope.$eval(attrs.sinoHtml).join('/')+'/index.html').then(function(req){
					var height = document.body.scrollHeight - angular.element('.sino-header').height();
					element.html(req.data);
					element.attr('ng-controller',scope.$eval(attrs.sinoHtml).pop()+'Controller');
					element.css({
						'height':height,
						'background-size': '100% 100%',
						'background-image':'url(../../../../icons/background/'+Math.floor(Math.random()*10)+'.jpg)'
					});
					element.parents('.tab-panel').css('height',height);
					$compile(element)(scope);
				});
			}
		};
	}]);


})(window.angular);
