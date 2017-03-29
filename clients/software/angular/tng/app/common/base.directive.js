(function(angular){
	'use strict';

	function inputReplace(element,$class){
		var parent = angular.element('<div class="sino-directive form-control"></div>');
		element.replaceWith(parent);
		element.appendTo(parent);
		angular.element('<a></a>').addClass($class).appendTo(parent).click(function(){
			element.focus();
		});
		return parent;
	}

	function deleteItem(scope,li,item){
		return function(){
			scope.deleteItem(item).then(function(){
				li.remove();
			});
		};
	}

	function getTextWidth(element,text){
		var widthEl = angular.element('<span></span>').appendTo('body').css({
			position: 'fixed',
			top:-1000,
			fontSize:element.css('fontSize')
		}).html(text);
		var width = widthEl.width();
		widthEl.remove();
		return width;
	}

	function formatterToRegex(formatter){
		return new RegExp(formatter.
		replace('YYYY','[0-9]{4}').
		replace('yyyy','[0-9]{4}').
		replace('YY','[0-9]{2}').
		replace('yy','[0-9]{2}').
		replace('MMM','[Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec]').
		replace('MM','[0-9]{2}').
		replace('DD','[0-9]{2}').
		replace('dd','[0-9]{2}').
		replace('d','[0-9]{2}').
		replace('HH','[0-9]{2}').
		replace('hh','[AM|PM][0-1][0-9]').
		replace('mm','[0-9]{2}').
		replace('ss','[0-9]{2}').
		replace('fff','[0-9]{3}'));
	}

	function getValue(element){
		if(element.find("option:selected").length){
			return element.find("option:selected").text();
		}else{
			return element.children().html() || element.html() || element.val();
		}
	}

	angular.module('cms.common').directive('sinoCountRow',[function() {
		return {
			restrict: 'A',
			link: function (scope, element) {
				Object.defineProperty(scope.filter,'pageSize',{
					get: function(){
						return Math.floor(angular.element('[ui-view="mainContainer"] .content').height() / Math.min(43,element.height() + 1) - 1) || 10;
					}
				});
			}
		};
	}]);

	angular.module('cms.common').directive('pageShowLength',['$timeout',function($timeout) {
		return {
			restrict: 'A',
			link: function (scope, element) {
				angular.element(window).on('resize',resize);
				scope.$on('$destroy',function(){
					angular.element(window).off('resize',resize);
				});

				$timeout(resize);

				function resize(){
					scope.pageShowLength = Math.floor(Math.min(10,(element.parent().width() - (45+70+47+45+48+31*2+10))/36/2));
					scope.$apply();
				}
			}
		};
	}]);

	angular.module('cms.common').directive('sinoTooltip',['$timeout',function($timeout){
		return {
			restrict: 'A',
			link: function (scope, element,attrs) {
				var sinoTooltip = scope.$eval(attrs.sinoTooltip);
				if(sinoTooltip) {
					if(angular.isFunction(sinoTooltip)){
						if (angular.element(sinoTooltip()).length) {
							var tooltip = angular.element('<div class="cms-body out-line">'+sinoTooltip()+'</div>').appendTo(element).css({
								'margin-left':angular.element('body').width()
							});
							element.hover(function(){
								tooltip.css({
									'margin-left':element.position().left + element.width()/2 - tooltip.width()/2
								});
							},function(){
								tooltip.css({
									'margin-left':angular.element('body').width()
								});
							});
						}else{
							element.tooltip({title:sinoTooltip});
						}
					}else{
						$timeout(function(){
							var tooltip = null;
							if(angular.isFunction(sinoTooltip)){
								tooltip = sinoTooltip || tooltip;
								sinoTooltip = true;
							}
							if(/^M/i.test(sinoTooltip)){
								sinoTooltip = sinoTooltip.replace(/^M/i,'');
								element.parent().css('maxWidth',sinoTooltip);
							}
							element.css({width:sinoTooltip,margin: sinoTooltip!==true&&'0'}).tooltip({title: function () {
								var text = tooltip?tooltip() :getValue(element);
								if(getTextWidth(element,text) > element.width()){
									return text;
								}
							}});
						},100);
					}
				}
			}
		};
	}]);

	angular.module('cms.common').directive('sinoInput',[function(){
		return {
			restrict: 'A',
			link: function (scope, element,attrs) {
				var regex = new RegExp(attrs.sinoInput);
				element.on('keydown',function(e){
					if(e.key.length === 1 && !regex.test(e.key)){
						return false;
					}
				});
			}
		};
	}]);

	angular.module('cms.common').directive('sinoCkeditor',['$sce','$timeout','helper',function($sce,$timeout,helper){
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element,attrs) {
				element.attr('id',Date.now() + Math.floor(Math.random()*10000));
				var ck = window.CKEDITOR.replace(element.attr('id'));
				ck.on('blur',function(){
					helper.value(scope,(attrs.ngModel ||attrs.ngBind)+'$content',this.getData());
					helper.value(scope,attrs.ngModel ||attrs.ngBind,helper.value(scope,attrs.ngModel ||attrs.ngBind).replace(/<body[^>]*>([\s\S]*)<\/body>/,'<body>\n'+this.getData()+'</body>'));
					scope.$eval(attrs.ngChange);
				});
				ck.on('instanceReady', function() {
					element.parent().find('.cke_contents iframe').contents().find('.cke_editable').html(/<body[^>]*>([\s\S]*)<\/body>/.exec(helper.value(scope,attrs.ngModel ||attrs.ngBind))[1]);
				});
				$timeout(function(){
					element.parent().find('.cke_contents').css('height',attrs.sinoCkeditor);
				},200);
			}
		};
	}]);

	angular.module('cms.common').directive('sinoSearchSelect',['$compile','$timeout','helper',function($compile,$timeout,helper) {
		return {
			restrict: 'A',
			scope:{
				ngModel:'=',
				sinoSearchSelect:'=',
				deleteItem:'='
			},
			link: function (scope, element) {
				if(helper.truthValue(element.attr('readonly') , element.attr('disabled'))){
					return ;
				}
				var parent = inputReplace(element,'fa fa-sino-select');
				var selection = angular.element([
					'<div class="sino-search-select">',
					'	<div class="search-header sino-directive" >',
					'		<input ng-model="search" placeholder="{{\'search\'| language}}">',
					'	</div>',
					'	<ul class="search-content">',
					'		<li ng-repeat="op in sinoSearchSelect|filter:search" ng-class="{\'active\':$index === selectIndex}" ng-click="selectChange(op.id || op.value || op.code|| $index)">{{op.title||op.name||op| language}}</li>',
					'	</ul>',
					'</div>'
				].join('')
				);

				scope.selectChange = function(value){
					scope.ngModel = value;
				};

				$compile(selection)(scope).appendTo(parent).hide();
				element.attr('tabIndex',0).focus(active).click(active);
				selection.find('input').blur(function(){
					$timeout(function(){
						selection.hide();
					},200);
				});
				parent.keyup(function(e){
					var lis = selection.find('.search-content li');
					scope.selectIndex = Math.min(scope.selectIndex,lis.length-1) || 0;
					switch (e.keyCode) {
						case 38://上
							scope.selectIndex = Math.max(scope.selectIndex-1,0);
							scope.$apply();
							return false;
						case 40://下
							scope.selectIndex = Math.min(scope.selectIndex+1,lis.length-1);
							scope.$apply();
							return false;
						case 13:
						case 32:
							angular.element(lis[scope.selectIndex]).click();
							selection.hide();
							return false;
						default:
							break;
					}
				});

				function active(){
					if(!element.attr('readonly') && !element.attr('disabled')){
						selection.css('max-width',angular.element(window).width() - parent.offset().left - 20).show();
						selection.find('input').focus();
						if(helper.browser === 'IE'){
							selection.css(parent.offset());
						}
					}
				}
			}
		};
	}]);

	angular.module('cms.common').directive('sinoEditSelect',['$compile',function($compile){
		return {
			restrict: 'A',
			replace:true,
			scope: '=',
			template:[
				'<div></div>'
			].join(''),
			link: function ($scope, element,attr) {
				var content = angular.element([
					'	<div class="input"  ng-if="!sinoEditSelectDate"><input sino-tooltip="true" class="form-control" ng-model="ngModel" ngDisabled></div>',
					'	<select sino-tooltip="true" class="form-control" ng-if="!!sinoEditSelectDate" ng-model="ngModel" ng-change="ngChange(entity,rows)" ngDisabled>',
					'		<option ng-repeat="op in sinoEditSelectDate" value="{{op.id || op.value || $index}}">{{op.title||op.name||op| language}}</option>',
					'	</select>'
				].join('').replace(/ngModel/g,attr.ngModel).replace(/ngChange/g,attr.ngChange).replace(/sinoEditSelectDate/g,attr.sinoEditSelect +'.data')
					.replace(/ngDisabled/g,(element.attr('readonly') || element.attr('disabled'))?'disabled':''));

				$compile(content.appendTo(element))($scope);
				element.removeClass('form-control').css('width','100%');
			}
		};
	}]);

	angular.module('cms.common').directive('sinoSelect',['$timeout','helper',function($timeout,helper){
		return {
			restrict: 'A',
			scope:{
				ngModel:'=',
				sinoSelect:'=',
				deleteItem:'='
			},
			link: function (scope, element) {
				var parent = inputReplace(element,'fa fa-sino-select');
				var ul = angular.element('<ul class="sino-select"></ul>').appendTo(parent).hide();

				angular.forEach(scope.sinoSelect,function(op){
					var li = angular.element('<li class="padding-0-1 sino-directive '+getSelectClass(helper.value(op,['value','id']))+'"></li>').appendTo(ul);
					angular.element('<div class="input">'+(helper.value(op,['title','name']))+'</div>').appendTo(li).click(getClick(op));
					if(scope.deleteItem){
						angular.element('<a class="right hover fa fa-close"></a>').appendTo(li).click(deleteItem(scope,li,op));
					}
				});

				element.focus(function(){
					if(!element.attr('readonly') && !element.attr('disabled')){
						angular.element('ul.sino-select').hide();
						ul.show();
					}
				}).blur(function(){
					scope.ngModel = element.val();
					$timeout(function(){
						ul.hide();
					},500);
				});

				function getSelectClass(value){
					return value === scope.ngModel?'active':'';
				}

				function getClick(value){
					return function(){
						scope.ngModel =  value.value ||value.id || value;
						scope.$apply();
						ul.hide();
						ul.find('.active').removeClass('active');
						angular.element(this).addClass('active');
					};
				}
			}
		};
	}]);

	angular.module('cms.common').directive('sinoTemplate',['$timeout','helper',function($timeout){
		return {
			restrict: 'A',
			replace:true,
			scope: {
				ngModel: '=',
				sinoTemplate: '='
			},
			link:function(scope, element) {
				element.append('<iframe width="100%" height="100%" frameborder="0" scrolling="no"></iframe>');
				$timeout(function () {
					var content = angular.element(scope.sinoTemplate).appendTo(angular.element(element.contents().last().get(0).contentDocument.body).css('margin',0));
					element.find('iframe').css({height:content.height(),width:content.width()});
					element.contents().last().get(0).contentDocument.body.onclick = function(){
						element.click();
					};
				}, 200);
			}
		};
	}]);

	angular.module('cms.common').directive('sinoSelectTemplate',['_','baseDialog',function(_,baseDialog){
		return {
			restrict: 'A',
			replace:true,
			template:[
				'<div tabindex="0">',
				'	<div>{{label(list,ngModel)}}</div>',
				'	<div sino-template="content(list,ngModel)"  ng-click="show()"></div>',
				'</div>'
			].join(''),
			scope: {
				ngModel: '=',
				sinoSelectTemplate: '='
			},
			link: function (scope,element) {
				angular.extend(scope,scope.sinoSelectTemplate);
				element.removeClass('form-control');
				scope.show = function(){
					baseDialog.message(null,'selectTemplate',[
						'<div class="inline-block padding-1-1" ng-repeat="st in entity.list" ng-class="{\'sino-validate-outline-green\':entity.select === st.id}" tabindex="0">',
						'	<div>{{entity.label(list,st.id)}}</div>',
						'	<div sino-template="entity.content(list,st.id)" ng-click="entity.select = st.id"></div>',
						'</div>'
					].join(''),angular.extend({
						select:scope.ngModel
					},scope.sinoSelectTemplate)).then(function(entity){
						scope.ngModel = entity.select;
					});
				};
			}
		};
	}]);

	angular.module('cms.common').directive('sinoCheckbox',[function(){
		return {
			restrict: 'A',
			replace:true,
			scope:{
				ngModel:'=',
				sinoCheckbox:'='
			},
			template:'<div><div class="sino-checkbox" ng-class="{\'background-green\':ngModel}" ng-click="ngModel=!ngModel;"><a ng-show="!ngModel" style="float: left"></a><a ng-show="ngModel" style="float: right"></a></div></div>',
			link: function (scope, element) {
				scope.ngModel = (''+scope.ngModel) === 'true';
				element.removeClass('form-control');
				element.parent().addClass('inline-table');
			}
		};
	}]);

	angular.module('cms.common').directive('sinoMultiple',['_',function(_){
		return {
			restrict: 'A',
			replace:true,
			scope:{
				ngModel:'=',
				sinoMultiple:'='
			},
			template:'<div><div  tabindex="0" ng-repeat="op in listOption" ng-click="ngChange(op.$key)" class="sino-signChar fa {{getClass(op.$key)}}"><div sino-tooltip="tooltip(op)">{{op.name||op}}</div></div></div>',
			link: function (scope, element) {
				scope.listOption = _.map(scope.sinoMultiple,function(i,k){
					i.$key = k;
					return i;
				}).sort(function(a,b){return a.sort - b.sort;});
				scope.ngModel = (scope.ngModel || '') + '';
				scope.getClass = function(v){
					return scope.ngModel.split(',').indexOf(v)!==-1?'fa-check-square-o':'fa-square-o';
				};
				scope.ngChange = function(v){
					if(scope.ngModel.split(',').indexOf(v)!==-1){
						scope.ngModel = _.filter(scope.ngModel.split(','),function(i){return i !== v+'';}).join();
					}else{
						scope.ngModel = (scope.ngModel&&scope.ngModel.split(',')||[]).concat([v]).sort().join();
					}
				};
				scope.tooltip = tooltip;
				element.removeClass('form-control');
				function tooltip(op){
					return function(){
						return op.description;
					};
				}
			}
		};
	}]);

	angular.module('cms.common').directive('sinoDatepicker',['_','$filter','$global','helper',function(_,$filter,$global,helper){
		return {
			restrict: 'A',
			link: function (scope, element,attrs) {
				var formatter = (attrs.sinoDatepicker || 'yyyyMMdd').replace('MM','mm');
				var range = _.map((attrs.range||'-1000000:0').split(':'),function(i){
					return new Date(Date.now() + (parseInt(i) || 0) * 60 * 60 * 24 * 1000);
				});
				if(angular.isObject(helper.value(scope,attrs.ngModel))){
					helper.value(scope,attrs.ngModel,'');
				}
				inputReplace(element,'fa fa-calculator');
				element.datepicker({
					format: formatter,
					startDate: range[0],
					endDate: range[1],
					weekStart: 1,
					autoclose: true
				}).datepicker('setDate', helper.value(scope,attrs.ngModel)).change(function(){
					if(!element.val() || formatterToRegex(formatter).test(element.val())){
						helper.value(scope,attrs.ngModel,element.val());
						scope.$eval(attrs.ngChange);
					}
				});
			}
		};
	}]);

	angular.module('cms.common').directive('sinoUpload',['_','helper',function(_,helper){
		function dropFile(element,parent,changeValue,type){
			element.on('dragover',dragover);
			element.on('dragleave', clearClass);
			element.on('drop',drop);

			function dragover(evt){
				evt.stopPropagation();
				evt.preventDefault();
				clearClass();
				parent.addClass(_.some(evt.originalEvent.dataTransfer.items,function(i){return i.type === type;})?'sino-validate-border-green':'sino-validate-border-red');
			}

			function drop(evt){
				var files = _.filter(evt.originalEvent.dataTransfer.files,function(i){return i.type === type;});
				evt.stopPropagation();
				evt.preventDefault();
				clearClass();
				if(files.length){
					changeValue.apply({files:files});
				}
			}

			function clearClass(){
				parent.removeClass('sino-validate-border-red');
				parent.removeClass('sino-validate-border-green');
			}
		}
		return {
			restrict: 'A',
			link: function (scope, element,attrs) {
				var change = scope.$eval(attrs.ngChange) || helper.value;
				var parent = inputReplace(element,'fa fa-upload');
				dropFile(element,parent,changeValue,attrs.sinoUpload);
				helper.value(scope,attrs.ngModel+'s', helper.value(scope,attrs.ngModel+'s')||[]);
				element.focus(function(){
					angular.element('<input type="file" accept="'+attrs.sinoUpload+'">').change(changeValue).click();
				});
				/* jshint -W040*/
				function changeValue(){
					helper.value(scope,attrs.ngModel, _.map(this.files,function(i){return i.name;}).join());
					if(!angular.isFunction(change)){
						switch (change){
							case 'unshift':
								[].unshift.apply(helper.value(scope,attrs.ngModel+'s'),this.files);
								break;
							case 'push':
								[].push.apply(helper.value(scope,attrs.ngModel+'s'),this.files);
								break;
							default:
								helper.value(scope,attrs.ngModel+'s', this.files);
								break;
						}
					}else{
						change(scope,helper.value(scope,attrs.ngModel+'s'),this.files);
					}

					scope.$eval(attrs.ngChange);
					scope.$apply();
				}
			}
		};
	}]);

	angular.module('cms.common').directive('sinoSplitter',['$timeout','$global',function($timeout,$global) {
		return {
			restrict: "AE",
			scope: {},
			link: function ($scope, element, attr) {
				if($global.isDebug){
					$timeout(function(){
						if(attr.sinoSplitter){
							element.css({width:element.next().width(),height:'5px',top:element.prev().height()-2.5});
							drag(element,false);
						}else{
							element.css({height:element.next().height(),width:'5px',left:element.prev().width()-2.5});
							drag(element,true);
						}
					});
				}else{
					element.remove();
				}
			}
		};


		function drag(element,ishorizontal){
			var eTemp = null;
			element.css({position: 'absolute',zIndex: 999,cursor: 'pointer'});
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


	angular.module('cms.common').directive('sinoTextarea',[function(){
		return function(scope,element){
			element.on('keydown',function(e){
				if(e.keyCode === 9){
					e.preventDefault();
					var indent = '    ';
					var start = this.selectionStart;
					var end = this.selectionEnd;
					var selected = window.getSelection().toString();
					selected = indent + selected.replace(/\n/g,'\n'+indent);
					this.value = this.value.substring(0,start) + selected + this.value.substring(end);
					this.setSelectionRange(start+indent.length,start+selected.length);
				}
			});
		};
	}]);


	function getNgModelString(column,$columnStr){
		var disable = (!column.editor || column.disable) && 'readonly';
		if(angular.isFunction(column.disable)){
			disable = 'ng-disabled="'+$columnStr+'.disable(it,'+$columnStr+')"';
		}
		return [
			' class="form-control" ng-model="it[' + $columnStr + '.field]" ' +(column.length?('maxlength="'+column.length+'" '):''),
			 'ng-class="{\'sino-validate-border-red\':' + $columnStr + '.validate(it,$parent.$parent.$error,$index)&&$parent.$parent.showError}"',
			'title="{{$parent.$parent.$error[\'' + column.title + '\'].message|translator:$parent.$parent.$error[\'' + column.title + '\'].parameters}}"',
			disable + ' sino-use-id '
		].join(' ');
	}
	function createValue(_,helper,$scope,column,$columnStr){
		switch (Object.prototype.toString.apply(column.editor)) {
			case '[object Function]':
				return column.editor($scope,column,$columnStr);
			case '[object Array]':
				if(!column.editor || column.disable){
					var ngModel = $scope.$eval('it[' + $columnStr + '.field]');
					var item = _.find(column.editor,function(op,$index){
						return (''+ngModel) === (helper.truthValue(helper.value(op,['id','value','code']), $index) +'');
					});
					return '<div class="form-control" sino-tooltip="\'100%\'" disabled>{{\'' +(helper.value(item,['title','name'])||item||'') +'\'|language}}</div>';
				}else{
					return '<select ' + getNgModelString(column,$columnStr) + ' ng-change="'+ $columnStr + '.change(entity)"><option ng-repeat="op in ' + $columnStr + '.editor" value="{{op.id || op.value || $index}}">{{op.title||op.name||op| language}}</option></select>';
				}
				break;
			case '[object Object]':
				return '<input sino-multiple="' + $columnStr + '.editor" ' + getNgModelString(column,$columnStr) + '>';
			case '[object Number]':
				return '<textarea rows="' + column.editor + '" ' + getNgModelString(column,$columnStr) + '></textarea>';
			default:
				if(column.field){
					return '<input sino-tooltip="\'100%\'" ' + getNgModelString(column,$columnStr) + ' ng-change="'+ $columnStr + '.change" ' + (/^sino-/.test(column.editor) ? (column.editor + '="'+$columnStr+'.mime"') : ('type="' + column.editor + '"'))+ '>';
				}else{
					return column.content || '<div></div>';
				}
		}
	}
	function getRunRowValidate(validateService,rowValidate,row){
		return function (){
			if(angular.isFunction(rowValidate)){
				rowValidate.apply(row,arguments);
			}else if(angular.isNumber(rowValidate)){
				validateService.length(rowValidate).apply(row,arguments);
			}else if(angular.isString(rowValidate)){
				var splitStrings = rowValidate.split(/[\(\)]/);
				validateService[splitStrings[0]].apply(validateService,splitStrings[1] && splitStrings[1].split(',') || []).apply(row,arguments);
			}
		};
	}
	function defaultValidate($scope,row,_,helper,validateService,rowValidate) {
		if (row.required) {
			return function (entity, $error,$extend) {
				var title = helper.validateFiled(row.title,$extend);
				var value = helper.value(entity, row.field);
				var isRequired = helper.truthValue((angular.isArray(row.field) && !_.some(row.field,function(i,index){return helper.value(entity[index], row.field[index].replace('['+index+']',''));})) , !value , !(''+value).trim());
				if((angular.isFunction(row.hide) && row.hide(entity, row)) ||(!isRequired && !rowValidate)){
					delete $error[title];
				}else if (isRequired) {
					var editorTitle = {url:'regexUrl',email:'regexEmail',file:'regexFile'}[row.editor];
					$error[title] = {message:'errorMessageIsRequired'+(editorTitle?('-'+editorTitle):'')};
				} else if(rowValidate) {
					getRunRowValidate(validateService,rowValidate,row).apply(null,arguments);
				}
				angular.forEach($scope.blurList,function(i){i(row);});
				return !! $error[title];
			};
		}else{
			return function(entity, $error,$extend){
				var title = helper.validateFiled(row.title,$extend);
				if(angular.isFunction(row.hide) && row.hide(entity, row)){
					delete $error[title];
				}else if(rowValidate){
					getRunRowValidate(validateService,rowValidate,row).apply(null,arguments);
				}
				angular.forEach($scope.blurList,function(i){i(row);});
				return !! $error[title];
			};
		}
	}

	angular.module('cms.common').directive('sinoTable',['_','$compile','helper','validationService',function(_,$compile,helper,validateService){
		var pageSize = 50;
		return {
			restrict: "AE",
			scope: {
				event:'=',
				ngModel:'=',
				sinoTable:'='
			},
			link: function ($scope, element) {
				var tagName = element.prop('tagName').toLocaleLowerCase();
				var tableParent = angular.element(element.context.outerHTML.toLocaleLowerCase().replace('<' + tagName, '<div').replace('</' + tagName + '>', '') + '</div>');
				element.replaceWith(tableParent);

				var table = angular.element([
					'<table>',
					'	<thead>',
					'		<tr><th width="5%">{{\'number\'|language}}</th>',
					_.map($scope.sinoTable,function(column,index){
						if(column.hide){
							return '';
						}
						return '<th width="{{sinoTable['+index+'].width}}">{{sinoTable['+index+'].title| language}}</th>';
					}).join(''),
					'		</tr>',
					'	</thead>',
					'	<tbody>',
					'		<tr ng-repeat="it in list()"><td style="width: 1%;">{{$index+'+pageSize+'*pageNo-'+(pageSize-1)+'}}</td>',
					_.map($scope.sinoTable,function(column,index){
						if(column.hide){
							return '';
						}
						column.validate = defaultValidate($scope,column,_,helper,validateService,column.validate);
						return '<td>'+createValue(_,helper,$scope,column,'sinoTable['+index+']')+'</td>';
					}).join(''),
					'		</tr>',
					'	</tbody>',
					'</table>',
					'<div class="text-center">',
					'	<ul class="pagination-sm pagination pointer" ng-if="totalPages>1"  page-show-length="10" sino-use-id="pagination">',
					'		<li ng-class="{disabled: pageNo === 1}"><a ng-click="pageNo > 1 && goPage(1)" sino-use-id="\'sinoTable-firstPage\'">{{\'firstPage\'| language}}</a></li>',
					'		<li ng-class="{disabled: pageNo === 1}"><a ng-click="pageNo > 1 && goPage(pageNo -1)" sino-use-id="\'sinoTable-previousPage\'">{{\'previousPage\'| language}}</a></li>',
					'		<li ng-class="{active: pageNo === page }" ng-repeat="page in totalPages|toArray:pageShowLength"><a ng-click="pageNo!=page && goPage(page)" sino-use-id="\'sinoTable-page-\'+page">{{page}}</a></li>',
					'		<li ng-class="{disabled: pageNo === 1}"  ng-if="totalPages>pageShowLength*2"><a>...</a></li>',
					'		<li ng-if="totalPages>pageShowLength*2"><input title="" sino-input="[0-9]" ng-model="pageNo" ng-keyup="$event.keyCode === 13 && goPage(pageNo)" sino-use-id></li>',
					'		<li ng-class="{disabled: pageNo === 1}"  ng-if="totalPages>pageShowLength*2"><a>...</a></li>',
					'		<li ng-class="{active: pageNo === page }" ng-repeat="page in totalPages|toArray:-pageShowLength"><a ng-click="pageNo!=page && goPage(page)" sino-use-id="\'sinoTable-page-\'+page">{{page}}</a></li>',
					'		<li ng-class="{disabled: pageNo === totalPages}"><a ng-click="pageNo < totalPages && goPage(pageNo +1)" sino-use-id="\'sinoTable-nextPage\'">{{\'nextPage\'| language}}</a></li>',
					'		<li ng-class="{disabled: pageNo === totalPages}"><a ng-click="pageNo < totalPages && goPage(totalPages)" sino-use-id="\'sinoTable-lastPage\'">{{\'lastPage\'| language}}</a></li>',
					'	</ul>',
					'</div>'
				].join(''));

				$scope.list = function(){
					return $scope.ngModel && $scope.ngModel.slice($scope.pageNo * pageSize-pageSize,$scope.pageNo * pageSize);
				};

				$scope.goPage = function(pageNo){
					while(pageNo < 0){
						pageNo = pageNo + 1 + $scope.totalPages;
					}
					$scope.pageNo = pageNo;
				};
				$scope.goPage(1);
				$compile(table)($scope);
				$scope.$on('$destroy',$scope.$watch('ngModel.length', function(){
					$scope.totalPages = Math.floor($scope.ngModel.length / pageSize + 0.99);
					$scope.goPage($scope.pageNo);
				}));
				table.appendTo(tableParent.removeClass('form-control'));
				if($scope.event){
					$scope.event.register('goto',$scope.goPage);
					$scope.event.register('remove',removeError);
				}

				function removeError($error){
					angular.forEach($error,function(v,k){
						if(_.some($scope.sinoTable,function(column){
								return helper.validateFiled(k) === column.title;
							})){
							delete $error[k];
						}
					});
				}
			}
		};
	}]);

	angular.module('cms.common').directive('sinoAutograph',['$timeout',function($timeout){

		return {
			restrict: "AE",
			scope: {
				ngModel:'=',
				sinoMultiple:'='
			},
			link: function ($scope, element, attrs) {
				var tagName = element.prop('tagName').toLocaleLowerCase();
				var canvas = angular.element(element.context.outerHTML.toLocaleLowerCase().replace('<'+tagName,'<canvas').replace('</'+tagName+'>','')+'</canvas>').get(0);
				var context = canvas.getContext("2d");

				element.replaceWith(canvas);

				$timeout(function(){
					canvas.width = canvas.parentNode.offsetWidth;
					context.strokeStyle = attrs.sinoMultiple || '#F6885D';
					context.lineWidth = 1;
					context.lineCap = 'square';

					if(!element.attr('readonly') && !element.attr('disabled')){
						canvas.addEventListener("mousedown", function(e){
							context.beginPath();
							context.moveTo(e.offsetX, e.offsetY);
							canvas.addEventListener("mousemove",mousemove);
						});
						canvas.addEventListener("mouseup", over);
						canvas.addEventListener("mouseleave",over);
					}


					context.drawImage($scope.ngModel);

				},500);

				function over(){
					context.closePath();
					canvas.removeEventListener("mousemove",mousemove);
					$scope.ngModel = canvas.toDataURL();
				}

				function mousemove(e){
					context.lineTo(e.offsetX, e.offsetY);
					context.stroke();
				}
			}
		};
	}]);

})(window.angular);