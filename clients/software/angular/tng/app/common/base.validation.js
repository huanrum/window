(function (window, angular, _) {
    'use strict';

    function EventTopUp(scope){
        var list = {};
        this.register = function(key,fn){
            list[key] = list[key] || [];
            list[key].push(fn);
        };
        this.fire = function(key){
            var args = [].slice.call(arguments,1,arguments.length);
            angular.forEach(list[key],function(fn){
                fn.apply(scope,args);
            });
        };
    }

    function myBrowser(){
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
            return "Opera";
        } //判断是否Opera浏览器
        if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
        } //判断是否Firefox浏览器
        if (userAgent.indexOf("Chrome") > -1){
            return "Chrome";
        }
        if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        } //判断是否Safari浏览器
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        } //判断是否IE浏览器
    }


    function fill(ent, tempField, run, val) {
        if (!/\[\d+\]/.test(tempField)) {
            if (run) {
                ent = ent[tempField] = (angular.isDefined(val) ? val : ent[tempField] || {});
            } else {
                return ent[tempField];
            }
        } else {
            var fieldT = tempField.replace(/\[\d+\]/g, '');
            if(fieldT){
                ent = ent[fieldT] = ent[fieldT] || [];
            }
            angular.forEach(tempField.match(/\[\d+\]/g), function (v, i, list) {
                v = v.replace('[', '').replace(']', '');
                if (i < list.length - 1) {
                    ent = ent[v] = ent[v] || [];
                } else {
                    if (run) {
                        ent = ent[v] = (angular.isDefined(val) ? val : ent[v] || {});
                    } else {
                        return ent[v];
                    }
                }
            });
        }
        return ent;
    }

    function and(scale){
        scale = scale || 2;
        return function(){
            var result = toArray(arguments[0]);
            for(var i=1;i<arguments.length;i++){
                result = compare(result,toArray(arguments[i]));
            }
            var numberValue = 0;
            for (var j = result.length;j>0;j--){
                numberValue = numberValue * scale + result[j - 1];
            }
            return numberValue;
        };
        function compare(list1,list2){
            var result = [];
            for(var i=0;i<Math.max(list1.length,list2.length);i++){
                result.push(list1[i] === list2[i]?list1[i]:0);
            }
            return result;
        }
        function toArray(value){
            var list = [];
            while(value > 0){
                list.push(value % scale);
                value = Math.floor(value / scale);
            }
            return list;
        }
    }

    function eventTopUp(scope){
        return new EventTopUp(scope);
    }

    angular.module('cms.common').value('helper', {
        browser:myBrowser(),
        event:eventTopUp,
        language:function(){
            var result = 'en',$global = angular.element('body').injector().get('$global');
            angular.forEach($global.languageList,function(v,k){
                if(v === $global.language){
                   result = k;
                }
            });
            return result;
        },
        and:function(){
            return and(2).apply(null,arguments);
        },
        eq:function(val1,val2,array){
            if(array && array.indexOf(val1) !== -1 && array.indexOf(val2) !== -1){
                return true;
            }else{
                return val1 === val2;
            }
        },
        compare: function (obj1, obj2) {
            var self = this;
            return _.some(obj2, function (v, k) {
                if (angular.isObject(v)) {
                    return self.compare(obj1[k], v);
                } else {
                    return v !== obj1[k] && (v || obj1[k]);
                }
            });
        },
        validateFiled:function(title,extend){
            if(extend){
                return title + '@'+extend+'@';
            }else{
                return title.replace(/@.*@/,'');
            }
        },
        replace: function (str, replaces) {
            angular.forEach(replaces, function (v, k) {
                str = str.replace(k, v);
            });
            return str;
        },
        everyTrue:function(){
            for(var i=0;i<arguments.length;i++){
                if(!arguments[i]){
                    return false;
                }
            }
            return true;
        },
        truthValue:function(){
            for(var i=0;i<arguments.length;i++){
                if(arguments[i]){
                    return arguments[i];
                }
            }
        },
        value: function (obj, field, value) {
            if(!obj){
                return;
            }
            if(angular.isArray(field)){//获取一个真值
                for(var i=0;i<field.length;i++){
                    if(angular.isNumber(obj[field[i]]) || obj[field[i]]){
                        return obj[field[i]];
                    }
                }
                if(!angular.isObject(obj)){
                    return obj;
                }else{
                    return null;
                }
            }
            field = field || '';
            var fields = field.trim().split('.');
            while (fields.length > 1) {
                if (!fields[0].trim()) {
                    fields.shift();
                } else {
                    obj = fill(obj, fields.shift(), true);
                }
            }
            if (angular.isDefined(value)) {
                fill(obj, fields.shift(), true, value);
            } else {
                return fill(obj, fields.shift(), false);
            }
        },
        remove:function(list,item){
            var listTemp = _.filter(list,function(i){return i!==item;});
            list.length = 0;
            [].push.apply(list,listTemp);
        },
        sort:function(list,key){
            var self = this,keyFn = angular.isFunction(key)?key:function(item){return self.value(item,key);};
            return _.map(_.map(list,keyFn).sort(),function(k){
                return _.find(list,function(i){return k === keyFn(i);});
            });
        },
        upperFirstChar: function(prefix, str) {
            if (str && angular.isString(str)) {
                return prefix + str[0].toLocaleUpperCase() + str.slice(1);
            } else {
                return '';
            }
        },
        arrayToObject: function(data, primaryKey, to) {
            var self = this;
            if (angular.isArray(data)) {
                return _.zipObject(_.map(data, function (i, index) {
                    if (angular.isObject(i)) {
                        if (angular.isFunction(to)) {
                            to(i);
                        } else {
                            i[to || '$back'] = self.value(i,[primaryKey ,'id', 'value', 'code']) || 0;
                        }
                        return self.value(i,[primaryKey , 'id', 'value', 'code']) || 0;
                    } else {
                        return index;
                    }
                }), _.map(data));
            } else {
                return data;
            }
        },
        permissionSum:function(value,list){
            var self = this;
            if(list){
                return _.map(_.filter(list, function (i) {
                    return self.and(value, i.id);
                }), function (i) {
                    return i.id;
                });
            }else{
                return _.sum(_.map(value.split(','),function(i){
                    return parseInt(i);
                }));
            }
        },
        readFile:function(file,callback,errorback){
            var reader = new FileReader();
            reader.onabort = errorback;
            reader.onerror = errorback;
            reader.onload = function(e) {
                callback(e,reader.result);
            };
            if(/^image/.test(file.type)){
                reader.readAsDataURL(file);
            }else{
                reader.readAsText(file,'UTF-8');
            }
        }
    });


    angular.module('cms.common').factory('validationService', ['helper',function (helper) {

        var regex = {
            undefined:/\S/,
            en:{test:function(str){return !/[\u4e00-\u9fa5]+/.test(str);}},
            zhCn:/\S/,
            zhTw:/\S/,
            password:/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/,
            email:/^(?=\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$).{0,90}$/i,
            phone:/((^\d{11}$)|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d))$)/i,
            code:/^\w{1,20}$/
        };

        function runRegex(entity, $error,$extend,row,length,language){
            if(length && helper.value(entity,row.field)){
                if(helper.value(entity,row.field).length > length){
                    $error[helper.validateFiled(row.title,$extend)] ={message:'errorMessageOverLength',parameters:{length:length}} ;
                    return true;
                }else if(!regex[language].test(helper.value(entity,row.field))){
                    $error[helper.validateFiled(row.title,$extend)] = {message:'errorMessageChar',parameters:{language:language,length:length}};
                    return true;
                }else{
                    delete $error[helper.validateFiled(row.title,$extend)];
                }
            }
        }

        return {
            'required':requiredValidate(helper),
            'length': lengthValidate(helper,runRegex),
            'email':emailValidate(helper,runRegex,regex),
            'phone':phoneValidate(helper,runRegex,regex),
            'number':numberValidate(helper),
            'float':floatValidate(helper),
            'regex':regexValidate(helper),
            'password':passwordValidate(helper,runRegex,regex),
            'rePassword':rePasswordValidate(helper),
            'functionRole':functionRoleValidate(helper,runRegex,regex)
        };
    }]);


    function requiredValidate(helper) {
        return function (entity, $error,$extend) {
            var row = this;
            if (!helper.value(entity, row.field)) {
                $error[helper.validateFiled(row.title,$extend)] = {message: 'errorMessageIsRequired'};
                return true;
            } else {
                delete $error[helper.validateFiled(row.title,$extend)];
            }
        };
    }
    function lengthValidate(helper,runRegex) {
        return function (length, language) {
            return function (entity, $error,$extend) {
                runRegex(entity, $error, $extend,this, length, language);
            };
        };
    }
    function emailValidate(helper,runRegex,regex) {
        return function (length) {
            return function (entity, $error,$extend) {
                var row = this;
                if (!runRegex(entity, $error, row, length)) {
                    if (!regex.email.test(helper.value(entity, row.field))) {
                        $error[helper.validateFiled(row.title,$extend)] = {message: 'errorMessageEmail'};
                    } else {
                        delete $error[helper.validateFiled(row.title,$extend)];
                    }
                }
            };
        };
    }
    function phoneValidate(helper,runRegex,regex) {
        return function (length) {
            return function (entity, $error,$extend) {
                var row = this;
                if (!runRegex(entity, $error, row, length)) {
                    if (!regex.phone.test(helper.value(entity, row.field))) {
                        $error[helper.validateFiled(row.title,$extend)] = {message: 'errorMessagePhone'};
                    } else {
                        delete $error[helper.validateFiled(row.title,$extend)];
                    }
                }
            };
        };
    }
    function functionRoleValidate(helper,runRegex,regex) {
        return function (length) {
            return function (entity, $error,$extend) {
                var row = this;
                if (!runRegex(entity, $error, row, length)) {
                    if (!regex.code.test(helper.value(entity, row.field))) {
                        $error[helper.validateFiled(row.title,$extend)] = {message: 'errorMessageCode'};
                    } else {
                        delete $error[helper.validateFiled(row.title,$extend)];
                    }
                }
            };
        };
    }
    function numberValidate(helper) {
        return function (length) {
            return function (entity, $error,$extend) {
                var row = this;
                if (!new RegExp('^[0-9]{1,' + length + '}$').test(helper.value(entity, row.field))) {
                    $error[helper.validateFiled(row.title,$extend)] = {message: 'errorMessageNumber', parameters: {bit: length}};
                } else {
                    delete $error[helper.validateFiled(row.title,$extend)];
                }
            };
        };
    }
    function floatValidate(helper) {
        return function (length, length2) {
            return function (entity, $error,$extend) {
                var row = this;
                if (!new RegExp('^[0-9]{0,' + length + '}(\\.[0-9]{0,' + length2 + '})?$').test(helper.value(entity, row.field))) {
                    $error[helper.validateFiled(row.title,$extend)] = {message: 'errorMessageFloat', parameters: {bit: length, float: length2}};
                } else {
                    delete $error[helper.validateFiled(row.title,$extend)];
                }
            };
        };
    }
    function regexValidate(helper) {
        return function ($regex, errorMessage) {
            return function (entity, $error,$extend) {
                var row = this;
                if (!helper.value(entity, row.field)) {
                    $error[helper.validateFiled(row.title,$extend)] = {message: 'errorMessageIsRequired'};
                    return true;
                } else if (!$regex.test(helper.value(entity, row.field))) {
                    $error[helper.validateFiled(row.title,$extend)] = {message: errorMessage};
                    return true;
                } else {
                    delete $error[helper.validateFiled(row.title,$extend)];
                }
            };
        };
    }
    function passwordValidate(helper,runRegex,regex) {
        return function () {
            return function (entity, $error,$extend) {
                var row = this;
                if (helper.value(entity, row.field) && !regex.password.test(helper.value(entity, row.field))) {
                    $error[helper.validateFiled(row.title,$extend)] = {message: 'errorPasswordIn'};
                    return true;
                } else if (helper.value(entity, row.field) === helper.value(entity, row.related) && angular.isDefined(helper.value(entity, row.related))) {
                    $error[helper.validateFiled(row.title,$extend)] = {message: 'newSameAsOld'};
                } else {
                    delete $error[helper.validateFiled(row.title,$extend)];
                }
            };
        };
    }
    function rePasswordValidate(helper) {
        return function () {
            return function (entity, $error,$extend) {
                var row = this;
                if (!helper.eq(helper.value(entity, row.field), helper.value(entity, row.related), ['', null, undefined])) {
                    $error[helper.validateFiled(row.title,$extend)] = {message: 'twoDifferent'};
                    return true;
                } else {
                    delete $error[helper.validateFiled(row.title,$extend)];
                }
            };
        };
    }

})(window, window.angular,window._);