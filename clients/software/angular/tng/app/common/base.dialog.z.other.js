(function (angular) {
    'use strict';

    var icons = ['fa-info-circle', 'fa-check-circle', 'fa-exclamation-circle', 'fa-times-circle'];
    var iconsExtend = ['done-icon', 'succeed-icon', 'warn-icon', 'error-icon'];
    var backgroundExtend = ['background-blue', 'background-blue', 'background-blue', 'background-blue'];
    var titleExtend = ['done-title', 'succeed-title', 'warn-title', 'error-title'];

    function getLevels(_,level){
        if(icons[level]){
            return [{
                'header':backgroundExtend[level],
                'icon':'fa ' + icons[level] + ' ' +iconsExtend[level],
                'title':titleExtend[level]
            }];//标题图标颜色，内容图标颜色
        }else{
            if(!level){
                return [];
            }else if(!angular.isArray(level)){
                return [level];
            }else{
                return _.filter(_.map(level,function(l,index){
                    switch (index){
                        case 0:
                            return icons[l]?{'header':backgroundExtend[level],'icon':'fa ' + icons[level] + ' ' +iconsExtend[level],'title':titleExtend[level]}:l;
                        case 1:
                            return iconsExtend[l] || l;
                        case 2:
                            return icons[l] || l;
                        default:
                            return;
                    }
                }),function(i){return !!i;});
            }
        }
    }
    function getValidateDialog(_,helper,$filter){
        return function($error,action){
            var temp = {};
            if ((!/!/.test(action) && Object.getOwnPropertyNames($error).length) || (/!/.test(action) && _.some($error,function(v){return !/errorMessageIsRequired/.test(v.message);}))) {
                return this(2, '', '<ul class="inline-table list-style-none" >' +
                    ((!/!/.test(action) && _.some($error,function(i){return /errorMessageIsRequired/.test(i.message);}))?createLiError('',{message:'errorMessageIsRequiredAll'}):'') +
                    _.map($error, function (val, key) {
                        if(/errorMessageIsRequired/.test(val.message)){
                            return '';
                        }
                        return createLiError(key,val);
                    }).join('') + '</ul>', {$error: $error},'close[width-6]');
            }
            function createLiError(key,val){
                key = helper.validateFiled(key);
                if(!temp[key]){
                    temp[key] = true;
                    return '<li class="text-left">&nbsp;-&nbsp;' + $filter('language')(key) + ($filter('language')(key)?' : ':'') + $filter('translator')(val.message,val.parameters)+ '</li>';
                }
            }
        };
    }
    angular.module('cms.common').factory('baseDialogMessage', ['_','$filter','$timeout','helper',function (_,$filter,$timeout,helper){

        message.validate  = getValidateDialog(_,helper,$filter);
        return message;

        function message(level, title, messageContent, item, isConfirm, interval) {//0消息，1成功，2警告，3错误
            var titles = ['!done','!succeed','!warning','!error'];
            var levels = getLevels(_,level);

            /* jshint -W040 */
            return this.createDialog({
                'title': helper.truthValue(title,titles[level],'').replace(/^@/,''),
                'class': levels[0],
                'actions': helper.truthValue(angular.isString(isConfirm) && isConfirm && isConfirm.split('/') , isConfirm),
                'type': angular.isString(isConfirm) ? isConfirm : '',
                'interval': interval
            }, item, function ($scope, bodyElement) {
                switch (levels.length){
                    case 3:
                        bodyElement.addClass('text-center');
                        bodyElement.css('width', 480).addClass(helper.truthValue(levels[1] , ''));
                        bodyElement.append('<div class="fa huge3-icon ' + (helper.truthValue(levels[1] , '')) +' '+ (helper.truthValue(levels[2], '')) + '"></div>');
                        break;
                    case 2:
                        bodyElement.addClass('text-center');
                        bodyElement.css('width', 480).addClass(helper.truthValue(levels[1] , ''));
                        break;
                    case 1:
                        bodyElement.addClass('text-center');
                        bodyElement.addClass('padding-2-2').css('min-width', 480);
                        break;
                    case 0:
                        bodyElement.addClass('padding-1-1').css('min-width', 480);
                        break;
                    default:

                        break;
                }
                if(!/^@/.test(title)){
                    bodyElement.append(titles[level] &&  ('<strong>{{\''+title+'\'|language}}</strong>'));
                }
                if(angular.isString(messageContent)){
                    bodyElement.append(''+messageContent+'');
                }
                if(angular.isFunction(messageContent)){
                    messageContent($scope,bodyElement);
                }
                if(angular.isObject(messageContent)){
                    if(messageContent.url){
                        bodyElement.append('<iframe class="default-iframe" src="'+messageContent.url+'" width="'+messageContent.width+'" height="'+messageContent.height+'"></iframe>');
                    }
                    if(messageContent.content){
                        bodyElement.append('<iframe  class="default-iframe" width="'+messageContent.width+'" height="'+messageContent.height+'"></iframe>');
                        $timeout(function(){
                            angular.element(bodyElement.contents().last().get(0).contentDocument.body).append(messageContent.content);
                        },500);
                    }
                }
            });
        }
    }]);


    function createOptions(_,items){
        return _.map(items,function(op,key) {
            return '<option value="' + key + '">' + op + '</option>';
        }).join('');
    }
    function createRowValue(_,$scope,editor,key, index){
        var newField = $scope.initField(key),ngModelString = ' class="form-control" ng-model="entity' + newField + '" ng-keyup="$event.keyCode === 13 && tabTo(' + index + ')" @deleteItem@ sino-use-id';

        if(editor.deleteItem){
            $scope.helper.value($scope,'deleteFns'+newField,editor.deleteItem);
            ngModelString = ngModelString.replace('@deleteItem@','delete-item="'+'deleteFns'+newField+'"');
        }else{
            ngModelString = ngModelString.replace('@deleteItem@','');
        }
        $scope.helper.value($scope,'lookup'+newField,editor[1]);
        if(!editor[0]){
            switch (Object.prototype.toString.apply(editor[1])){
                case '[object Array]':
                    $scope.helper.value($scope,'entity'+newField,$scope.helper.value($scope,'entity'+newField) || editor[1].value || editor[1].id || editor[1]);
                    return '<input '+ngModelString+' sino-select="lookup'+newField+'">';
                case '[object Object]':
                    return '<select '+ngModelString+'>'+ createOptions(_,editor[1])+'</select>';
                default:
                    break;
            }
        }else{
            return '<input type="'+editor[0]+'" '+editor[0] + '="lookup'+newField +'" '+ngModelString+' >';
        }
    }
    angular.module('cms.common').factory('baseDialogAdvanced', ['_',function (_){
        return function(item,getEditor,getTitle) {
            return this.createDialog({
                'title': 'editObject',
                'class': 'fa fa-edit',
                'type': 'edit',
                'actions': ['cancel', 'ok']
            }, item, addContent);

            function addContent($scope, bodyElement,dialog){
                dialog.css('z-index', 999);
                bodyElement.css('width', 600);
                angular.forEach(Object.getOwnPropertyNames(item).sort(function(a){return /ServiceUrl/.test(a);}), function (key, index) {
                    var editor = getEditor?getEditor(key):'text';
                    if (editor) {
                        $scope.createCommon($scope,bodyElement, {title: getTitle&&getTitle(key) || key}).html(function () {
                            return createRowValue(_,$scope,editor,key, index);
                        });
                    }
                });
                $scope.tabTo = function (index) {
                    if (index < bodyElement.children().length - 1) {
                        angular.element(bodyElement.children().get(index + 1)).find('input').focus();
                    } else {
                        $scope.$ok();
                    }
                };
            }
        };
    }]);

    angular.module('cms.common').factory('baseDialogSearch', [function () {
        return function(title, options) {
            return this.createDialog({
                'title': title,
                'class': 'glyphicon glyphicon-search',
                'type': 'search',
                'actions': ['cancel', 'ok']
            }, {}, function ($scope, bodyElement) {
                bodyElement.css('width', 480);
                angular.forEach(angular.isFunction(options.rows)?options.rows({}):options.rows, function (row,index) {
                    $scope.createCommon($scope,bodyElement, row,index).html(function () {
                        return '<input class="form-control" ng-model="entity' + $scope.initField(row.field) + '" sino-use-id>';
                    });
                });
            });
        };
    }]);

    angular.module('cms.common').factory('baseDialogLoading', ['_','$global','$timeout',function (_,$global,$timeout){
        var loading = {};
        return function(config, result) {
            if (!loading.$scope) {
                loading.$scope = {};
                this.createDialog({
                    actions: []
                }, {}, function ($scope, modalBody, dialog) {
                    loading.$scope = $scope;
                    $scope.dataList = [];
                    $scope.removeItem = function (item, interval) {
                        $timeout(function () {
                            $scope.dataList = _.filter($scope.dataList, function (i) {
                                return i !== item;
                            });
                        }, interval || 0);
                    };
                    $scope.$close = function () {
                        loading.$scope.dataList = [];
                    };

                    dialog.attr('ng-show', '!!dataList.length').css('z-index', 998);
                    modalBody.css('overflow','hidden').html([
                        '<div class="position-relative" ng-mouseenter="show = true" ng-mouseleave="show = false">',
                        '	<i class="fa fa-5x fa-spinner fa-pulse color-blue"></i>',
                        '	<a ng-show="show" class="fa fa-2x fa-close middle-center error-icon" ng-click="$close()"></a>',
                        '</div>'
                    ].join(''));
                });
            }
            loading.$scope.dataList = loading.$scope.dataList || [];
            if (!result) {
                loading.$scope.dataList.push({
                    'config': config,
                    'class': 'fa-spinner fa-pulse'
                });
                $timeout(function(){
                    loading.$scope.dataList = _.filter(loading.$scope.dataList,function(i){return i.config !== config;});
                },60*1000);
            } else {
                var item = _.find(loading.$scope.dataList, function (i) {return i.config === config;});
                if(item){
                    if (result.succeed) {
                        item['class'] = 'fa-check color-green';
                        loading.$scope.removeItem(item, 1000);
                    } else {
                        item['class'] = 'fa-remove color-red';
                        item.message = result.message;
                    }
                }
            }
        };
    }]);

    angular.module('cms.common').factory('baseDialogInput', ['$timeout',function ($timeout) {
        return function(title,type,item,size,isReadonly) {
            size = size || {width:480};
            return this.createDialog({
                'title': title || 'Input Dialog',
                'class': 'fa fa-edit',
                'actions': isReadonly ? ['ok'] : ['cancel', 'ok']
            }, item, addContent);

            function addContent($scope, bodyElement){
                var style = 'style="width: 100%;height:'+size.height +'px"';
                bodyElement.css('width', size.width || 480);
                if(typeof type === 'string'){
                    if(type === 'textarea'){
                        bodyElement.html('<textarea sino-textarea ng-model="entity" '+style+'></textarea>');
                    }else{
                        bodyElement.html('<input type="'+type+'" '+type+' ng-model="entity" '+style+'>');
                    }
                }else if(typeof type === 'function'){
                    type($scope, bodyElement);
                }
                $timeout(function(){
                    bodyElement.find('input,textarea,select').focus();
                },500);
            }
        };
    }]);

    angular.module('cms.common').factory('baseDialogGrid', [function () {
        return function(title,columns,items) {
            return this.createDialog({
                'title': title,
                'class': 'fa fa-columns',
                'actions': ['cancel','ok']
            }, items, addContent);

            function addContent($scope, bodyElement){
                bodyElement.html([
                    '<table>',
                    '	<thead>',
                    '		<tr>',
                    columns.map(function(column){
                        return '<th>{{\''+column.split('-').shift()+'\' | language}}</th>';
                    }).join(''),
                    '		</tr>',
                    '	</thead>',
                    '	<tbody>',
                    '		<tr ng-repeat="it in item">',
                    columns.map(function(column){
                        var cols = column.split('-');
                        if(cols.length > 1){
                            if(/^t\$/.test(cols[1])){
                                return '<td>{{it.'+cols.shift()+'| '+cols.pop().slice(2)+'}}</td>';
                            }else{
                                var type = cols.pop();
                                return '<td><input ng-model="it.'+cols.shift()+'" type="'+type+'"  '+type+' ></td>';
                            }
                        }else{
                            return '<td>{{it.'+cols.shift()+'}}</td>';
                        }
                    }).join(''),
                    '		</tr>',
                    '	</tbody>',
                    '</table>'
                ].join(''));
            }
        };
    }]);

})(window.angular);
