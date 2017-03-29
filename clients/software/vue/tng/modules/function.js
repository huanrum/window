(function(_,Vue){
    'use strict';

    Vue.controller('main/function','fa fa-user',function(baseController){

        return baseController({
            data:{
                name:'Function',
                columns:[{title:'Id',field:'id'},{title:'Name',field:'name'},{title:'Date',field:'date'},{title:'Create Date',field:'createDate'}],
                dataList:[{id:1,name:'AA',date:123},{id:2,name:'BB',date:123}],
                actions:[
                    {
                        title:'copy',
                        class:'fa fa-copy',
                        fn:function(list,item){
                            list.push(_.extend(JSON.parse(JSON.stringify(item)),{
                                id:list.length + 1,
                                createDate:new Date()
                            }));
                        }
                    },
                    {
                        title:'delete',
                        class:'fa fa-trash',
                        fn:function(list,item){
                            var items = _.filter(list,function(i){return i!==item;});
                            list.length = 0;
                            list.push.apply(list,items);
                        }
                    }
                ]
            }
        });
    });

})(window._,window.Vue);

