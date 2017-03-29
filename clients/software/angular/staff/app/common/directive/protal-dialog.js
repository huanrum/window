/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular){
	
	'use strict';

	angular.module('staff.common').service('protalDialogService',['$q','$rootScope','$compile',function($q,$rootScope,$compile) {
		return function(contentTemplate,option,entity){
			var defer = $q.defer(),$scope = $rootScope.$new();

			var panelParent = angular.element('<div class="protal-dialog-panel-parent"><div class="protal-dialog-panel"><div class="protal-dialog-header">'+option.title+'</div></div></div>').appendTo('body');

			$scope.entity = entity || {};
			if(!angular.isString(contentTemplate)){
				$scope.option = {columns:contentTemplate};
				contentTemplate = '<div protal-form></div>';
			}

			var content = $compile(angular.element(contentTemplate).appendTo(panelParent.find('.protal-dialog-panel')))($scope);
			angular.forEach(option.buttons, function (button,index,buttons) {
				angular.element('<button>'+(button.title || button.name)+'</button>').appendTo(panelParent.find('.protal-dialog-panel')).click(function(e){
					panelParent.remove();
					(button.fn || button)($scope,e);
					defer.resolve($scope,e,button);
				}).css({marginRight : 100/(buttons.length+1)+'%'});
			});

			setTimeout(function(){
				panelParent.find('.protal-dialog-panel').css({
					display : 'block',
					left : (window.document.body.scrollWidth / 2.5 - (content.offsetWidth/2||100)),
					top : (window.document.body.scrollHeight / 3 - (content.offsetHeight/2||100))
				});
				$scope.$apply();
			},10);

			return defer.promise;
		};
	}]);

})(window.angular);