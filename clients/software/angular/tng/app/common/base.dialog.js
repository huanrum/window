(function (angular) {
	'use strict';

	var focusSelector = 'input:not([readonly]),select:not([readonly]),textarea:not([readonly]),[tabIndex]:not([readonly])';

	function initField(field){
		if(angular.isArray(field)){
			return field.join('-');
		}else{
			return field[0] === '['?field:('.'+field);
		}
	}
	function createCommon($scope,bodyElement, row,rowStr) {
		if($scope.defaultRatio){
			row.ratio = row.ratio || $scope.defaultRatio;
		}
		row.title = row.title || '$empty$';
		return angular.element([
				('<div @ng-hide@ class="row '+(row['class']||'')+'" @style@>').replace('@style@',(row.width>0&&row.width<=1)&&('style="width:calc('+(100*row.width)+'% - 2em)"')||'').replace('@ng-hide@',angular.isFunction(row.hide)?('ng-hide="'+rowStr+'.hide(entity,'+rowStr+')"'):''),
				'   <div class="sino-title '+(row.ratio&&'inline-flex')+'"  style="width:'+(row.ratio&&(Math.floor(row.ratio/(1+row.ratio) * 10000)/100+'%'))+'"> {{\'' + row.title + '\'| language}} '+(row.titleExtend || '')+ (row.required ? '<span class="sino-required">*</span>' : ''),
				((!row.field || !row.tooltip) ? '' : '&nbsp;<a ng-if="!showError" class="helper-icon fa fa fa-question-circle" title="{{\'' + row.tooltip + '\'|language}}"></a>'),
				(!row.field ? '' : '<a ng-if="showError && !!$error[\'' + row.title + '\']" class="error-icon fa fa-exclamation-circle" title="{{$error[\'' + $scope.helper.validateFiled(row.title) + '\'].message|translator:$error[\'' + $scope.helper.validateFiled(row.title) + '\'].parameters}}"></a>'),
				'	</div>',
				'   <div class="sino-value '+(row.ratio&&'inline-flex')+'" style="width:calc('+(row.ratio&&(Math.floor(1/(1+row.ratio) * 10000)/100+'% - 1em'))+')" ng-class="{\'sino-validate-border-red\':showValidateBorder && !!$error[\'' + $scope.helper.validateFiled(row.title) + '\']}"></div>',
				'</div>'
			].join('')
		).appendTo(bodyElement).find('.sino-value');
	}

	function drag(dialog) {
		var temp = {}, dragEls = dialog.find('.dialog-header,.dialog-footer');
		dragEls.on('mousedown', function (e) {
			temp.e = e;
			temp.x = e.clientX - (parseInt(dialog.css('left')) || 0);
			temp.y = e.clientY - (parseInt(dialog.css('top')) || 0);
			dragEls.css('cursor', 'move');
			dialog.parent().on('mousemove', mousemove);
		});
		dialog.parent().on('mouseup', function () {
			dragEls.css('cursor', 'default');
			dialog.parent().off('mousemove', mousemove);
		});
		dialog.on('dragover',stop);
		dialog.on('drop',stop);
		function stop(evt) {
			evt.stopPropagation();
			evt.preventDefault();
		}
		function mousemove(e) {
			dialog.css({left: e.clientX - temp.x, top: e.clientY - temp.y});
		}
	}
	function buttons($timeout,$scope,option,okTitle,noTitle,action){
		var types = $scope.helper.truthValue(option.type&&option.type.split('/'),[]);
		var className = /\[(.*)\]/g.exec(action);
		action = action.replace(/\[.*\]/g,'');
		if(action === '--'){
			return {'class':'visibility-hidden'};
		}
		if(okTitle[action.toLocaleLowerCase().replace(/[!@]/g, '')]){
			return  {
				'title': $scope.helper.truthValue(okTitle[action.toLocaleLowerCase().replace(/[!@]/g, '')] , types[0] && okTitle[types[0].replace(/[!@]/g, '')] , 'ok'),
				'class': 'btn-default-default ' + (className && className[1]),
				'fn': function () {
					return $timeout(function () {
						$scope.$ok(action.replace(/[a-zA-Z0-9]/g, ''));
					}, 500);
				}
			};
		}
		if(noTitle[action.toLocaleLowerCase()]){
			return {
				'title': $scope.helper.truthValue(noTitle[action.toLocaleLowerCase().replace(/[!@]/g, '')] , $scope.helper.value(noTitle,[types[0],types[1]]) , types[1] , 'cancel'),
				'class': 'btn-cancel ' + (className && className[1]),
				'fn': function () {
					return $scope.$close(action.replace(/[!@]/g, ''));
				}
			};
		}
	}
	function getButtons(_,$scope,$timeout,option){
		var okTitle =  {
			'create': 'add',
			'edit': 'update',
			'save': 'save',
			'submit':'submit',
			'search': 'search',
			'confirm': 'confirm',
			'yes':'yes',
			'login':'login'
		};
		var noTitle =  {
			'cancel': 'cancel',
			'no': 'no',
			'close': 'close'
		};
		function functionButton(actionOption){
			if(angular.isFunction(actionOption)){
				var button = getAc(actionOption($scope));
				$scope.blurList.push(function(row){
					button.title = actionOption($scope,button,row);
				});
				return button;
			}
		}
		function getAc(action){
			return buttons($timeout,$scope,option,okTitle,noTitle,action) || (function(ac){
					var className = /\[(.*)\]/g.exec(action);
					return {
						'title': ac.replace(/[!@\$]/g, '').replace(/\(.*\)/g, '$action$'),
						'class': 'btn-default-self ' + (className && className[1]),
						'fn': function(){
							return $scope.$ok(ac);
						}
					};
				})(action.replace(/\[.*\]/g,''));
		}
		if(/!/.test(option.title)){
			option.actions = $scope.helper.truthValue(option.actions , []);
			option.hideClose = true;
			option.title = option.title.replace(/!/,'');
			if(!_.some(_.map(noTitle),function(n){return _.some(option.actions,function(a){return a.toLocaleLowerCase().replace(/[!@\$]/g, '').replace(/\[(.*)\]/g,'').replace(/\(.*\)/g, '') === n;});})){
				option.actions.unshift('close');
			}
		}
		return _.map(_.filter(option.actions,function(i){return !!i;}) ,function (action) {
			return functionButton(action) || getAc(action);
		});
	}
	function getOk(_,$timeout,message,$scope,option,defer){
		return function(action) {
			if($scope.disable){
				return;
			}
			$scope.disable = true;
			$scope.showValidateBorder = !/!/.test(action);
			$scope.showError = $scope.isDebug || !/!/.test(action);
			if (message.validate($scope.$error,action.toLocaleLowerCase())) {
				$scope.disable = false;
			} else {
				if (option.collectEntity) {
					var entity = option.collectEntity($scope.entity);
					if(entity.then){
						entity.then(function(data){then(data,action);});
					}else{
						then(entity,action);
					}
				} else {
					then($scope.entity,action);
				}
			}
		};
		function then(data,action) {
			var actionField = /\((.*)\)/.exec(action);
			var actionName = action && action.replace(/[!@\$]/g, '').replace(/\(.*\)/g, '');
			if(/@/.test(action)){
				defer.resolve(data, actionField?[actionField[1],actionName]:actionName,$scope.$close,function(){
					$scope.disable = false;
				});
			}else{
				defer.resolve(data, actionField?[actionField[1],actionName]:actionName);
				$scope.$close();
			}
		}
	}
	function keyupEvent($scope,dialog){
		var dialogSection = dialog.find('.dialog-section'),dx = 20,dy = 40;
		dialog.focus();
		angular.element(dialog.find(focusSelector)[$scope.option.focus || 0]).focus();
		dialog.keydown(function(e){
			if (e.keyCode === 9 && window.document.activeElement === dialog.find(focusSelector).last().get(0)) {
				dialog.find(focusSelector).first().focus();
				return false;
			}
		});
		dialog.keyup(function(e){
			switch (e.keyCode) {
				case 27://esc
					$scope.$close();
					break;
				case 13:
				case 32:
					angular.element(window.document.activeElement).click();
					break;
				case 38://上
					dialogSection.scrollTop(Math.max(0,dialogSection.scrollTop() - dy));
					break;
				case 40://下
					dialogSection.scrollTop(Math.min(dialogSection.height(),dialogSection.scrollTop() + dy));
					break;
				case 37://左
					dialogSection.scrollLeft(Math.max(0,dialogSection.scrollLeft() - dx));
					break;
				case 39://右
					dialogSection.scrollLeft(Math.min(dialogSection.width(),dialogSection.scrollLeft() + dx));
					break;
				default:
					break;
			}
			return false;
		});
	}
	function autoRemove($scope,$timeout,$interval,dialog, interval) {
		var stop = false,zoom = 0.93;
		dialog.fadeIn(500);
		$timeout(function () {
			angular.forEach($scope.readyList,function(i){i();});
			var overflow = dialog.find('.dialog-section').css('overflow');
			var vHeight = dialog.height() - dialog.find('.dialog-header').height() - dialog.find('.dialog-footer').height();
			dialog.find('.dialog-section').css({maxHeight:vHeight * zoom,overflow:  overflow === 'visible' ? 'auto':overflow});
			if(dialog.find('.dialog-section').height() > vHeight * zoom){
				dialog.find('.dialog-section').css({height:vHeight * zoom,overflow: 'auto'});
			}
			if(dialog.find('.dialog-section').width() > dialog.width() * zoom){
				dialog.find('.dialog-section').css({width:dialog.width() * zoom});
			}
			drag(dialog.find('.cms-body'));
			keyupEvent($scope,dialog);
		});
		if (angular.isNumber(interval)) {
			var times = 30;
			$timeout(function () {
				var intNumber = $interval(function () {
					if (!stop) {
						times = times - 1;
					}
					dialog.css('opacity', times/30);
					if (times < 0) {
						$scope.auto();
						$interval.cancel(intNumber);
					}
				}, 100);
			}, interval);
			dialog.find('.cms-body').hover(function () {
				stop = !stop;
			});
		}
		return function(){};
	}
	function promise(scope){
		var functions = [],clsFunctions = [],autoFunctions = [];
		return {
			resolve:function(){
				for(var i=0;i<functions.length;i++){
					if(functions[i].apply(scope,arguments) === false){
						return ;
					}
				}
			},
			then:function(fn){
				functions.push(fn);
				return this;
			},
			auto:function(fn){
				if(angular.isFunction(fn)){
					autoFunctions.push(fn);
				}else{
					for(var i=0;i<autoFunctions.length;i++){
						autoFunctions[i].apply(scope,arguments);
					}
				}
				return this;
			},
			end:function(fn){
				if(angular.isFunction(fn)){
					clsFunctions.push(fn);
				}else{
					for(var i=0;i<clsFunctions.length;i++){
						clsFunctions[i].apply(scope,arguments);
					}
				}
				return this;
			}
		};
	}
	function dialogEnter($scope){
		return function(e,ac){
			if(e.keyCode === 13){
				angular.forEach($scope.actions,function(action){
					if(action.title === ac){
						action.fn();
					}
				});
			}
		};
	}

	angular.module('cms.common').factory('baseDialog', ['_', '$q', '$http','$injector','$filter','$interval','$timeout',
		function (_, $q, $http,$injector,$filter,$interval,$timeout) {
			function get(type){
				var selfFun = $injector.get('baseDialog'+type[0].toLocaleUpperCase()+type.slice(1,type.length));
				angular.extend(constructorDialog,selfFun);
				return constructorDialog;

				function constructorDialog(){
					return selfFun.apply({createDialog:createDialog},arguments);
				}
			}
			return {
				'search': get('search'),
				'edit': get('edit'),
				'grid': get('grid'),
				'message': get('message'),
				'advanced': get('advanced'),
				'loading':get('loading'),
				'input':get('input')
			};

			function createDialog(option, entity, addContent) {
				var $scope = $injector.get('$rootScope').$new(true);
				var defer = promise($scope);

				$scope.initField = initField;
				$scope.createCommon = createCommon;
				$scope.isDebug = $injector.get('$global').isDebug;
				$scope.helper = $injector.get('helper');
				$scope.option = option;
				$scope.option['class'] = angular.isObject(option['class'])?option['class']:{icon:option['class']};
				$scope.entity = $scope.helper.truthValue(entity ,{});
				$scope.item = entity;
				$scope.$error = {};
				$scope.blurList = [];
				$scope.$ok = getOk(_,$filter,get('message'),$scope,option,defer);
				$scope.actions = getButtons(_,$scope,$timeout,option);
				$scope.blur = function(){};
				$scope.enter = dialogEnter($scope);

				if(!createDialog.template){
					$http.get('assets/templates/dialog.html?'+window.compileDate).then(function (template) {
						createDialog.template = template.data;
						create(createDialog.template);
					});
				}else{
					create(createDialog.template);
				}
				return defer;
				function create(templateData) {
					var fromElement = angular.element(document.activeElement);
					var dialog = angular.element(templateData).appendTo(angular.element('.main-controller,body').last()).hide();
					$scope.$close = function (ac) {
						$scope.$destroy();
						dialog.fadeOut(500, function () {
							dialog.remove();
							defer.end(ac);
							fromElement.focus();
						});
						return false;
					};
					$scope.auto = function(){
						if(dialog.parent().length){
							defer.auto();
							$scope.$close();
						}
					};
					if (option.template) {
						$scope.option.isLarge = true;
						$http.get(option.template).then(function (cTemplate) {
							dialog.find('.dialog-section').html(cTemplate.data);
							$injector.get('$compile')(dialog)($scope);
							$scope.$on('$destroy', autoRemove($scope, $timeout, $interval, dialog, option.interval));
						});
					} else {
						$scope.readyList = [];
						var content = addContent($scope, dialog.find('.dialog-section'), dialog);
						if ($scope.helper.value(content ,'then')) {
							content.then(function () {
								$injector.get('$compile')(dialog)($scope);
								$scope.$on('$destroy', autoRemove($scope, $timeout, $interval, dialog, option.interval));
							});
						} else {
							$injector.get('$compile')(dialog)($scope);
							$scope.$on('$destroy', autoRemove($scope, $timeout, $interval, dialog, option.interval));
						}
					}
				}
			}
		}]);

})(window.angular);