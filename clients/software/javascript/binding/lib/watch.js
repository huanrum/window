/**
 * Created by Administrator on 2017/3/2.
 */
(function (binding) {
    'use strict';

    var watchList = {};

    (function watch(){
        binding.foreach(Object.keys(watchList),function(key){
            var newValue = watchList[key].value();
            if(newValue){
                watchList[key].old = newValue;
                binding.foreach(watchList[key].list,function(fn){
                    fn(newValue);
                });
            }
        });
        setTimeout(watch,100);
    })();

    function createWatch(element,data,field,value,fn){
        watchList[value] = watchList[value] || {
                old:binding.$value(data,value),
                value:function(){
                    var d = binding.$value(data,value);
                    var e = binding.$value(element,field);
                    if(e !== this.old){
                        return e;
                    }
                    if(d !== this.old){
                        return d;
                    }
                },
                list:[]
            };
        watchList[value].list.push(fn);
        return watchList[value];
    }

    binding.watch = function(element,data,field,value){
        if(typeof binding.$value(data,value) === 'function'){
            binding.$value(element,field,function(){
                binding.$value(data,value).apply(data,arguments);
            });
        }else {
            binding.$value(element, field, binding.$value(data, value));
            createWatch(element,data,field,value,function(val){
                binding.$value(data,value,val);
                binding.$value(data,value,val);
            });
        }
    };

})(window.binding);
