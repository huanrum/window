(function(_,Vue){
    'use strict';

    var icons = [];
    Vue.http.get('../../../../ExplorerCatalog/GetFiles?name=Icons\\desktop&localhost='+location.hostname).then(req =>icons = req.data.children);

    Vue.controller('main/shop.food','fa fa-shopping-cart',function(baseController){

        return baseController({
            data:{
                name:'Food',
                columns:[{title:'id',field:'id'},{title:'title',field:'title'},{title:'src',field:'src'}],
                dataList:[]
            },
            methods:{
                getIcon:function(item,index){
                    return '../../../../icons/desktop/'+icons[index%icons.length];
                }
            }
        },[
            '<div class="main-content">',
            '   <h1>{{active}} {{name}}</h1>',
            '   <a class="fa fa-refresh fa-3x" v-on:click="refresh()"></a>',
            '   <p>This is the tutorial about vue-router.</p>',
            '   <div class="item-list">',
            '       <div v-for="(item,index) in dataList" class="item-detail">',
            '          <div><label>{{item.title}}</label></div>',
            '          <img :src="getIcon(item,index)" width="200px">',
            '       </div>',
            '   </div>',
            '</div>'
        ].join(''),500);
    });


})(window._,window.Vue);

