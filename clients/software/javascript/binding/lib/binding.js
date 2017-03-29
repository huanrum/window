/**
 * Created by Administrator on 2017/3/2.
 */
(function () {
    'use strict';

    var loadList = [];

    window.addEventListener('load',function(){
        window.binding.foreach(loadList,function(fn){
            fn();
        });
    });

    function Binding(element,data){
        this.get = function(){return element;};
        this.data = function(){return data;};
        this.appendTo =function(parent){parent.appendChild(element);};
    }

    function createElement(string){
        var parent = document.createElement('div');
        parent.innerHTML = string;
        return parent.children[0];
    }

    window.binding = function(element,data,template){
        if(typeof element === 'function'){
            loadList.push(element);
        }else if(typeof element === 'string'){
            element = createElement(element);
        }
        setTimeout(function(){
            template = template || {};
            window.binding.foreach(element.attributes,function(attr,i){
                if(/^\[.+\]$/.test(attr.name)){
                    window.binding.defineProperty(template,element,data,window.binding.$name(attr.name.slice(1,-1)),attr.value);
                }else if(/^\(.+\)$/.test(attr.name)){
                    window.binding.watch(element,data,window.binding.$name(attr.name.slice(1,-1)),attr.value);
                }
            });
            window.binding.foreach(element.children,function(child){
                window.binding(child,data,template);
            });
        },10);

        element.scope = function(){return data; };
        element.data = function(){return JSON.parse(JSON.stringify(data)||'null'); };
        return new Binding(element,data);
    };

    window.binding.foreach = function (array,fn){
        for(var i =0,len = array && array.length;i<len;i++){
            fn(array[i],i,array);
        }
    };

    window.binding.$name = function(name){
        var replaces = {
                class:'className',
                fontsize:'fontSize',
                innerhtml:'innerHTML'
        };
        var fileds = Object.keys(replaces);
        window.binding.foreach(Object.keys(replaces),function(field){
            name = name.replace(field,replaces[field]);
        });
        return name;
    };

    window.binding.$value = function (obj, field, value) {
        if (!obj) {
            return;
        }
        if (field instanceof Array) {//获取一个真值
            for (var i = 0; i < field.length; i++) {
                if ((typeof obj[field[i]] === 'number') || obj[field[i]]) {
                    return obj[field[i]];
                }
            }
            if (!(typeof obj === 'object')) {
                return obj;
            } else {
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
        if (!(typeof value === 'undefined')) {
            fill(obj, fields.shift(), true, value);
        } else {
            return fill(obj, fields.shift(), false);
        }

        function fill(ent, tempField, run, val) {
            if (!/\[\d+\]/.test(tempField)) {
                if (run) {
                    ent = ent[tempField] = (!(typeof val === 'undefined') ? val : ent[tempField] || {});
                } else {
                    return ent[tempField];
                }
            } else {
                var fieldT = tempField.replace(/\[\d+\]/g, '');
                if(fieldT){
                    ent = ent[fieldT] = ent[fieldT] || [];
                }
                window.binding.foreach(tempField.match(/\[\d+\]/g), function (v, i, list) {
                    v = v.replace('[', '').replace(']', '');
                    if (i < list.length - 1) {
                        ent = ent[v] = ent[v] || [];
                    } else {
                        if (run) {
                            ent = ent[v] = (!(typeof val === 'undefined') ? val : ent[v] || {});
                        } else {
                            return ent[v];
                        }
                    }
                });
            }
            return ent;
        }
    };

})();
