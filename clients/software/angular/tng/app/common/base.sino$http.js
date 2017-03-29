(function(angular){
    'use strict';

    function updateUserData($global,$localStorage,user,req){
        $global.user = {id:req.data.data.accountId,userName:req.data.data.username,loginId:user.loginId,phone:req.data.data.phoneNumber,language:req.data.data.language,roles:req.data.data.roles};
        $global.token = req.data.data.accessToken;
        $global.language = req.data.data.language;
        $localStorage[window.usePathname('user')] = JSON.stringify($global.user);
        $localStorage[window.usePathname('token')] = req.data.data.accessToken;
        $localStorage[window.usePathname('language')] = req.data.data.language;
        $localStorage[window.usePathname('timeout')] = Date.now() + req.data.data.expriesIn * 1000;
    }


    angular.module('cms.common').config(['$httpProvider',function ($httpProvider) {
        $httpProvider.interceptors.push('httpRequestInterceptor');
    }]);

    angular.module('cms.common').factory('checkHttpResponse',['$state','$filter','$injector','$global','baseDialog',function($state,$filter,$injector,$global,baseDialog){
        return function(callback,errorBack,noShowError){
            return function(req){
                if(req&&req.data&&req.data.status){
                    switch (req.data.status.code){
                        case 0:
                            callback(req);
                            return true;
                        case 401:
                        case 403:
                            var manageHttpToken = $injector.get('manageHttpToken');
                            $injector.get('baseDialog').message(2,'@Warning','{{entity.content |language}} ',{content:'updateAccountLogin'},'confirm').end(function(){
                                manageHttpToken.logout();
                            });
                            break;
                        default :
                            if(errorBack){
                                errorBack(req);
                            }
                            if(noShowError !== true){
                                baseDialog.message(3, '', '{{entity.code |language:entity.message}}', req.data.status, 'close[width-6]', 3000);
                            }
                            break;
                    }
                }else{
                    if(errorBack){
                        errorBack(req);
                    }
                }
                return false;
            };
        };
    }]);

    function isOverdue(helper,manageHttpToken,$global,$localStorage,url){
        var updateTokenInterval = 2;
        if(!manageHttpToken.isRefreshToken && helper.value($global.user,'id') && $global.isServiceApi(url)){
            if(Date.now() > $localStorage[window.usePathname('timeout')]){
                return 'yes';
            }else if(Date.now() > $localStorage[window.usePathname('timeout')] - updateTokenInterval *60 *1000){
                return 'refresh';
            }
        }
        return 'no';
    }

    function getPermissionFn(_,$http,$q,$global,$injector){
        var baseService = $injector.get('baseService'),checkHttpResponse = $injector.get('checkHttpResponse'),menuData = $injector.get('menuData');
        return function (){
            var defer = $q.defer();
            $global.permissionList = _.map({1:'create',2:'view',4:'edit',8:'delete'},function(v,k){
                    return {name:v,id:k};
                });
            $http.get(baseService.url('/function/permession')).then(checkHttpResponse(function(req){
                defer.resolve(filter(menuData, req.data.data));
            }));
            return defer.promise;

            function filter(menus,permission) {
                return _.filter(_.map(angular.copy(menus), function (menu) {
                    var perm = _.find(permission, {functionCode: menu.index});
                    return angular.extend({}, menu, {
                        permissionSum: perm && perm.permissionSum || ($global.isDebug && menu.permissionSum),
                        subMenus: filter(menu.subMenus, permission)
                    });
                }), function (i) {
                    return i.permissionSum || i.subMenus.length;
                });
            }
        };
    }

    function hasRole(_,$global,manageHttpToken){
        return function(roles){
            var user = manageHttpToken.user();
            if($global.isDebug){
                return true;
            }else if(user && user.roles){
                return _.some(roles,function(role){
                    return user.roles.indexOf(role) !== -1;
                });
            }
        };
    }

    angular.module('cms.common').factory('manageHttpToken',['$q','$http','$injector','baseDialog','$global','$localStorage',function($q,$http,$injector,baseDialog,$global,$localStorage){

        var helper = $injector.get('helper'),_ = $injector.get('_');

        return angular.extend(manageHttpToken,{
            over:function(){return Date.now() > $localStorage[window.usePathname('timeout')];},
            user:function(user) {
                if (user) {
                    $localStorage[window.usePathname('user')] = JSON.stringify(user);
                } else {
                    return JSON.parse(helper.truthValue($localStorage[window.usePathname('user')], 'null'));
                }
            },
            hasRole:hasRole(_,$global,manageHttpToken),
            menus:getPermissionFn(_,$http,$q,$global,$injector),
            allPermission:allPermission,
            showLoginDialog:showLoginDialog
        },$injector.get('manageHttpTokenExtend')(manageHttpToken));

        function manageHttpToken(config,addDataToHeader) {
            var defer = $q.defer();
            switch (isOverdue(helper,manageHttpToken,$global,$localStorage,config.url)){
                case 'no':
                    addDataToHeader($global);
                    defer.resolve(config);
                    break;
                case 'yes':
                    showLoginDialog(updateData(defer,config,addDataToHeader),manageHttpToken.login);
                    break;
                default :
                    manageHttpToken.isRefreshToken = true;
                    refreshToken(updateData(defer,config,addDataToHeader));
                    break;
            }
            return defer.promise;
        }
        function updateData(defer,config,addDataToHeader){
            return function (req){
                manageHttpToken.isRefreshToken = false;
                $global.token = req.data.data.accessToken;
                $localStorage[window.usePathname('token')] = req.data.data.accessToken;
                $localStorage[window.usePathname('timeout')] = Date.now() + req.data.data.expriesIn * 1000;
                addDataToHeader($global);
                defer.resolve(config);
            };
        }
        function refreshToken(callback){
            $http.get($injector.get('baseService').url('/login/refeshToken')).then(callback);
        }
        function showLoginDialog(callBack,login){
            if(!showLoginDialog.user){
                showLoginDialog.user = $global.user.loginId;
                baseDialog.edit('login',{width:248,rows:[{title:'userName',field:'loginId'},{title:'password',field:'password',editor:'password',enter:'login'}]},{loginId:showLoginDialog.user},'',['@login']).then(function(entity,action,close,keep){
                    return login(entity,true).then($injector.get('checkHttpResponse')(function (req) {
                        delete showLoginDialog.user;
                        callBack(req);
                        close();
                    },keep),keep);
                }).end(function(){
                    delete showLoginDialog.user;
                });
            }
        }

        function allPermission(scope){
            var helper = $injector.get('helper');
            scope.permission =  _.zipObject(_.map($global.permissionList,function(i){return i.name;}), _.map($global.permissionList,function(i){
                return !!( helper.and(scope.permissionSum , i.id));
            }));
        }
    }]);


    angular.module('cms.common').factory('manageHttpTokenExtend',['$q','$http','$injector','baseDialog','$global','$localStorage',function($q,$http,$injector,baseDialog,$global,$localStorage){

        return function(manageHttpToken){
            return {
                login:login,
                send:sendResetPassword,
                forget:forgetPassword,
                changePassword:putChangePassword,
                logout:logout,
                language:putLanguage
            };

            function logout() {
                manageHttpToken.isRefreshToken = false;
                $global.user = {loginId:$global.user.loginId,language:$global.user.language};
                $injector.get('$state').go('login');
                $localStorage[window.usePathname('token')] = null;
                $localStorage[window.usePathname('user')] = JSON.stringify($global.user);
                return $http.post($global.exclude($injector.get('baseService').url('/account/logout')),null);
            }
        };

        function sendResetPassword(email){
            var defer = $q.defer(),checkHttpResponse = $injector.get('checkHttpResponse'),$filter=$injector.get('$filter');
            $http.post($injector.get('baseService').url('/validCode'),{username:email}).then(checkHttpResponse(function(req){
                defer.resolve({success:{message:req.data.status.message,parameters:{min:30}}});
            },function(req){
                defer.resolve({error:{message:$filter('language')(req.data.status.code,req.data.status.message)}});
            },true));
            return defer.promise;
        }
        function forgetPassword(entity){
            var defer = $q.defer(),checkHttpResponse = $injector.get('checkHttpResponse');
            $http.post($injector.get('baseService').url('/validCode/updatePassword'),entity).then(checkHttpResponse(function(){defer.resolve();}));
            return defer.promise;
        }
        function login(user,showError) {
            var defer = $q.defer(),checkHttpResponse = $injector.get('checkHttpResponse');
            $global.user = null;
            $http.post($injector.get('baseService').url('/login'),{username:user.loginId,password:user.password}).then(checkHttpResponse(function(req){
                updateUserData($global,$localStorage,user,req);
                defer.resolve(req);
            },function(req){
                $global.user = {loginId:user.loginId,language:user.language};
                defer.resolve(req);
            },!showError));
            return defer.promise;
        }
        function putLanguage(entity){
            var defer = $q.defer(),checkHttpResponse = $injector.get('checkHttpResponse');
            $http.put($injector.get('baseService').url('/account/updateProfile'),entity).then(checkHttpResponse(function(){
                defer.resolve();
            }));
            return defer.promise;
        }
        function putChangePassword(entity){
            var defer = $q.defer(),checkHttpResponse = $injector.get('checkHttpResponse');
            $http.put($injector.get('baseService').url('/account/upPass'),entity).then(checkHttpResponse(function(){defer.resolve();}));
            return defer.promise;
        }

    }]);

    angular.module('cms.common').factory('httpRequestInterceptor', ['_','$q', '$injector','$global', function (_,$q, $injector,$global) {

        var transform = 'http://dell-pc-seto:3000/proxy';//'../../../../test/tng';
        return {
            'request': function (config) {
                return $injector.get('manageHttpToken')(config,function($global){
                    config.headers.token = $global.token ;
                    if ($global.exclude().indexOf(config.url) === -1 && $global.isServiceApi(config.url)) {
                        config.headers.path = config.url;
                        config.url =  transform;
                        $injector.get('baseDialog').loading(config);
                    }
                });
            },
            'response': function (response) {
                if (transform === response.config.url) {
                    response.config.url = response.config.headers.path;
                    response.data = {status:{code:0},data:[{},{},{}]};
                }
                $injector.get('baseDialog').loading(response.config, {succeed: true});
                return response;
            },
            'requestError': function (rejection) {
                if (rejection.config && transform === rejection.config.url) {
                    rejection.config.url = rejection.config.headers.path;
                }
                $injector.get('baseDialog').loading(rejection.config || rejection, {
                    succeed: false,
                    message: rejection.data && rejection.data.status && rejection.data.status.message
                });
                showError(rejection);
                return $q.reject(rejection);
            },
            'responseError': function (rejection) {
                if (rejection.config && transform === rejection.config.url) {
                    rejection.config.url = rejection.config.headers.path;
                }
                $injector.get('baseDialog').loading(rejection.config || rejection, {
                    succeed: false,
                    message: rejection.data && rejection.data.status && rejection.data.status.message
                });
                showError(rejection);
                $q.reject(rejection);
            }
        };

        function showError(rejection){
            var titles = {401:'authenticationError',403:'authorizationError',404:'apiError',500:'serviceError'};
            if(titles[rejection.status]){
                var content = '<span ng-click="showContent = !showContent" class="fa fa-question-circle-o fa-2x error-icon">{{\'details\'|language}}</span><div ng-show="showContent">'+rejection.data+'</div>';
                $injector.get('baseDialog').message(null, titles[rejection.status],'['+rejection.status+']'+rejection.config.url.split('?').shift() +'<br>'+ ($global.isDebug&&content||''), {}, '',5000);
            }else{
                $global.rejection = rejection;
            }
        }

    }]);




})(window.angular);