(function(angular,window){
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

    function setting(_,$http,baseDialog,language,$localStorage,$global){
        var lookup = {
            tngServiceUrl:['sino-select',toArray({SIT:'192.168.1.239:9900/orc',DEV:'192.168.1.233:8080',Zhihong:'192.168.1.215:8888',Chenjie:'192.168.1.199:8080'})],
            mamServiceUrl:['sino-select',toArray({SIT:'192.168.1.239:9900/orc',DEV:'192.168.1.241:8090',Stephen:'192.168.1.223:8080'})],
            btuServiceUrl:['sino-select',toArray({SIT:'192.168.1.239:9900/orc',DEV:'192.168.1.241:8090',Zhihong:'192.168.1.215:8888',Owen:'192.168.1.187:8080',Chenjie:'192.168.1.199:8080'})],
            publicServiceUrl:['sino-select',toArray({SIT:'192.168.1.239:9900',DEV:'192.168.1.239:8800'})],
            language: [null,_.zipObject(_.map($global.languageList),_.map($global.languageList,function(v,k){return language(k);}))],
            isDebug:[null,{'true':language('true'),'false':language('false')}]
        };
        baseDialog.advanced($localStorage,function(field){
            return _.filter(lookup,function(v,k){
                return window.usePathname(k) === field;
            })[0];
        },function(field){
            return field.replace(window.usePathname(''),'');
        }).then(function(){
            window.location.reload();
        });

        function toArray(obj){
            return _.map(obj,function(v,k){return {name:k,value:v};});
        }
    }

    function runString(baseDialog,$injector){
        baseDialog.input('Run','textarea','function func( _ , $localStorage ){\n  ',{height:600}).then(function(entity){
            var args = getArgs($injector.get('_'),entity.slice(entity.indexOf('(')+1,entity.indexOf(')')));
            if(!/}$/.test(entity.trim())){
                entity = entity + '}';
            }
            setTimeout('(function(){\n\nvar $injector = angular.element(\'body\').injector();\n\n(@content@)(@args@)\n\n})();'.replace('@args@',args).replace('@content@',entity.trim()),10);
        });

        function getArgs(_,args){
            return _.map(args.split(','),function(arg){
                return '$injector.get(\''+arg.trim()+'\')';
            });
        }
    }

    function timeout(baseDialog,$injector){
        var languageFilter = $injector.get('$filter')('language');
        baseDialog.edit('timeout', {rows:[
            {title:'intervalSetting',field:'interval',editor:'number'},
            {title:'timeoutSetting',field:'timeout',editor:'number',validate:validate},
            {title:'autoSetting',field:'auto',editor:'number',enter:'ok',validate:validate}
        ]}, angular.extend({},$injector.get('$global').timeout || {}), '',['ok']).then(function(entity){
            $injector.get('$global').timeout = entity;
        });

        function validate(entity,$error){
            /* jshint -W040 */
            var row = this;
            if(entity.interval > entity[row.field]){
                $error[row.title] = {message:languageFilter(row.title) +' > '+ languageFilter('intervalSetting')};
            }else{
                delete $error[row.title];
            }
        }
    }


    function showLanguage(baseDialog,$injector){
        var columns = ['key'],list = [],_ = $injector.get('_');
        angular.forEach($injector.get('languageData'),function(data,lang){
            columns.push(lang+'-text');
            angular.forEach(data,function(v,k){
                var item = _.find(list,{key:k});
                if(!item){
                    item = {key:k};
                    list.push(item);
                }
                item[lang] = v;
            });
        });
        baseDialog.grid(' ',columns,$injector.get('helper').sort(list,'key')).then(function(items){
            var result = {};
            angular.forEach(items,function(item){
                angular.forEach($injector.get('$global').languageList,function(v,k){
                    result[k] = result[k] || {};
                    result[k][item.key] = item[k];
                });
            });
            $injector.get('$http').post(window.location.protocol + '//'+window.location.hostname + '/learn/win7/base/savefile',{
                name:'D:\\Developer\\tng-portal-web\\assets\\language\\language.json',
                content:JSON.stringify(result)
            }).then(function(){

            });
        });
    }

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

    angular.module('cms.common').directive('sinoSetting',['$http','_','$injector','$global','baseDialog','$filter',function($http,_,$injector,$global,baseDialog,$filter){

        var sidebars = {
            'setting': {
                'title': 'setting',
                'class': 'fa-cogs',
                'fn': function () {
                    setting(_, $http, baseDialog, $filter('language'), $injector.get('$localStorage'), $injector.get('$global'));
                }
            },
            'language': {
                'title': 'language',
                'class': 'fa-language',
                'fn': function () {
                    showLanguage(baseDialog, $injector);
                }
            },
            'run': {
                'title': 'run',
                'class': 'fa-superpowers',
                'fn': function () {
                    runString(baseDialog,$injector);
                }
            },
            'test': {
                'title': 'test',
                'class': 'fa-play-circle',
                'fn': function () {
                    test(baseDialog, $injector);
                }
            },
            'timeout': {
                'title': 'timeout',
                'class': 'fa-clock-o',
                'fn': function () {
                    timeout(baseDialog, $injector);
                }
            }
        };

        return {
            restrict: 'A',
            scope:{},
            link: function (scope, element) {
                if ($global.isDebug){
                    $injector.get('$compile')(angular.element(
                        [
                            '<div class="cms-sidebar" ng-mouseenter="showSidebar = true" ng-mouseleave="showSidebar = false">',
                            '	<div ng-show="!!showSidebar" class="cms-sidebar-content">',
                            '		<div ng-repeat="sidebar in sidebars" class="cms-sidebar-item" ng-click="sidebar.fn()">',
                            '			<div title="{{sidebar.title |language}}"><i class="sidebar-icon fa fa-2x {{sidebar.class}}"></i></div>',
                            '		</div>',
                            '	</div>',
                            '</div>'
                        ].join('')
                    ))(angular.extend($injector.get('$rootScope').$new(true),{sidebars: _.map(sidebars)})).appendTo(element);
                }

                element.on('keydown',function (e){
                    if (e.altKey && e.shiftKey && e.ctrlKey) {
                        sidebars.setting.fn();
                    }else if ($global.isDebug && (e.altKey || e.shiftKey || e.ctrlKey)){
                        switch (e.keyCode){
                            case 76:/* ALT + L,CTRL + L,SHIFT + L */
                                sidebars.language.fn();
                                break;
                            case 82:/* ALT + R,CTRL + R,SHIFT + R */
                                sidebars.run.fn();
                                break;
                            case 84:/* ALT + T,CTRL + T,SHIFT + T */
                                sidebars.test.fn();
                                break;
                            default:
                                break;
                        }

                    }
                });
            }
        };
    }]);

    angular.module('cms.common').directive('sinoUseId',['$global',function($global){
        return {
            restrict: 'A',
            link: function (scope, element,attrs) {
                if($global.isDebug && !element.attr('id')){
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

})(window.angular,window);