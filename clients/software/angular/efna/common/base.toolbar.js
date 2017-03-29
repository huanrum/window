(function(angular){
	'use strict';

	function sinoTestService($timeout,list){
		$timeout.cancel(sinoTestService.timeout);
		auto($timeout,list,function(){
			sinoTestService.timeout = $timeout(function(){
				sinoTestService($timeout,list);
			},10*60*1000);
		});
	}

	function auto($timeout,list,callBack){
		if(list[0]){
			switch (typeof list[0]){
				case 'function':
					list[0](angular.element,function(obj,ext,callBack){inputValue($timeout,obj,ext,callBack,Object.getOwnPropertyNames(ext));});
					break;
				case 'string':
					angular.element(list[0]).click();
					break;
				default :
					break;
			}
			$timeout(function(){
				auto($timeout,list.slice(1,list.length));
			},angular.isNumber(list[0])?list[0]:100);
		}else{
			if(angular.isFunction(callBack)){
				callBack();
			}
		}
	}

	function inputValue($timeout,obj,ext,callBack,fields){
		if(fields.length){
			if(ext[fields[0]] === true || ext[fields[0]] === false){
				obj[fields[0]] = ext[fields[0]];
			}else{
				obj[fields[0]] = '';
				input($timeout,obj,fields[0],''+ext[fields[0]],function(){
					inputValue($timeout,obj,ext,callBack,fields.slice(1,fields.length));
				});
			}
		}else if(angular.isFunction(callBack)){
			callBack();
		}
	}

	function input($timeout,obj,field,value,callBack){
		if(!value || !value.length){
			callBack();
		}else{
			obj[field] = (obj[field]||'') + value[0];
			$timeout(function(){
				input($timeout,obj,field,value.slice(1,value.length),callBack);
			},500);
		}
	}

	function test(baseDialog,$injector){
		baseDialog.advanced({number:''},getTestElementCount).then(function(entity){
			sinoTestService($injector.get('$timeout'),$injector.get('test-'+entity.number)());
		});

		function getTestElementCount(){
			var result = [];
			angular.element('[src^="test/test-"][src$=".js"]').each(function(index){
				result.push(''+index);
			});
			return result;
		}
	}

	function setting($http,baseDialog,language,$localStorage){
		var serviceIpUrl = 'http://dell-pc-seto/learn/win7/base/urls?type=3';
		var lookup = {
			eFNAServiceUrl:['192.168.1.231','192.168.1.232','192.168.1.125:8999','192.168.1.215:8080','192.168.1.121:8080'],
			language:{en:language('en'),'zh-cn':language('zhCn'),'zh-tw':language('zhTw')},
			isDebug:{true:language(true),false:language(false)}
		};
		$http.get(serviceIpUrl).then(function(req){
			lookup.eFNAServiceUrl = req && req.data || lookup.eFNAServiceUrl;
			lookup.eFNAServiceUrl.deleteItem = deleteItem;
			baseDialog.advanced($localStorage,function(field){
				return lookup[field];
			}).then(function(){
				$http.get(serviceIpUrl +'&url='+$localStorage.eFNAServiceUrl);
				window.location.reload();
			});
		});

		function deleteItem(item){
			return $http.get(serviceIpUrl +'&id='+item.id);
		}

	}

	function runString(baseDialog){
		baseDialog.input('textarea','function func( _ , $localStorage ){\n  ',{height:600}).then(function(entity){
			var args = getArgs(entity.slice(entity.indexOf('(')+1,entity.indexOf(')')));
			if(!/}$/.test(entity.trim())){
				entity = entity + '}';
			}
			setTimeout('(function(){\n\nvar $injector = angular.element(\'body\').injector();\n\n(@content@)(@args@)\n\n})();'.replace('@args@',args).replace('@content@',entity.trim()),10);
		});

		function getArgs(args){
			return _.map(args.split(','),function(arg){
				return '$injector.get(\''+arg.trim()+'\')';
			});
		}
	}

	function staticHtml($http,baseDialog,$timeout){
		$http.get('static/index.html').then(function(req){
			var fileName = 'D:\\Developer\\eFNA-cms\\static\\index.html',height = 600;
			baseDialog.message(null,'staticHtmlTitle', '<div ng-bind="entity.content" sino-ckeditor="'+height+'"></div>', {name:fileName,content:req.data}, 'ok').then(function(entity){
				$http.post('http://192.168.1.248/learn/win7/base/savefile',entity).then(function(){
					if(entity.content$content){
						baseDialog.message(null, 'staticHtmlTitle',function(bodyElement){
							bodyElement.css({height:height+25}).removeClass('').html('<iframe height="'+height+'"></iframe>');
							$timeout(function(){
								bodyElement.contents('iframe').contents().find('body').html(entity.content$content);
							});
						}, {}, 'ok');
					}
				});
			});
		});
	}

	angular.module('cms.common').directive('sinoSetting',['$http','_','$injector','$localStorage','baseDialog','$filter',function($http,_,$injector,$localStorage,baseDialog,$filter){

		return {
			restrict: 'A',
			link: function (scope, element) {
				if($injector.get('$global').isDebug){
					element.on('keydown',function (e){
						if (e.altKey && e.shiftKey && e.ctrlKey) {
							setting($http,baseDialog,$filter('language'),$localStorage);
						}else if (e.altKey || e.shiftKey || e.ctrlKey){
							switch (e.keyCode){
								case 82:/* ALT + R,CTRL + R,SHIFT + R */
									runString(baseDialog);
									break;
								case 83:/* ALT + S,CTRL + S,SHIFT + S */
									staticHtml($http,baseDialog,$injector.get('$timeout'));
									break;
								case 84:/* ALT + T,CTRL + T,SHIFT + T */
									test(baseDialog,$injector);
									break;
								default :
									break;
							}

						}
					});
				}
			}
		};
	}]);

	angular.module('cms.common').directive('sinoSomeManage',['$localStorage',function($localStorage){

		function someManage(){
			var user = JSON.parse($localStorage.user);
			user.date = Date.now();
			$localStorage.user = JSON.stringify(user);
		}

		return {
			restrict: 'A',
			link: function (scope, element) {
				element.on('mousemove',someManage);
				element.on('keydown',someManage);
			}
		};
	}]);

	angular.module('cms.common').directive('sinoUseId',['$global',function($global){

		return {
			restrict: 'A',
			link: function (scope, element,attrs) {
				if($global.isTest && !element.attr('id')){
					var id = scope.$eval(attrs.sinoUseId) || attrs.ngModel || attrs.ngClick;
					while(/[\.\(\)\[\]]/.test(id)){
						id = id.replace(/[\.\(\)\[\]]/,'-');
					}
					element.attr('id',id);
				}
				element.attr('sino-use-id',null);
			}
		};
	}]);

})(window.angular);