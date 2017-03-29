var Vue  = require("vue") ;
var VueRouter = require("vue-router");
Vue.use(VueRouter);



function initComponent(list) {
    var result = [];
    for(var pro in list){
        var router = findPath(result,pro.split('/'));
        router.name = pro.split('/').pop();
        router.path = pro;
        router.component = function (resolve) {
            require(list[pro], resolve)
        };
    }
    return result;

    function find(list,filter) {
        for (var i = 0; i < list.length; i++) {
            if (filter(list[i])) {
                return list[i];
            }
        }
    }

    function findPath(list,paths){
        var obj = {},tempList = list;
        for (var i = 0; i < paths.length; i++) {
            if(paths[i]){
                obj = find(tempList,function(l){return l.name === paths[i];});
                if(!obj){
                    obj = {children:[]};
                    tempList.push(obj);
                }
                tempList = obj.children;
            }
        }
        return obj;
    }
}

window.addEventListener('load', function() {
    var router = new VueRouter({routes: initComponent([
        {
            'about':['common/about.vue'],
            'login':['common/login.vue'],
            'home':['common/home.vue']
        }
    ])});
    var appElement = document.createElement('div');
    window.document.body.appendChild(appElement);

    Vue.use(VueRouter);
    window.app = new Vue({
        template: '<router-view></router-view>',
        el: appElement,
        router: router
    });
    window.goto = function (url) {
        router.push(url);
    };
});
