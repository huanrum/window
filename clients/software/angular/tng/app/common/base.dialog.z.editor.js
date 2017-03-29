(function (angular) {
    'use strict';

    function getNgModelString($scope,row,field,disabled){
        return ' class="form-control" ng-model="entity' + $scope.initField(field) + '" '+(row.length?('maxlength="'+row.length+'" '):'') + ($scope.option.getDisabled && $scope.option.getDisabled(row) && (disabled||'readonly'))+' '+ (row.enter && 'ng-keydown="enter($event,\''+row.enter+'\')"') + ' sino-use-id ';
    }
    function getNgChangeString(row,$rowStr) {
        if (row) {
            return ' ng-change="' + $rowStr + '.change" ng-class="{\'sino-validate\':' + $rowStr + '.validate(entity,$error)&&showError}" placeholder="{{\'' + (row.editorInfo || '') + '\'|language}}" title="{{\'' + (row.tooltip || '') + '\'|language}}" ';
        } else {
            return ' ng-change="'+ $rowStr + '.change(entity,rows)" ng-class="{\'sino-validate\':' + $rowStr + '.validate(entity,$error)&&showError}" ';
        }
    }
    function createValueEditorForArray(_,$scope,row,$rowStr){
        if($scope.option.getDisabled && $scope.option.getDisabled(row)){
            var ngModel = $scope.$eval('entity' + $scope.initField(row.field));
            var item = _.find(row.editor,function(op,$index){return (''+ngModel) === ((op.id || op.value || op.code|| $index) +'');});
            return '<div class="form-control" sino-tooltip="'+!row.noTooltip+'" disabled>{{\'' +(item?(item.title||item.name||item):'') +'\'|language}}</div>';
        }else{
                $scope.readyList.push(function(){
                    if(row.default !== false){
                        $scope.helper.value($scope.entity,row.field,($scope.helper.value($scope.entity,row.field)||($scope.helper.value(row.editor[0],['id','value','code']) || 0))+'');
                    }
                    if(row.change){
                        row.change($scope.entity,$scope.rows);
                    }
                });
            return '<select sino-tooltip="'+!row.noTooltip+'" ' + getNgModelString($scope,row,row.field,'disabled') + getNgChangeString(null,$rowStr)+'><option ng-repeat="op in ' + $rowStr + '.editor" value="{{op.id || op.value || op.code|| $index}}">{{op.title||op.name||op| language}}</option></select>';
        }
    }
    function createValueEditorForDefault(_,$scope,row,$rowStr){
        if(row.type){
            if(/^\$html\$/.test(row.type)){
                var filter = row.type.replace(/^\$html\$/,'').replace(/\(.*\)/,'');
                var formatter = /\((.*)\)/.exec(row.type);
                return '<div class="form-control" sino-tooltip="'+!row.noTooltip+'" disabled>'+angular.element('body').injector().get('$filter')(filter)($scope.helper.value($scope.entity,row.field),formatter&&formatter[1])+'</div>';
            }else if((row.editor && /^sino-/.test(row.editor))){
                return '<div class="form-control" sino-tooltip="'+!row.noTooltip+'" '+getNgModelString($scope,row,row.field)+getNgChangeString(row, $rowStr) + row.editor + '="'+$rowStr+'.mime">{{entity' + $scope.initField(row.field) + '|'+row.type+'}}</div>';
            }else{
                return '<div class="form-control" sino-tooltip="'+!row.noTooltip+'" disabled>{{entity' + $scope.initField(row.field) + '|'+row.type+'}}</div>';
            }
        }else{
            return '<input sino-tooltip="'+!row.noTooltip+'" ' + getNgModelString($scope,row,row.field) + getNgChangeString(row, $rowStr) + (/^sino-/.test(row.editor) ? (row.editor + '="'+$rowStr+'.mime"') : ('type="' + row.editor + '"'))+ '>';
        }
    }
    function createValueEditor(_,$scope,row,$rowStr){
        if(angular.isArray(row.field)){
            return row.field.map(function (field) {
                return [
                    '<div class="some-field col-md-' + (Math.floor(12 / row.field.length)) + '">',
                    '	<input sino-tooltip="'+!row.noTooltip+'" '+getNgModelString($scope,row,field) + (row.editor && (row.editor + '=' + $rowStr + '.change') || '') + getNgChangeString(row,$rowStr)+'>',
                    '</div>'
                ].join('');
            });
        }else {
            switch (Object.prototype.toString.apply(row.editor)) {
                case '[object Function]':
                    return row.editor($scope,row,$rowStr,{getNgModelString:getNgModelString,getNgChangeString:getNgChangeString});
                case '[object Array]':
                    return createValueEditorForArray(_,$scope,row,$rowStr);
                case '[object Object]':
                    return '<input sino-multiple="' + $rowStr + '.editor" ' + getNgModelString($scope,row,row.field) + getNgChangeString(row,$rowStr)+ '>';
                case '[object Number]':
                    return '<textarea sino-tooltip="'+!row.noTooltip+'" rows="' + row.editor + '" ' + getNgModelString($scope,row,row.field) +' '+ getNgChangeString(row, $rowStr) + '></textarea>';
                default:
                    if(row.field){
                        return createValueEditorForDefault(_,$scope,row,$rowStr);
                    }else {
                        return row.content || '<div></div>';
                    }
            }
        }
    }
    function createRows($scope, rows, rowStr,parentEl,_,validateService) {
        if (angular.isArray(rows)) {
            createRowsForArray($scope, rows, rowStr,parentEl,_,validateService);
        } else{
            if(!$scope.showRow || $scope.showRow(rows) || $scope.occupied !== false){
                createRow($scope, parentEl,rows, rowStr,_,validateService);
            }
        }
    }
    function createRowsForArray($scope, rows, rowStr,parentEl,_,validateService){
        var parentEls = parentEl,percent = 1.01;
        angular.forEach(rows, function (row, index) {
            if(angular.isNumber(row)){//row为数字时表示这个row是占位用
                row = {hide:true,width:row};
            }else if(angular.isString(row)){//row为字符串时表示这个是row的内容
                row = {content:row};
            }
            if(!$scope.showRow || $scope.showRow(row)|| $scope.occupied !== false || angular.isFunction(row.hide)){
                if($scope.isFlow){
                    forIsFlow(row);
                    if($scope.showRow&&!$scope.showRow(row) && $scope.occupied === undefined && !angular.isFunction(row.hide)){
                        return;
                    }
                }
                createRow($scope, parentEls,row, rowStr + '[' + index + ']',_,validateService);
            }
        });
        function forIsFlow(row){
            row.width = row.width || 1;
            if(percent + row.width > 1){
                //如果一整行都隐藏了，那就不需要占位了
                if(parentEls.children().length && !_.some(parentEls.children(),function(i){return angular.element(i).css('visibility') !== 'hidden';})){
                    parentEls.remove();
                }
                parentEls = angular.element('<div class="group-row"></div>').appendTo(parentEl);
                percent = row.width;
            }else{
                percent += row.width;
            }
        }
    }
    function createRow($scope, parentEl,row, $rowStr,_,validateService) {
        var isOccupied = $scope.occupied&&($scope.showRow&&!$scope.showRow(row));
        row.editorInfo = row.editorInfo || '';
        row.tooltip = row.tooltip || '';
        row.validate = defaultValidate($scope,row,_,validateService,row.validate);
        return $scope.createCommon($scope,parentEl, row,$rowStr).html(createValueEditor(_,$scope,row,$rowStr)).parent().css('visibility',isOccupied&&'hidden'||'');
    }
    function getRunRowValidate(validateService,rowValidate,row){
        return function (){
            if(angular.isFunction(rowValidate)){
                rowValidate.apply(row,arguments);
            }else if(angular.isNumber(rowValidate)){
                validateService.length(rowValidate).apply(row,arguments);
            }else if(angular.isString(rowValidate)){
                var splitStrings = rowValidate.split(/[\(\)]/);
                validateService[splitStrings[0]].apply(validateService,splitStrings[1] && splitStrings[1].split(',') || []).apply(row,arguments);
            }
        };
    }
    function defaultValidate($scope,row,_,validateService,rowValidate) {
        if (row.required) {
            return function (entity, $error,$extend) {
                var title = $scope.helper.validateFiled(row.title,$extend);
                var value = $scope.helper.value(entity, row.field);
                var isRequired = $scope.helper.truthValue((angular.isArray(row.field) && !_.some(row.field,function(i,index){return $scope.helper.value(entity[index], row.field[index].replace('['+index+']',''));})) , !value , !(''+value).trim());
                if((angular.isFunction(row.hide) && row.hide(entity, row)) || (!isRequired && !rowValidate)){
                    delete $error[title];
                }else if (isRequired) {
                    var editorTitle = {url:'regexUrl',email:'regexEmail',file:'regexFile'}[row.editor];
                    $error[title] = {message:'errorMessageIsRequired'+(editorTitle?('-'+editorTitle):'')};
                } else if(rowValidate) {
                    getRunRowValidate(validateService,rowValidate,row).apply(null,arguments);
                }
                angular.forEach($scope.blurList,function(i){i(row);});
                return !! $error[title];
            };
        }else{
            return function(entity, $error,$extend){
                var title = $scope.helper.validateFiled(row.title,$extend);
                if(angular.isFunction(row.hide) && row.hide(entity, row)){
                    delete $error[title];
                }else if(rowValidate){
                    getRunRowValidate(validateService,rowValidate,row).apply(null,arguments);
                }
                angular.forEach($scope.blurList,function(i){i(row);});
                return !! $error[title];
            };
        }
    }

    function addElementForParse($injector,$scope,bodyElement,rows,key,validateService){
        var $ = angular.element;
        var _ = $injector.get('_'),$timeout = $injector.get('$timeout'),$filter = $injector.get('$filter');
        var groupClass = 'group-' + key.toLocaleLowerCase().replace(/\$empty\$/g,'').replace(/\$/g,'-').replace(/\-\-/g,'-');
        var group = $('<div class="group group-border '+ groupClass +'"><label ng-show="'+!!$filter('language')(key)+'">{{\''+key+'\'|language}}</label><div class="group-values"></div></div>').appendTo(bodyElement);
        var arrayRowsChild = _.filter(rows, function (i) {return angular.isArray(i);}), widthChild = 'style="width:' + (99 / arrayRowsChild.length).toFixed(2) + '%;"';

        angular.forEach(rows, function (rs, k) {
            if(angular.isArray(rs)){
                createRows($scope, rs, 'rows.' + key+'.'+k,$('<div class="inline-table" ' + widthChild + '></div>').appendTo(group.find('.group-values')),_,validateService);
            }else if(_.some(rs,function(i){return !angular.isArray(i);})){
                createRows($scope, rs, 'rows.' + key+'.'+k,group.find('.group-values'),_,validateService);
            }else{
                var tabPanel = $('<div class="tab-header"></div><div class="tab-content"></div>').appendTo(group.find('.group-values'));
                var tabOver = $('<div class="right" tabindex="0" ng-mouseenter="rows.' + key+'.'+k+'.over = true" ng-mouseleave="rows.' + key+'.'+k+'.over = false"><a class="fa fa-ellipsis-h"></a><div ng-show="rows.' + key+'.'+k+'.over" class="over-content"></div></div>').appendTo(tabPanel.filter('.tab-header'));
                angular.forEach(rs,function(rcs,tab){
                    $('<div class="tab" tabindex="0" ng-click="rows.' + key+'.'+k+'.active=\''+tab+'\'" ng-class="{\'active\':rows.' + key+'.'+k+'.active===\''+tab+'\'}">{{\''+tab+'\'|language}}</div>').appendTo(tabPanel.filter('.tab-header'));
                    createRows($scope, rcs, 'rows.' + key+'.'+k +'[\''+tab+'\']',$('<div ng-show="rows.' + key+'.'+k+'.active===\''+tab+'\'"></div>').appendTo(tabPanel.filter('.tab-content')),_,validateService);
                });
                $scope.readyList.push(function(){
                    var width = 0;
                    var overTabs = _.filter(tabPanel.filter('.tab-header').children(),function(child){
                        width += child.offsetWidth;
                        if(width > tabPanel.width()){
                            return child;
                        }
                    });
                    if(overTabs.length){
                        tabOver.find('.over-content').append(overTabs);
                    }else{
                        tabOver.remove();
                    }
                    angular.forEach(_.keys(rs),function(tab,index,list){
                        $timeout(function(){
                            rs.active = tab;
                            $timeout(function(){
                                rs.height = Math.max(rs.height||0,tabPanel.filter('.tab-content').height());
                                if(index === list.length-1){
                                    rs.active = list[0];
                                    tabPanel.filter('.tab-content').children().css('height', rs.height);
                                }
                            },index * 10 + 2);

                        },index * 10);
                    });
                });
            }
        });
    }
    function isFlow(_,rows){
        return _.some(rows,function(rs){
            if(rs && angular.isObject(rs)){
                if('field' in rs){
                    return rs.width > 0 && rs.width < 1;
                }else{
                    return isFlow(_,rs);
                }
            }
        });
    }
    function getDisabled(helper,item,type,options){
        return function(row){
            if((options.disable && options.disable(item,type,row))){
                return true;
            }else{
                return helper.truthValue(options.method === 'view' , !row.editor , row.disable);
            }
        };
    }
    function runContent(options,item,bodyElement,create){
        var rowsData = angular.isFunction(options.rows)?options.rows(item,bodyElement):options.rows;
        if(rowsData.then){
            return rowsData.then(function(date){
                create(date);
            });
        }else{
            create(rowsData);
        }
    }
    function addElement(bodyElement,item,children){
        if(angular.isFunction(children)){
            children = children(item);
        }
        bodyElement.append(angular.element(children));
    }
    function show($scope,options,helper){
        return function(row){
            return !(helper.truthValue(row.hide ,options.hideRow && options.hideRow($scope.entity,row,$scope.option),angular.isFunction(row.hide)));
        };
    }
    angular.module('cms.common').factory('baseDialogEdit', ['_','$filter','helper','$injector','$timeout','validationService',function (_,$filter,helper,$injector,$timeout,validateService) {
        return function(title, options, item, type,actions) {
            if(angular.isString(options)){
                options = $injector.get(options);
            }
            return this.createDialog({
                'title': title,
                'class': 'fa fa-edit',
                'type': helper.truthValue(type , 'edit'),
                'actions': helper.truthValue(actions ,(type ? ['ok'] : ['ok', 'cancel'])),
                'collectEntity':options.collectEntity,
                'getDisabled':getDisabled(helper,item,type,options),
                'focus':options.focus
            }, item, addContent);

            function addContent($scope, bodyElement){
                runContent(options,item,bodyElement,function(rows){
                    $scope.defaultRatio = options.defaultRatio;
                    $scope.rows = rows;
                    $scope.occupied = options.occupied;
                    $scope.showRow = show($scope,options,helper);
                    $scope.isFlow = isFlow(_,$scope.rows);
                    bodyElement.css('width', helper.truthValue(options.width , 520));
                    bodyElement.addClass(helper.truthValue(options['class'] ,''));
                    addElement(bodyElement,item,options.header);
                    if (angular.isArray($scope.rows)) {
                        createRows($scope, $scope.rows, 'rows',bodyElement,_,validateService);
                    } else if (angular.isObject($scope.rows)) {
                        if(_.every($scope.rows,angular.isArray)){
                            var arrayRows = _.filter($scope.rows, function (i) {return angular.isArray(i);}), width = 'style="width:' + (99 / arrayRows.length).toFixed(2) + '%;"';
                            angular.forEach($scope.rows, function (rows, key) {
                                createRows($scope, rows, 'rows.' + key,angular.isArray(rows)?angular.element('<div class="inline-table" ' + width + '></div>').appendTo(bodyElement):bodyElement,_,validateService);
                            });
                        }else{
                            angular.forEach($scope.rows, function (rows, key) {
                                if(_.some(rows, function(rs){return _.some(rs,show($scope,options,helper));})){
                                    addElementForParse($injector,$scope,bodyElement,rows,key,validateService);
                                }
                            });
                        }
                    }
                    addElement(bodyElement,item,options.footer);
                    $scope.readyList.push(function(){
                        var backEntity = JSON.parse(JSON.stringify($scope.entity));
                        $scope.blurEntity = function(){
                            return helper.compare(backEntity,$scope.entity);
                        };
                    });
                });
            }
        };
    }]);

})(window.angular);
