/**
 * Created by Administrator on 2016/4/21.
 */
(function(angular){
	'use strict';

	angular.module('staff.common').config(function ($httpProvider) {
		$httpProvider.interceptors.push('addTokenInterceptor');
		$httpProvider.interceptors.push('noTokenInterceptor');
	});

	angular.module('staff.common').factory('addTokenInterceptor', function ($global) {
		return {
			request: function (config) {
				config.headers.token = $global.token;
				config.headers.sessionId = $global.sessionId;
				return config;
			}
		};
	});
	/*
	 * if not token value in any response from backend ,should go to login page
	 */
	angular.module('staff.common').factory('noTokenInterceptor', function ($window,$global,$rootScope) {
		return {
			response: function (response) {
				if(!response.data || ["9010103","9010105","9010101","9010102","9010104","9010106","9010113"].indexOf(response.data.returnCode) !== -1){
					$global.token = null;
					$window.location.href = "#/login";
					return response;
				}else{
					angular.forEach(response.data.returnCode &&　response.data.returnCode.split(","),function(kaptchaCode){
						if(kaptchaCode === "9010108" || kaptchaCode === "9010107"){
							$rootScope.isNeedKaptcha = true;
							$global.kaptcha = true;
						}else if(kaptchaCode.length === 7){
							$rootScope.isNeedKaptcha = false;
							$global.kaptcha = false;
						}
					});
				}
				return response;
			}
		};
	});


})(window.angular);