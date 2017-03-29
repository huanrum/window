(function(angular,window){
	'use strict';

	function goToNext(helper,element,isEqGo,isNext){
		if(isEqGo){
			var brothers = findChildren(element.parents('[sino-keypress]').get(0),'[sino-keypress]');
			var activeIndex = brothers.indexOf(element.get(0));
			if(isNext){
				if(activeIndex+1 && activeIndex+1 < brothers.length){
					active(helper,brothers[activeIndex + 1],true);
				}
			}else{
				if(activeIndex > 0){
					active(helper,brothers[activeIndex - 1],true);
				}else{
					active(helper,findParent(element).get(0),true);
				}
			}
		}else {
			var children = findChildren(element.get(0), '[sino-keypress]');
			if (isNext && children[0]) {
				active(helper,children[0],true);
			} else {
				goToNext(helper,angular.element(element.parents('[sino-keypress]').get(0)), true,isNext);
			}
		}

		function findChildren(element,selector){
			var result = [];
			angular.forEach(angular.element(element).children(),function(child){
				if(angular.element(child).css('display') !== 'none'){
					if(angular.element(child).filter(selector).length){
						result.push(child);
					}else{
						result.push.apply(result,findChildren(child,selector));
					}
				}
			});
			return result;
		}

		function findParent(element){
			var parent = element.parents('[sino-keypress]');
			while(!canActive(helper,parent.get(0)) && parent.parents('[sino-keypress]').length){
				parent = parent.parents('[sino-keypress]');
			}
			return parent;
		}
	}

	function active(helper,newElement,autoChild) {
		if (!newElement) {
			return;
		}
		active.element = angular.element(newElement);
		var children = angular.element(newElement).find('[sino-keypress]');
		if (autoChild && !canActive(helper,newElement)) {
			newElement = null;
			for (var i = 0; i < children.length; i++) {
				if (canActive(helper,children[i])) {
					newElement = children[i];
					break;
				}
			}
		}
		if (newElement && canActive(helper,newElement)) {
			angular.element(newElement).focus();
			return true;
		}
	}

	function eqAttr(val){
		var sinoKeypress = active.element && active.element.attr('sino-keypress');
		return sinoKeypress && sinoKeypress.replace(/!/,'') === val;
	}

	function canActive(helper,el){
		var $el = angular.element(el);
		return $el.filter('[sino-keypress]').length && helper.truthValue(!/!/.test($el.attr('sino-keypress')) , !$el.find('[sino-keypress]').length);
	}

	angular.module('cms.common').directive('sinoKeypress',['helper',function(helper) {

		var $ = angular.element;
		$('body').click(function(e){
			if(!active(helper,e.target,false)){
				active(helper,$(e.target).parents('[sino-keypress]').get(0),false);
			}
		}).keyup(function (e) {
			if(!active.element){
				active(helper,$('[sino-keypress]').first(),true);
			}
			switch (e.keyCode){
				case 9://tab
					active(helper,window.document.activeElement,false);
					break;
				case 38://上
				case 40://下
					active(helper,window.document.activeElement,false);
					goToNext(helper,active.element,eqAttr('V'),e.keyCode>38);
					break;
				case 39://右
				case 37://左
					active(helper,window.document.activeElement,false);
					goToNext(helper,active.element,eqAttr('L'),e.keyCode>38);
					break;
				case 13:
				case 32:
					$(window.document.activeElement).click().dblclick();
					break;
				case 36://home
				case 35://end
				case 33://pgUp
				case 34://pgDn
					var action = {36:'first',35:'last',33:'prev',34:'next'}[e.keyCode];
					var goPage = $('[ui-view=mainContainer]').scope().goPage;
					if(helper.value(goPage,action)){
						goPage[action]();
					}
					break;
				default:
					break;
			}
		});

		return function(scope, element){
			element.attr('tabIndex',0);
		};
	}]);

})(window.angular,window);