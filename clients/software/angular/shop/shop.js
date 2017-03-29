/**
 * Created by sus on 2016/3/18.
 */
(function($,angular){
	'use strict';

	$(function(){
		angular.bootstrap(document.body,['shop.base']);
	});

	angular.module('shop.base',[])
		.value('$e',window.$ehr)
		.controller('mainController',
		['$scope','$e','$http','$compile',function($scope,$e,$http,$compile) {

			var els = [
				'<menu-tree/>',
				'<select-tree/>',
				'<input type="checkbox" style="zoom:10">',
				'<div sino-multiple="data"></div>'
			];
			$scope.title = 'Angular Shop';
			$scope.info = 'seto shop,this is a good shop,quickly!!!';
			$scope.items = $e.each(['home','stationery','sports','sportswear','formal wear'], function (value,index) {
				return {
					id: index,
					title: value,
					element: '<div id="C'+index+'" style="height:100%;background:'+$e.color(index+10)+'">'+els[index%els.length]+'</div>',
					fn: function(e){
						var self = this;
						$scope.selected = this;
						if(index === 3){
							$http.get('data.json').then(function(req){
								$scope.data = {children:req.data};
								init(self);
							});
						}else{
							init(self);
						}
					}
				};
			});
			$scope.items[0].fn();

			$scope.menuData = {maxLevel:5,menuItems:$scope.items,fomatter:function(item){
				return item.title;
			}};
			$scope.menuData.menuItems[0].children = angular.copy($scope.items);

			function init(self){
				angular.element('.content').html(self.element);
				angular.element('.content').find('input[type=checkbox]').attr('checked',false).prop('indeterminate',true);
				$compile(angular.element('.content'))(angular.element('.content').scope());
		}
		}]);


	angular.module('shop.base').directive('menuTree',[function(){
		var defaultContent = 'Please select items ...';
			return function($scope,element,atts){
				$scope.menuData = $scope.menuData || {};

				var maxLevel = $scope.menuData.maxLevel || 5;
				var selectMenu = $('<div style="position: absolute;background:#ffffff;"></div>').hide().appendTo(element.parent());
				element.html(defaultContent);
				element.css({borderBottom:'1px solid #000000'});
				angular.forEach($scope.menuData.menuItems,function(menuItem){
					createMenu(1,selectMenu,menuItem);
				});

				element.click(function(e){
					var position = element.position();
					selectMenu.toggle().css({left:position.left,top:position.top + element.height() + 2});
				});
				$('body').click(function(e){
					if(some(element,$(e.target)) || some($(e.target).parents(),selectMenu)){
						return;
					}
					selectMenu.hide();
				});

				function some(array,objs){
					var result = true;
					angular.forEach(objs,function(obj){
						var has = false;
						angular.forEach(array,function(ar){
							if(ar === obj){
								has = true;
							}
						});
						if(!has){
							result = false;
						}
					});
					return result;
				}

				function createMenu(level,parent,item){
					var titleContent = ($scope.menuData&&$scope.menuData.fomatter)?$scope.menuData.fomatter(item):item.name;
					var title = $('<div style="margin: 1px;"></div>').html(titleContent);
					var menuItem = $('<div class="$$"></div>'.replace('$$',level+'-'+titleContent)).append(title).appendTo(parent);
					title.click(function(){
						item.isSelected = !item.isSelected;
						title.css({background:item.isSelected?'#999999':'#ffffff'});
						if(item.isSelected){
							checkChildren(item);
						}
						if(atts.selected){
							atts.selected(item);
						}
						if(atts.ngModel){
							$scope[atts.ngModel] = item;
						}
						element.html(getContent($scope.menuData.menuItems) || defaultContent);
					});

					item.$title = title;

					if(item.children && level < maxLevel){
						title.css({fontWeight: 'bold'});
						var childParent = $('<div></div>').css({marginLeft:level*5,borderLeft:'1px dotted #999999'}).appendTo(menuItem);
						angular.forEach(item.children,function(childItem){
							childItem.$parent = item;
							createMenu(level+1,childParent,childItem);
						});
					}

					function checkChildren(item$$){
						angular.forEach(item$$.children,function(childItem$$){
							childItem$$.isSelected = item$$.isSelected;
							if(childItem$$.$title){
								childItem$$.$title.css({background:childItem$$.isSelected?'#999999':'#ffffff'});
								checkChildren(childItem$$);
							}

						});
					}

					function getContent(list){
						var selectContent = '';
						angular.forEach(list,function(it) {
							var childContent = '',childrenContent = getContent(it.children),titleContent = ($scope.menuData && $scope.menuData.fomatter) ? $scope.menuData.fomatter(it) : it.name;

							if (it.isSelected) {
								childContent += titleContent;
							}

							if (childrenContent) {
								childContent += (childContent||('-'+titleContent+'-')) + ' : { ' + childrenContent +' } ';
							}

							if(selectContent && childContent){
								selectContent += ',';
							}

							selectContent += childContent;

						});
						return selectContent;
					}
				}
			};
	}]);

	angular.module('shop.base').directive('selectTree',[function(){
		var defaultContent = 'Please select items ...';
		return function($scope,element,atts){
			$scope.menuData = $scope.menuData || {};

			var maxLevel = $scope.menuData.maxLevel || 5;
			var selectMenu = $('<div style="position: absolute;background:#ffffff;"></div>').hide().appendTo(element.parent());
			element.html(defaultContent);
			element.css({borderBottom:'1px solid #000000'});
			angular.forEach($scope.menuData.menuItems,function(menuItem){
				createMenu(1,selectMenu,menuItem);
			});

			element.click(function(e){
				var position = element.position();
				selectMenu.toggle().css({left:position.left,top:position.top + element.height() + 2});
			});
			$('body').click(function(e){
				if(some(element,$(e.target)) || some($(e.target).parents(),selectMenu)){
					return;
				}
				selectMenu.hide();
			});

			function some(array,objs){
				var result = true;
				angular.forEach(objs,function(obj){
					var has = false;
					angular.forEach(array,function(ar){
						if(ar === obj){
							has = true;
						}
					});
					if(!has){
						result = false;
					}
				});
				return result;
			}

			function createMenu(level,parent,item){
				var titleContent = ($scope.menuData&&$scope.menuData.fomatter)?$scope.menuData.fomatter(item):item.name;
				var title = $('<div style="margin: 1px;"></div>').html(titleContent);
				var menuItem = $('<div class="$$"></div>'.replace('$$',level+'-'+titleContent)).append(title).appendTo(parent);
				title.click(function(){
					item.isSelected = !item.isSelected;
					title.css({background:item.isSelected?'#999999':'#ffffff'});
					if(item.isSelected){
						checkChildren(item);
					}
					if(atts.selected){
						atts.selected(item);
					}
					if(atts.ngModel){
						$scope[atts.ngModel] = item;
					}
					element.html(getContent($scope.menuData.menuItems) || defaultContent);
				});

				item.$title = title;

				if(item.children && level < maxLevel){
					title.css({fontWeight: 'bold'});
					var childParent = $('<div></div>').css({marginLeft:level*5,borderLeft:'1px dotted #999999'}).appendTo(menuItem);
					angular.forEach(item.children,function(childItem){
						childItem.$parent = item;
						createMenu(level+1,childParent,childItem);
					});
				}

				function checkChildren(item$$){
					angular.forEach(item$$.children,function(childItem$$){
						childItem$$.isSelected = item$$.isSelected;
						if(childItem$$.$title){
							childItem$$.$title.css({background:childItem$$.isSelected?'#999999':'#ffffff'});
							checkChildren(childItem$$);
						}

					});
				}

				function getContent(list){
					var selectContent = '';
					angular.forEach(list,function(it) {
						var childContent = '',childrenContent = getContent(it.children),titleContent = ($scope.menuData && $scope.menuData.fomatter) ? $scope.menuData.fomatter(it) : it.name;

						if (it.isSelected) {
							childContent += titleContent;
						}

						if (childrenContent) {
							childContent += (childContent||('-'+titleContent+'-')) + ' : { ' + childrenContent +' } ';
						}

						if(selectContent && childContent){
							selectContent += ',';
						}

						selectContent += childContent;

					});
					return selectContent;
				}
			}
		};
	}]);

	angular.module('shop.base').directive('sinoMultiple',['$compile',function($compile){
		return {
			restrict: 'A',
			scope: {
				ngModel: '=',
				sinoMultiple: '='
			},
			link: function (scope, element) {
				scope.$on('to-child',function(){
					scope.select = null;
				});
				scope.$on('to-parent',function(){
					scope.$parent.select = scope.sinoMultiple;
				});

				if(scope.sinoMultiple && scope.sinoMultiple.children && scope.sinoMultiple.children.length){
					var template = [
						'<ul>',
						'	<li ng-repeat="item in sinoMultiple.children" ng-class="{\'select\':item === select}">',
						'		<div ng-click="click(item)">{{item.name}}</div>',
						'		<ul sino-multiple="item"></ul>',
						'	</li>',
						'</ul>'
					].join('');

					scope.click = function(item){
						scope.$parent.$broadcast('to-child');
						scope.select = item;
						scope.$emit('to-parent');
					};
					$compile(angular.element(template).appendTo(element))(scope);
				}
			}
		};
	}]);


})(window.jQuery,window.angular);