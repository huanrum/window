(function (window, angular) {
	'use strict';

	window.languageList = {en:'en',zhCn:'zh-cn',zhTw:'zh-tw'};

	window.usePathname = (function(){
		var pathname = '';
		for(var i=0;i<window.location.pathname.length;i++){
			if(/[a-zA-Z0-9]/.test(window.location.pathname[i])){
				pathname += window.location.pathname[i];
			}
		}
		return function(name){
			return pathname + '_' + name;
		};
	})();

	angular.module('cms.common', [ 'ui.router']);
	angular.module('cms.main', ['cms.common']);


	angular.module('cms.common').value('$localStorage', window.localStorage);
	angular.module('cms.common').value('_', window._);
	angular.module('cms.common').value('$d3', window.d3);

	var serviceUrl = window.serviceUrl(window.usePathname);

	angular.module('cms.common').value('$global', {
		version: '1.0.1',
		languageList:window.languageList,

		isDebug: true,
		language:window.localStorage[window.usePathname('language')],
		token : window.localStorage[window.usePathname('token')],

		service:function(module){
			switch (module){
				case 'test':
					return 'http://192.168.1.248/learn/win7';
				case 'mam':
					return (serviceUrl.mamServiceUrl  || serviceUrl.tngServiceUrl) + '/mam';
				case 'monitor':
					return serviceUrl.publicServiceUrl + '/monitor';
				case 'ana':
					return serviceUrl.tngServiceUrl + '/ana';
				case 'log':
					return serviceUrl.publicServiceUrl +'/orc/log';
				case 'batch':
					return (serviceUrl.btuServiceUrl || serviceUrl.mamServiceUrl  || serviceUrl.tngServiceUrl) + '/btu';
				default:
					return serviceUrl.tngServiceUrl + '/ana';
			}
		},
		isServiceApi:function(url){
			var self = this;
			return window._.some([null,'test','mam','monitor','ana','log','batch'],function(module){
				return new RegExp(self.service(module)).test(url);
			});
		},
		refreshLanguage:function(language){
			window.localStorage[window.usePathname('language')] = language;
			window.location.reload();
		},
		exclude:function(url){
			this.__excludeUrls = this.__excludeUrls || [];
			if(url){
				if(this.__excludeUrls.indexOf(url) === -1){
					this.__excludeUrls.push(url);
				}
				return url;
			}else{
				return this.__excludeUrls;
			}
		}
	});

	angular.element(function(){
		var count = 0,languageData = {};
		angular.forEach(window.languageList,function(v,k){
			count = count + 1;
			angular.element.get('assets/language/'+v+'.json?'+window.compileDate,function(data){
				languageData[k] = data;
				count = count - 1;
				if(!count){
					angular.module('cms.common').value('languageData',languageData);
					angular.bootstrap(window.document.body,['cms.main']);
					if(!window.location.href.match(/#\//)){
						angular.element('body').injector().get('$state').go('main');
					}
				}
			});
		});
	});

})(window, window.angular);



