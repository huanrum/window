(function(angular){
    'use strict';

    var batchToupDetailsMaxLength = 1000;

    function getSelfService(dataService,action,type){
        var self = {
            save:{
                create:function () {
                    return dataService.create.apply(dataService,arguments);
                },
                edit:function () {
                    return dataService.update.apply(dataService,arguments);
                }
            },
            submit: {
                create: function () {
                    return dataService.submit.apply(dataService,arguments);
                },
                edit: function () {
                    return dataService.submit.apply(dataService,arguments);
                }
            }
        };
        return self[action][type];
    }

    function copyData(obj,fields){
        var result = {};
        angular.forEach(fields,function(field){
            result[field] = obj[field];
        });
        return result;
    }

    angular.module('cms.main').factory('maintainManageService',['$q','baseDialog','checkHttpResponse','maintainDialogUiService','draftService',function($q,baseDialog,checkHttpResponse,dialogUi,dataService){

        function saveSubmit($scope,item,type) {
            var defer = $q.defer();
            baseDialog.edit('topUpInformation', dialogUi($scope, dataService, type), item, type, ['cancel', '!@$save[background-blue]', '@$submit[background-green]'])
                .then(function (entity, action, close, keep) {
                    getSelfService(dataService,action, type)(entity).then(checkHttpResponse(function (req) {
                        if (close) {
                            close();
                        }
                        defer.resolve(req);
                        $scope.refreshData();
                    }, keep), keep);
                });
            return defer.promise;
        }

        function balance($scope){
            return dataService.balance.apply(dataService,arguments).then(function(balance){
                angular.extend($scope,balance);
            });
        }

        return {
            balance:balance,
            create:function($scope,item){
                var defer = $q.defer();
                saveSubmit($scope,item,'create').then(function (req) {
                    balance($scope);
                    defer.resolve(req);
                });
                return defer.promise;
            },
            copy:function($scope,item){
                var defer = $q.defer();
                var fields = ['executionDate','executionTimeId','description','templatePushId','templateListId','activityHistoryId','batchToupDetails'];
                saveSubmit($scope,copyData(item,fields),'create').then(function (req) {
                    balance($scope);
                    defer.resolve(req);
                });
                return defer.promise;
            },
            edit:function($scope,item){
                var defer = $q.defer();
                saveSubmit($scope,item,'edit').then(function (req) {
                    balance($scope);
                    defer.resolve(req);
                });
                return defer.promise;
            },
            view:function($scope,item){
                var defer = $q.defer();
                baseDialog.edit('topUpInformation', dialogUi($scope, dataService, 'view'), item, 'view',[]).then(function (re) {
                    defer.resolve(re);
                });
                return defer.promise;
            },
            detail:function($scope,item){
                var defer = $q.defer();
                baseDialog.edit('topUpInformation', dialogUi($scope, dataService, 'detail'), item, 'view',[]).then(function (re) {
                    defer.resolve(re);
                });
                return defer.promise;
            }
        };
    }]);

    function validateDateTime(_,helper,fields){
        return function(entity,$error,$extend){
            var row = this;
            if(_.every(fields,function(field){return !helper.value(entity,field);}) || _.every(fields,function(field){return !!helper.value(entity,field);})){
                delete $error[helper.validateFiled(row.title,$extend)];
            }else{
                $error[helper.validateFiled(row.title,$extend)] = {message:'errorMessageIsConsistent'};
            }
        };
    }

    function executionDateTimeNgChange(helper,scope){
        return function(){
            if(!helper.value(scope,'entity.executionDate')){
                return;
            }
            var getDate = helper.value(scope,'entity.executionDate').split('-');
            var interval = new Date(getDate[2],getDate[1]-1,getDate[0]) - new Date(new Date().toLocaleDateString());
            if(interval > 0) {
                scope.showMessage = {
                    message: 'errorDateDays',
                    params: {
                        day: Math.floor(interval / (24 * 60 * 60 * 1000))
                    }
                };
                scope.$apply();
            }
        };
    }

    angular.module('cms.main').factory('maintainDialogUiService', ['_','$q','$timeout','helper','baseDialog','lookupService',function (_,$q,$timeout,helper,baseDialog,lookupService) {

        function collectEntity(entity){
            var result = angular.copy(entity);
            delete result.refId;
            return result;
        }

        return function ($scope,dataService,method){
            return {
                'width':1200,
                'class':'top-up-information-dialog',
                'rows':getRows,
                'disable': disable,
                'focus':2,
                collectEntity:collectEntity
            };

            function disable() {
                return helper.truthValue(method === 'view' , method === 'detail');
            }

            function getRows(entity,bodyElement) {
                return {
                    '$empty$1': {
                        'left': [
                            {
                                'title':'ID',
                                'field':'refId',
                                'ratio':2/3,
                                'width':0.333
                            },
                            {
                                'title': 'executionDateTime',
                                'field': 'executionDateTime',
                                'ratio': 6/16,
                                'width': 0.555,
                                'class':'datapick-tic',
                                'times':lookupService('timeList'),
                                'validate':validateDateTime(_,helper,['executionDate','executionTimeId']),
                                'editor': function (scope, row, $rowStr) {
                                    var validateStr = ' ng-class="{\'sino-validate\':' + $rowStr + '.validate(entity,$error)&&showError}" ';
                                    scope.entity.executionTimeId = (scope.entity.executionTimeId||'') + '';
                                    row.ngChange = executionDateTimeNgChange(helper,scope);
                                    $timeout(row.ngChange,1000);
                                    return [
                                        '<span class="col-md-5 sino-value-child" validateStr>',
                                        '   <input  ngDisable ng-model="entity.executionDate" class="form-control" sino-datepicker="dd-MM-yyyy" range="3:90" ng-change="'+$rowStr+'.ngChange()">',
                                        '</span>',
                                        '<span class="col-md-2"></span>',
                                        '<span class="col-md-5 sino-value-child" validateStr>',
                                        '   <select ngDisable ng-model="entity.executionTimeId" class="form-control">',
                                        '       <option ng-repeat="time in '+$rowStr+'.times" value="{{time.id}}">{{time.startTime}} - {{time.endTime}}</option>',
                                        '   </select>',
                                        '</span>',
                                        '<div class="datapick-tic-error color-blue " ng-show="!!showMessage">{{showMessage.message|language:showMessage.params}}</div>'
                                    ].join('').replace(/ngDisable/g,disable()?'disabled':'').replace('validateStr',validateStr);
                                }
                            },
                            {
                                'title':'description',
                                'field':'description',
                                'required':true,
                                'editor': 'text',
                                'ratio':4/6,
                                'width':0.333,
                                'length':30
                            }
                        ]
                    },
                    'selectTemp': {
                        'left': _.map({pushMessage:['templatePushId','pushImage'],listing:['templateListId','listingImage'],activityHistory:['activityHistoryId','activityHistoryImage']},function(v,k){
                            return {
                                'required':true,
                                'title':k,
                                'field':v[0],
                                'ratio':1/1.2,
                                'width':0.333,
                                'list': _.map(lookupService('maintainTemplate'),function(i){return {id: i.id,name: i.description,src: i[v[1]]};}),
                                'helper': function(list,id,field){
                                    return helper.value(_.find(list,{id:id}),field);
                                },
                                'noTooltip':true,
                                'editor':function(scope,row,$rowStr){
                                    var validateStr = ' ng-class="{\'sino-validate\':' + $rowStr + '.validate(entity,$error)&&showError}" ';
                                    return [
                                        '<div class="select-template" '+(!disable()&&'ng-click="@row@.show(entity,@row@)"')+ validateStr +' tabindex="0">',
                                        '   <div class="title">{{@row@.helper(@row@.list,entity.'+v[0]+',\'name\') || \'&nbsp;\'}}</div>',
                                        '   <img ng-show="!!entity.'+v[0]+'" ng-src="{{@row@.helper(@row@.list,entity.'+v[0]+',\'src\')}}" >',
                                        '   <div ng-show="!entity.'+v[0]+'" class="select-template-content">',
                                        '<div class="select-template-content-top">',
                                        '<i class="fa fa-location-arrow fa-3x fa-rotate-270"></i>',
                                        '</div> ',
                                        '<p>{{\'selectTemp\' | language}}</p>',
                                        '</div>',
                                        '</div>'
                                    ].join('').replace(/@row@/g,$rowStr);
                                },
                                show:selectTemplate(baseDialog,helper,$timeout,v)
                            };
                        })
                    },
                    'topUpAccount': {
                        'left': [
                            {
                                'class':'top-up-account',
                                columns:getColumns(_,helper,disable,method),
                                editor:editorForTopUpAccount(_,$timeout,helper,disable,$scope.available,bodyElement),
                                'addEntity':function(batchToupDetails){
                                    if(batchToupDetails.length < batchToupDetailsMaxLength + 1){
                                        batchToupDetails.push({});
                                    }
                                },
                                reset:function(batchToupDetails){
                                    baseDialog.message(2,'','{{\'clearOriginal\'|language}}','',['ok']).then(function(){
                                        batchToupDetails.length = 0;
                                        batchToupDetails.push({});
                                    });
                                },
                                'import':importFileForTopUpAccount(_,helper,baseDialog,$timeout,dataService),
                                'download':dataService.downloadCSVTemplate
                            }
                        ]
                    }
                };
            }
        };
    }]);

    function selectTemplate(baseDialog,helper,$timeout,v){
        return function(entity,row){
            baseDialog.message(null,'selectTemp',[
                '<div class="select-template inline-block padding-1-1" ng-repeat="st in entity.list" tabindex="0">',
                '	<div class="title">{{st.name}}</div>',
                '	<img ng-src="{{st.src}}" ng-click="entity.select = st.id" ng-dblclick="entity.select = st.id;$ok(\'ok\')">',
                '   <i ng-show="entity.select === st.id" class="img-selected"><i class="fa fa-check-circle fa-2x color-green"></i></i>',
                '</div>'
            ].join(''),{
                list:row.list,
                select:helper.truthValue(helper.value(entity,v[0]) , helper.value(row.list,'0.id'))
            },['ok']).then(function(data){
                $timeout(function(){
                    helper.value(entity,v[0],data.select);
                });
            });
        };
    }

    function validate(helper){
        return function(it,$error,$extend){
            var row = this;
            if(!helper.value(it,[row.field,row.reliant])){
                $error[helper.validateFiled(row.title,$extend)] = {message:'errorMessageAnother'};
            }else{
                delete $error[helper.validateFiled(row.title,$extend)];
            }
        };
    }

    function getColumns(_,helper,disable,method){
        var $filter = angular.element('body').injector().get('$filter');

        function numberDisable(){
            if(disable()){
                return true;
            }else{
                return function(it,row){
                    return !!it[row.reliant];
                };
            }
        }
        return [
            {
                'title':'mobileNumber',
                'field':'mobileNumber',
                'reliant':'tngNumber',
                'width':'15%',
                'editor':'text',
                'disable':numberDisable(),
                'length':16,
                'validate':validate(helper)
            },
            {
                'title':'TNGNumber',
                'field':'tngNumber',
                'reliant':'mobileNumber',
                'width':'18%',
                'editor':'text',
                'disable':numberDisable(),
                'length':20,
                'validate':validate(helper)
            },
            {
                'title':'amount',
                'field':'amount',
                'width':'18%',
                'editor':'text',
                'disable':disable(),
                'required':true,
                'length':24,
                'validate':'float(20,4)'
            },
            {
                'title':'Remark',
                'field':'remark',
                'width':'20%',
                'editor':1,
                'disable':disable(),
                'validate':'length(30)'
            },
            {
                'title':'result',
                'field':'executedResult',
                'width':'13%',
                'hide':method !== 'detail',
                'editor':function(){
                    return [
                        '<div ng-switch="it.executedResult" class="form-control" disabled>',
                        '   <div ng-switch-when="success">'+$filter('maintainStatus')('SUCCESS')+'</div>',
                        '   <div ng-switch-when="failed">'+$filter('maintainStatus')('FAILED')+'</div>',
                        '   <div ng-switch-default>'+$filter('maintainStatus')('PARTIAL_SUCCESS')+'</div>',
                        '</div>'
                    ].join('');
                }
            },
            {
                'title':'description',
                'field':'executedDesc',
                'width':'25%',
                'type': 'maintainStatus',
                'hide':method !== 'detail'
            },
            {
                'title':'$empty$action',
                'field':'action',
                'width':'15%',
                'hide':disable(),
                'editor':function($scope,column,$columnStr){
                    return '<a class="hover" tabindex="0" ng-click="event.fire(\'remove\',$parent.$parent.$error);'+$columnStr+'.click(ngModel,it)">{{\'remove\'|language}}</a>';
                },
                'click':helper.remove
            }
        ];
    }

    function registerGoToBottom(helper,$timeout,scope,bodyElement){
        var paging = helper.event(scope);
        $timeout(function(){
            paging.register('goto',function(){
                $timeout(function(){
                    bodyElement.scrollTop(bodyElement[0].scrollHeight);
                },300);
            });
        },1000);
        return paging;
    }

    function editorForTopUpAccount(_,$timeout,helper,disable,available,bodyElement){
        return function(scope,row,$rowStr){
            scope.paging = registerGoToBottom(helper,$timeout,scope,bodyElement);
            scope.amountTotal = function(list,$error){
                var sum =  _.sum(_.map(list,function(i){return parseFloat(i.amount) || 0;}));
                if(available){
                    scope.numberavailable = available.replace(/[$,HK]/g,'');
                }
                if(!disable() && sum > parseFloat(scope.numberavailable)){
                    $error.overAmountTotal = {message:'errorOverAvailableBalance'};
                }else {
                    delete $error.overAmountTotal;
                }
                return Math.floor(sum*100)/100;
            };
            return  [
                '<div class="col-md-7 top-up-btn text-center">',
                '   <div class="col-md-4">',
                disable()?'':('<a class="btn btn-default-default" tabindex="0" ng-click="'+$rowStr+'.addEntity(entity.batchToupDetails);paging.fire(\'goto\',-1);">{{\'addNew\'|language}}</a>'),
                '       <div>{{\'numberOfRecords\'|language}}:{{entity.batchToupDetails.length}}</div>',
                '   </div>',
                '   <div class="col-md-4">',
                disable()?'':('<a class="btn btn-default-default" tabindex="0" ng-click="'+$rowStr+'.import(entity,paging)">{{\'import\'|language}}</a>'),
                '   <div ng-class="{\'sino-validate\':$error.overAmountTotal}"',
                '       title="{{$error.overAmountTotal.message|translator:$error.overAmountTotal.parameters}}">',
                '       {{\'totalAmount\'|language}}:{{amountTotal(entity.batchToupDetails,$error)|money}}</div>',
                '   </div>',
                '   <div class="col-md-4 top-up-link">',
                    disable()?'':'<button class="btn btn-default-default" tabindex="0" ng-click="'+$rowStr+'.reset(entity.batchToupDetails)">{{\'reset\'|language}}</button>',
                '       <a class="col-md-5" tabindex="0" ng-click="'+$rowStr+'.download()">{{\'downloadTemplate\'|language}}</a>',
                '   </div>',
                '</div>',
                '<div sino-table="'+$rowStr+'.columns" ng-model="entity.batchToupDetails" event="paging"></div>',
                disable()?'':('<a class="btn btn-default-default right" tabindex="0" ng-click="'+$rowStr+'.addEntity(entity.batchToupDetails);paging.fire(\'goto\',-1);">{{\'addNew\'|language}}</a>')
            ].join('');
        };
    }

    function importFileForTopUpAccount(_,helper,baseDialog,$timeout,dataService){
        return function(entity,paging){
            baseDialog.message(2,'','{{\'coverOriginal\'|language}}','',['ok']).then(function(){
                angular.element('<input type="file" accept=".csv">').change(changeValue).click();
            });

            function changeValue(e){
                angular.forEach(e.target.files,function(i){
                    dataService.import(i).then(function(items){
                        $timeout(function() {
                            if(entity.batchToupDetails.length + items.length < batchToupDetailsMaxLength + 1) {
                                entity.batchToupDetails.length = 0;
                                [].push.apply(entity.batchToupDetails, items);
                                $timeout(function(){
                                    paging.fire('goto',-1);
                                },100);
                            }else{
                                baseDialog.message(3,'','{{\'overLength\'|language}}');
                            }
                        });
                    });
                });
            }
        };
    }

})(window.angular);
