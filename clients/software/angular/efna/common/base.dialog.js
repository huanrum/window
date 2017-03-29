(function (angular,_) {
	'use strict';

	function getValue(obj,field,value){
		var fields = field.trim().split('.');
		while(fields.length > 1){
			if(!fields[0].trim()){
				fields.shift();
			}else{
				var tempField = fields.shift();
				obj[tempField] = obj[tempField] || {};
				obj = obj[tempField];
			}
		}
		if(value){
			obj[fields.shift()] = value;
		}else{
			return obj[fields.shift()];
		}
	}

	function initField(field){
		if(angular.isArray(field)){
			return field.join('-');
		}else{
			return field[0] === '['?field:('.'+field);
		}
	}

	function createOptions(items){
		return _.map(items,function(op,key) {
			return '<option value="' + key + '">' + op + '</option>';
		}).join('');
	}

	function createRowValue($scope,editor,key, index){
		var newField = initField(key);
		var ngModelString = ' class="form-control" ng-model="entity' + newField + '" ng-keyup="$event.keyCode === 13 && tabTo(' + index + ')" @deleteItem@ sino-use-id';

		if(editor.deleteItem){
			getValue($scope,'deleteFns'+newField,editor.deleteItem);
			ngModelString = ngModelString.replace('@deleteItem@','delete-item="'+'deleteFns'+newField+'"');
		}else{
			ngModelString = ngModelString.replace('@deleteItem@','');
		}

		switch (Object.prototype.toString.apply(editor)){
			case '[object String]':
				return '<input type="'+editor+'" '+editor + ngModelString+' >';
			case '[object Array]':
				getValue($scope,'lookup'+newField,editor);
				getValue($scope,'entity'+newField,getValue($scope,'entity'+newField) || editor[0].value || editor[0].id || editor[0]);
				return '<input '+ngModelString+' sino-select="lookup'+newField+'">';
			case '[object Object]':
				return '<select '+ngModelString+'>'+ createOptions(editor)+'</select>';
			default:
				break;
		}
	}

	function createCommon(bodyElement, row) {
		return angular.element([
				'<div class="row">',
				'   <div class="sino-title inline-table">' + (row.required ? '*' : '') + ' {{\'' + row.title + '\'| language}} '+(row.titleExtend || '')+'</div>',
				((!row.field || !row.tooltip) ? '' : '<a ng-if="!showError" class="helper-icon fa fa fa-question-circle" title="{{\'' + row.tooltip + '\'|language}}"></a>'),
				(!row.field ? '' : '<a ng-if="showError && $error.' + row.title + '" class="error-icon fa fa-exclamation-circle" title="{{$error.' + row.title + '}}"></a>'),
				'   <div class="sino-value"></div>',
				'</div>'
			].join('')
		).appendTo(bodyElement).find('.sino-value');
	}

	function getNgModelString(field){
		return ' class="form-control" ng-model="entity' + initField(field) + '" sino-use-id ';
	}
	function getNgChangeString(row,$rowStr){
		return  ' ng-change="'+ $rowStr + '.change"' + (!row.editor && 'disabled') + ' ng-class="{\'sino-validate\':' + $rowStr + '.validate(entity,$error)&&showError}" placeholder="{{\'' + (row.editorInfo||'') + '\'|language}}" title="{{\'' + (row.tooltip||'') + '\'|language}}" ';
	}

	function createValueEditor($scope,row,$rowStr){
		if(angular.isArray(row.field)){
			return row.field.map(function (field) {
				return [
					'<div class="some-field col-md-' + (Math.floor(12 / row.field.length)) + '">',
					'	<input '+getNgModelString(field) + (row.editor && (row.editor + '=' + $rowStr + '.change') || '') + getNgChangeString(row,$rowStr)+'>',
					'</div>'
				].join('');
			});
		}else {
			switch (Object.prototype.toString.apply(row.editor)) {
				case '[object Function]':
					return row.editor($scope);
				case '[object Array]':
					return '<select ' + getNgModelString(row.field) + '><option ng-repeat="op in ' + $rowStr + '.editor" value="{{op.id}}">{{op.title| language}}</option></select>';
				case '[object Object]':
					return '<input sino-multiple="' + $rowStr + '.editor" ' + getNgModelString(row.field) + '>';
				default:
					return '<input ' + getNgModelString(row.field) + getNgChangeString(row, $rowStr) + (/^sino-/.test(row.editor) ? (row.editor + '="' + row.mime + '"') : ('type="' + row.editor + '"'))+ '>';
			}
		}
	}

	function createRows($scope, rows, rowStr,parentEl,_,$filter) {
		if (angular.isArray(rows)) {
			angular.forEach(rows, function (row, index) {
				createRow($scope, parentEl,row, rowStr + '[' + index + ']',_,$filter);
			});
		} else {
			createRow($scope, parentEl,rows, rowStr,_,$filter);
		}
	}
	function createRow($scope, parentEl,row, $rowStr,_,$filter) {
		row.editorInfo = row.editorInfo || '';
		row.tooltip = row.tooltip || '';
		row.validate = row.validate || defaultValidate(row,_,$filter);
		createCommon(parentEl, row).html(createValueEditor($scope,row,$rowStr));
	}

	function defaultValidate(row,_,$filter) {
		if (row.required) {
			return function (entity, $error) {
				var value = getValue(entity, row.field);
				var isRequired = (angular.isArray(row.field) && !_.some(row.field,function(i,index){return getValue(entity[index], row.field[index].replace('['+index+']',''));})) || !value || !(''+value).trim();
				if (isRequired) {
					$error[row.title] = $filter('language')('errorMessageIsRequired') + inputTypeMessage(row.editor,$filter('language'));
				} else {
					delete $error[row.title];
				}
			};
		}
	}

	function inputTypeMessage(type,language){
		switch (type){
			case 'url':
				return language('regexUrl');
			case 'email':
				return language('regexEmail');
			case 'file':
				return language('regexFile');
			default :
				return '';
		}
	}

	function drag(dialogParent) {
		var temp = {}, dialog = dialogParent.find('.cms-body'),dragEls = dialog.find('.dialog-header,.dialog-footer');
		dragEls.on('mousedown', function (e) {
			temp.e = e;
			temp.x = e.clientX - (parseInt(dialog.css('left')) || 0);
			temp.y = e.clientY - (parseInt(dialog.css('top')) || 0);
			dragEls.css('cursor', 'move');
			dialogParent.on('mousemove', mousemove);
		});
		dialogParent.on('mouseup', function () {
			dragEls.css('cursor', 'default');
			dialogParent.off('mousemove', mousemove);
		});

		function mousemove(e) {
			dialog.css({left: e.clientX - temp.x, top: e.clientY - temp.y});
		}
	}

	function getButtons(_,$scope,$timeout,option){
		var types = option.type&&option.type.split('/')||[];
		var okTitle =  {
			new: 'add',
			edit: 'update',
			save: 'save',
			search: 'search',
			confirm: 'confirm',
			yes:'yes'
		};
		var buttons = {
			ok: {
				title: okTitle[types[0]] || 'ok',
				class: 'btn-success',
				fn: function(){return $timeout($scope.$ok,500);}
			}, cancel: {
				title: types[1] || 'cancel',
				class: 'btn-default',
				fn: function(){return $scope.$close();}
			}
		};

		return _.map(_.filter(option.actions,function(i){return !!i;}) ,function (action) {
			return buttons[action];
		});
	}

	function getOk(_,$filter,message,$scope,option,defer){
		return function() {
			$scope.showError = true;
			if (Object.getOwnPropertyNames($scope.$error).length) {
				message(2, 'validateError', '<ul class="inline-table list-style-none">' + _.map($scope.$error, function (val, key) {
						return '<li class="text-left"><i class="fa fa-asterisk">&nbsp;' + $filter('language')(key) + ($filter('language')(key)?' : ':'') + val + '</i></li>';
					}).join('') + '</ul>', {$error: $scope.$error},'',2000);
			} else {
				if (option.collectEntity) {
					var entity = option.collectEntity($scope.entity);
					if(entity.then){
						entity.then(function(data){
							defer.resolve(data);
						});
					}else{
						defer.resolve(entity);
					}
				} else {
					defer.resolve($scope.entity);
				}
				$scope.$close();
			}
		};
	}
	function autoRemove($timeout,$interval,dialog, interval) {
		var times = interval / 100, stop = false;
		dialog.fadeIn(500);
		if (angular.isNumber(interval)) {
			$timeout(function () {
				var int = $interval(function () {
					if (!stop) {
						times = times - 1;
					}
					dialog.css('opacity', times * 100 / interval);
					if (times < 0) {
						dialog.remove();
						$interval.cancel(int);
					}
				}, 100);
			}, 3000);
			dialog.find('.cms-body').hover(function () {
				stop = !stop;
			});
		}
	}

	angular.module('cms.common').factory('baseDialog', ['_', '$q', '$http','$injector','$filter','$interval','$timeout',
		function (_, $q, $http,$injector,$filter,$interval,$timeout) {

			function get(type){
				return function(){
					return $injector.get('baseDialog'+type[0].toLocaleUpperCase()+type.slice(1,type.length)).apply({createDialog:createDialog},arguments);
				};
			}

			return {
				search: get('search'),
				edit: get('edit'),
				grid: get('grid'),
				message: get('message'),
				advanced: get('advanced'),
				loading:get('loading'),
				animation:get('animation'),
				input:get('input')
			};

			function createDialog(option, entity, addContent) {
				var defer = $q.defer();
				var $scope = $injector.get('$rootScope').$new(true);
				$scope.option = option;
				$scope.entity = entity || {};
				$scope.item = entity;

				$scope.$error = {};
				$scope.$ok = getOk(_,$filter,get('message'),$scope,option,defer);
				$scope.actions = getButtons(_,$scope,$timeout,option);


				$http.get('templates/dialog.html').then(function (template) {
					var dialog = angular.element(template.data).appendTo('body').hide();
					drag(dialog);
					$scope.$close = function () {
						dialog.fadeOut(500,function(){
							dialog.remove();
						});
					};
					if (option.template) {
						$scope.option.isLarge = true;
						$http.get('templates/modules.dialog/' + option.template).then(function (cTemplate) {
							dialog.find('.dialog-section').html(cTemplate.data);
							$injector.get('$compile')(dialog)($scope);
							autoRemove($timeout,$interval,dialog, option.interval);
						});
					} else {
						addContent($scope, dialog.find('.dialog-section'),dialog);
						$injector.get('$compile')(dialog)($scope);
						autoRemove($timeout,$interval,dialog, option.interval);
					}
				});
				return defer.promise;
			}

		}]);


	angular.module('cms.common').factory('baseDialogMessage', [function (){
		return function(level, title, message, item, isConfirm, interval) {
			var icons = ['fa-comment', 'fa-exclamation-circle', 'fa-exclamation-triangle', 'fa-trash-o'];
			var iconsExtend = [' ', ' ', ' ', ' error-icon '];
			isConfirm = isConfirm || '';
			return this.createDialog({
				title: title || ' -- ',
				class: 'fa ' + (angular.isString(level)?level :icons[level] || ''),
				actions: [isConfirm && 'ok', isConfirm.split('/').length>1 && 'cancel'],
				type: angular.isString(isConfirm) ? isConfirm : '',
				interval: interval
			}, item, function ($scope, bodyElement) {
				if(icons[level]){
					bodyElement.css('width', 480);
					bodyElement.append('<div class="fa huge3-icon ' + (icons[level] || '') + (iconsExtend[level] || '') + '"></div>');
				}
				bodyElement.addClass('text-center');
				if(angular.isString(message)){
					bodyElement.append(''+message+'');
				}
				if(angular.isFunction(message)){
					message(bodyElement);
				}

			});
		};
	}]);

	angular.module('cms.common').factory('baseDialogAnimation', ['$timeout',function ($timeout){
		return function(message,animationName,interval){
			var dialog = angular.element('<div class="cms-body"></div>');
			angular.element('body>.cms-body').remove();
			dialog.appendTo('body').html(message).css({
				fontSize:'2em',
				animation: animationName + ' ' + Math.floor(interval / 1000) + 's'
			});
			$timeout(function(){
				dialog.remove();
			},interval);
		};
	}]);

	angular.module('cms.common').factory('baseDialogLoading', ['_','$timeout',function (_,$timeout){
		var loading = {};
		return function(config, result) {
			if (!loading.$scope) {
				loading.$scope = {};
				this.createDialog({
					title: 'loading...',
					actions: []
				}, {}, function ($scope, modalBody, dialog) {
					loading.$scope = $scope;
					$scope.dataList = [];
					$scope.removeItem = function (item, interval) {
						$timeout(function () {
							$scope.dataList = _.filter($scope.dataList, function (i) {
								return i !== item;
							});
						}, interval || 0);
					};
					$scope.$close = function () {
						loading.$scope.dataList = [];
						loading.$scope.toggle(true);
					};
					dialog.attr('ng-show', '!!dataList.length').css('z-index', 9999);
					modalBody.html('<a class="fa fa-check color-green"></a>');
				});
			}


			if (/\/onepass\//.test(config.url)) {
				if (!result) {
					loading.$scope.dataList.push({
						config: config,
						class: 'fa-spinner fa-pulse'
					});
				} else {
					var item = _.find(loading.$scope.dataList, function (i) {
							return i.config === config;
						}) || {};
					if (result.succeed) {
						item.class = 'fa-check color-green';
						loading.$scope.removeItem(item, 1000);
					} else {
						item.class = 'fa-remove color-red';
						item.message = result.message;
					}
				}
			}
		};
	}]);

	angular.module('cms.common').factory('baseDialogAdvanced', [function (){
		return function(item,getEditor) {
			return this.createDialog({
				title: 'editObject',
				class: 'fa fa-edit',
				type: 'edit',
				actions: ['cancel', 'ok']
			}, item, addContent);

			function addContent($scope, bodyElement){
				bodyElement.css('width', 600);
				angular.forEach(Object.getOwnPropertyNames(item), function (key, index) {
					var editor = getEditor?getEditor(key):'text';
					if (editor) {
						createCommon(bodyElement, {title: key}).html(function () {
							return createRowValue($scope,editor,key, index);
						});
					}
				});

				$scope.tabTo = function (index) {
					if (index < bodyElement.children().length - 1) {
						angular.element(bodyElement.children().get(index + 1)).find('input').focus();
					} else {
						$scope.$ok();
					}
				};
			}
		};
	}]);

	angular.module('cms.common').factory('baseDialogSearch', [function () {
			return function(title, options) {
				return this.createDialog({
					title: title,
					class: 'glyphicon glyphicon-search',
					type: 'search',
					actions: ['cancel', 'ok']
				}, {}, function ($scope, bodyElement) {
					bodyElement.css('width', 480);
					angular.forEach(angular.isFunction(options.rows)?options.rows({}):options.rows, function (row) {
						createCommon(bodyElement, row).html(function () {
							return '<input class="form-control" ng-model="entity' + initField(row.field) + '" sino-use-id>';
						});
					});
				});
			};
		}]);

	angular.module('cms.common').factory('baseDialogEdit', ['_','$filter',function (_,$filter) {
		return function(title, options, item, type) {
			return this.createDialog({
				title: title,
				class: 'fa fa-edit',
				type: type || 'edit',
				actions: type ? ['ok'] : ['ok', 'cancel'],
				collectEntity:options.collectEntity
			}, item, addContent);

			function addContent($scope, bodyElement){
				$scope.rows = angular.isFunction(options.rows)?options.rows(item):options.rows;
				bodyElement.css('width', 520);
				if (angular.isArray($scope.rows)) {
					createRows($scope, $scope.rows, 'rows',bodyElement,_,$filter);
				} else if (angular.isObject($scope.rows)) {
					var arrayRows = _.filter($scope.rows, function (i) {return angular.isArray(i);}), width = 'style="width:' + (99 / arrayRows.length).toFixed(2) + '%;"';
					angular.forEach($scope.rows, function (rows, key) {
						createRows($scope, rows, 'rows.' + key,angular.isArray(rows)?angular.element('<div class="inline-table" ' + width + '></div>').appendTo(bodyElement):bodyElement,_,$filter);
					});
				}
			}
		};

	}]);

	angular.module('cms.common').factory('baseDialogInput', ['$timeout',function ($timeout) {
		return function(type,item,size,isReadonly) {
			size = size || {width:480};
			return this.createDialog({
				title: 'Input Dialog',
				class: 'fa fa-edit',
				actions: isReadonly ? ['ok'] : ['ok', 'cancel']
			}, item, addContent);

			function addContent($scope, bodyElement){
				var style = 'style="width: 100%;height:'+size.height +'px"';
				bodyElement.css('width', size.width || 480);
				if(typeof type === 'string'){
					if(type === 'textarea'){
						bodyElement.html('<textarea sino-textarea ng-model="entity" '+style+'></textarea>');
					}else{
						bodyElement.html('<input type="'+type+'" '+type+' ng-model="entity" '+style+'>');
					}
				}else if(typeof type === 'function'){
					type($scope, bodyElement);
				}
				$timeout(function(){
					bodyElement.find('input,textarea,select').focus();
				},500);
			}
		};

	}]);

	angular.module('cms.common').factory('baseDialogGrid', [function () {
		return function(title,columns,items) {
			return this.createDialog({
				title: title,
				class: 'fa fa-columns',
				actions: ['cancel','ok']
			}, items, addContent);

			function addContent($scope, bodyElement){
				bodyElement.html([
					'<table>',
					'	<thead>',
					'		<tr>',
					columns.map(function(column){
						return '<th>{{\''+column.split('-').shift()+'\' | language}}</th>';
					}).join(''),
					'		</tr>',
					'	</thead>',
					'	<tbody>',
					'		<tr ng-repeat="it in item">',
					columns.map(function(column){
						var cols = column.split('-');
						if(cols.length > 1){
							if(/^t\$/.test(cols[1])){
								return '<td>{{it.'+cols.shift()+'| '+cols.pop().slice(2)+'}}</td>';
							}else{
								return '<td><input ng-model="it.'+cols.shift()+'" type="'+cols.pop()+'"></td>';
							}
						}else{
							return '<td>{{it.'+cols.shift()+'}}</td>';
						}
					}).join(''),
					'		</tr>',
					'	</tbody>',
					'</table>'
				].join(''));
			}
		};

	}]);


})(window.angular,window._);