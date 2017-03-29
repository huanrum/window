(function(_,Vue){
    'use strict';

    Vue.controller('main/method','fa fa-retweet',function(baseController){

        return baseController({
            data:{
                name:'Method',
                columns:[{title:'id',field:'id'},{title:'title',field:'title'},{title:'date',field:'date'}],
                dataList:[{id:1,title:'-TUT-',date:123},{id:2,title:'-hah-',date:123}]
            },
            methods:{

            }
        });
    });


})(window._,window.Vue);

