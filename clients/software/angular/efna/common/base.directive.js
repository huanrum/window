(function(angular){
	'use strict';

	function getValue(obj,field,value){
		var fields = field.trim().split('.');
		while(fields.length > 1){
			if(!fields[0].trim()){
				fields.shift();
			}else{
				obj = obj[fields.shift()] || {};
			}
		}
		if(angular.isDefined(value)){
			obj[fields.shift()] = value;
		}else{
			return obj[fields.shift()];
		}
	}

	function getValues(obj,fields){
		for(var i=0;i<fields.length;i++){
			if(obj[fields[i]]){
				return obj[fields[i]];
			}
		}
		return obj;
	}

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

	angular.module('cms.common').directive('pageShowLength',['$timeout',function($timeout) {
		return {
			restrict: 'A',
			link: function (scope, element) {
				angular.element(window).on('resize',resize);
				scope.$on('$destroy',function(){
					angular.element(window).on('resize',resize);
				});

				$timeout(resize);

				function resize(){
					scope.pageShowLength = Math.floor(Math.min(10,(element.parent().width() - (45+70+47+45+48+31*2+10))/36/2));
					scope.$apply();
				}
			}
		};
	}]);

	angular.module('cms.common').directive('sinoTooltip',['$timeout','$global',function($timeout,$global){
		return {
			restrict: 'A',
			link: function (scope, element,attrs) {
				var sinoTooltip = scope.$eval(attrs.sinoTooltip);
				if(sinoTooltip) {
					if ($global.isDebug && angular.isFunction(sinoTooltip)) {
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
					} else {
						element.css('width', scope.$eval(attrs.sinoTooltip)).tooltip({title: function () {return element.html();}});
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

	angular.module('cms.common').directive('sinoCkeditor',['$sce','$timeout',function($sce,$timeout){
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function (scope, element,attrs) {
				element.attr('id',Date.now() + Math.floor(Math.random()*10000));
				var ck = CKEDITOR.replace(element.attr('id'));
				ck.on('blur',function(){
					getValue(scope,(attrs.ngModel ||attrs.ngBind)+'$content',this.getData());
					getValue(scope,attrs.ngModel ||attrs.ngBind,getValue(scope,attrs.ngModel ||attrs.ngBind).replace(/<body[^>]*>([\s\S]*)<\/body>/,'<body>\n'+this.getData()+'</body>'));
					scope.$eval(attrs.ngChange);
				});
				ck.on('instanceReady', function() {
					element.parent().find('.cke_contents iframe').contents().find('.cke_editable').html(/<body[^>]*>([\s\S]*)<\/body>/.exec(getValue(scope,attrs.ngModel ||attrs.ngBind))[1]);
				});
				$timeout(function(){
					element.parent().find('.cke_contents').css('height',attrs.sinoCkeditor);
				},200);
			}
		};
	}]);

	angular.module('cms.common').directive('sinoSelect',['$timeout',function($timeout){
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
					var li = angular.element('<li class="padding-0-1 sino-directive '+getSelectClass(getValues(op,['value','id']))+'"></li>').appendTo(ul);
					angular.element('<div class="input">'+(getValues(op,['title','name']))+'</div>').appendTo(li).click(getClick(op));
					if(scope.deleteItem){
						angular.element('<a class="right hover fa fa-close"></a>').appendTo(li).click(deleteItem(scope,li,op));
					}
				});

				element.focus(function(){
					angular.element('ul.sino-select').hide();
					ul.show();
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

	angular.module('cms.common').directive('sinoCheckbox',[function(){
		return {
			restrict: 'A',
			replace:true,
			scope:{ngModel:'='},
			template:'<div><div class="sino-checkbox" ng-class="{\'sino-green\':ngModel}" ng-click="ngModel=!ngModel;sinoCheckbox(ngModel);"><a ng-show="!ngModel" style="float: left"></a><a ng-show="ngModel" style="float: right"></a></div></div>',
			link: function (scope, element) {
				scope.ngModel = !!scope.ngModel;
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
			template:'<div><div ng-repeat="op in listOption" ng-click="ngChange(op.$key)" class="sino-signChar fa {{getClass(op.$key)}}">{{op.name||op}}</div></div>',
			link: function (scope, element) {
				scope.listOption = _.map(scope.sinoMultiple,function(i,k){i.$key = k;return i;}).sort(function(a,b){return a.sort - b.sort;});
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
				element.removeClass('form-control');
			}
		};
	}]);



	angular.module('cms.common').directive('sinoDatepicker',['$global',function($global){
		return {
			restrict: 'A',
			link: function (scope, element,attrs) {
				var formatter = (attrs.sinoDatepicker || $global.dataFormatter).replace('MM','mm');
				inputReplace(element,'fa fa-calculator');
				element.datepicker({
					format: formatter,
					endDate: "today",
					weekStart: 1,
					autoclose: true
				}).datepicker('setDate', getValue(scope,attrs.ngModel)).change(function(){
					if(!element.val() || formatterToRegex(formatter).test(element.val())){
						getValue(scope,attrs.ngModel,element.val());
						scope.$eval(attrs.ngChange);
					}
				});
			}
		};
	}]);

	angular.module('cms.common').directive('sinoUpload',[function(){
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
				var change = scope.$eval(attrs.ngChange) || getValue;
				var parent = inputReplace(element,'fa fa-upload');
				dropFile(element,parent,changeValue,attrs.sinoUpload);
				element.focus(function(){
					angular.element('<input type="file" accept="'+attrs.sinoUpload+'">').change(changeValue).click();
				});
				/* jshint -W040*/
				function changeValue(){
					change(scope.entity,attrs.ngModel.replace('entity.',''),this.files);
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

})(window.angular);