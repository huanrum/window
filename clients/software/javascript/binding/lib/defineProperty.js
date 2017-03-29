/**
 * Created by Administrator on 2017/3/2.
 */
(function (binding) {
    'use strict';

    binding.defineProperty = function(template,element,data,field,value){
        if(typeof binding.$value(data,value) === 'function'){
            binding.$value(element,field,function(){
                binding.$value(data,value).apply(data,arguments);
            });
        }else {
            template[value] = template[value] || [];
            template[value].push(function(val){
                binding.$value(element,field,val);
            });
            binding.$value(element, field, binding.$value(data, value));
            if (template[value].length === 1) {
                Object.defineProperty(data, value, {
                    set: function (val) {
                        binding.foreach(template[value], function (fn) {
                            fn(val);
                        });
                    },
                    get: function () {
                        return binding.$value(element, field);
                    }
                });
            }
            if (field === 'value') {
                element.onkeyup = function () {
                    binding.$value(data, value, binding.$value(element, field));
                };
            }
        }
    };

})(window.binding);
