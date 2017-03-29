(function (window, angular) {
	'use strict';

	var serviceUrl = (function () {
		var httpUrl = '';
		if (window.localStorage.eFNAServiceUrl) {
			if (/http/.test(window.localStorage.eFNAServiceUrl)) {
				httpUrl = window.localStorage.eFNAServiceUrl;
			} else {
				httpUrl = location.protocol + '//' + window.localStorage.eFNAServiceUrl;
			}
		} else if (location.hostname === 'dell-pc-seto') {
			window.localStorage.eFNAServiceUrl = window.localStorage.eFNAServiceUrl || '192.168.1.231';
			window.localStorage.isDebug = window.localStorage.isDebug || 'true';
			window.localStorage.language = window.localStorage.language || 'en';
			httpUrl = location.protocol + '//' + window.localStorage.eFNAServiceUrl;
		} else {
			window.localStorage.eFNAServiceUrl = '';
			httpUrl = location.protocol + '//' + location.hostname;
		}
		return httpUrl+ '/eFNA/rest/cms';
	})();

	angular.module('cms.common', [ 'ui.router']);
	angular.module('cms.main', ['cms.common']);


	angular.module('cms.common').value('$localStorage', window.localStorage);
	angular.module('cms.common').value('_', window._);

	angular.module('cms.common').value('passwordRegex', {
		test:function(str){
			return /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[~!@#$*^\.\-_+=])[0-9A-Za-z~!@#$*^\.\-_+=]{6,20}$/.test(str);
		},
		error:function(str){
			if(!/^[0-9A-Za-z~!@#$*^\.\-_+=]*$/.test(str)){
				return 'regexPasswordChar';
			}
			if(!/(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[~!@#$*^\.\-_+=])/.test(str)){
				return 'regexPasswordLeast';
			}
			if(!/^[0-9A-Za-z~!@#$*^\.\-_+=]{6,20}$/.test(str)){
				return 'regexPasswordLength';
			}
		}
	});

	angular.module('cms.common').value('$global', {
		version: '1.0.1',
		dataFormatter:'yyyyMMdd',
		isTest: true,
		effectiveInterval: 100000,/*ms*/
		isDebug: window.localStorage.isDebug === 'true',
		language: window.localStorage.language,
		eFNAServiceUrl: serviceUrl
	});

	angular.module('cms.common').config(function ($httpProvider) {
		$httpProvider.interceptors.push('httpRequestInterceptor');
	});

	angular.module('cms.common').factory('checkHttpResponse',['$state','$filter','$global','baseDialog',function($state,$filter,$global,baseDialog){
		return function(callback,errorBack){
			return function(req){
				if(req&&req.data){
					switch (req.data.returnCode){
						case '0':
							callback(req);
							break;
						case '9010105':
						case '1020105':
							if(!$global.isDebug){
								$state.go('login');
							}
							break;
						default :
							if($global.isDebug && errorBack){
								errorBack();
							}
							baseDialog.message(2, req.data.returnCode, req.data.returnMessage, {}, '', 2000);
							break;
					}
				}else{
					if($global.isDebug && errorBack){
						errorBack();
					}
					baseDialog.message(3, 'error', '{{\'apiError\'|language}}', {}, '', 2000);
				}
			};
		};
	}]);


	angular.module('cms.common').factory('httpRequestInterceptor', ['$q', '$injector', function ($q, $injector) {
		var transform = '../../../../test/tng';
		return {
			'request': function (config) {
				var $global = $injector.get('$global');
				config.headers.language = $global.language;
				config.headers.Token = $global.token;
				config.headers.userId = $global.user && $global.user.userId;
				if (/\/eFNA\/rest\/cms/.test(config.url)) {
					config.headers.path = config.url;
					config.url =  transform;
					$injector.get('baseDialog').loading(config);
				}
				$injector.get('baseDialog').loading(config);
				return config;
			},
			'response': function (response) {
				if (transform === response.config.url) {
					response.config.url = response.config.headers.path;
				}
				$injector.get('baseDialog').loading(response.config, {succeed: true});
				return response;
			},
			'requestError': function (rejection) {
				if (rejection.config && transform === rejection.config.url) {
					rejection.config.url = rejection.config.headers.path;
				}
				$injector.get('baseDialog').loading(rejection.config, {
					succeed: false,
					message: rejection.data && rejection.data.returnMessage
				});
				return $q.reject(rejection);
			},
			'responseError': function (rejection) {
				if (rejection.config && transform === rejection.config.url) {
					rejection.config.url = rejection.config.headers.path;
				}
				$injector.get('baseDialog').loading(rejection.config, {
					succeed: false,
					message: rejection.data && rejection.data.returnMessage
				});
				$q.reject(rejection);
			}
		};
	}]);

})(window, window.angular);