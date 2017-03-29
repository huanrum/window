(function(window,Vue,VueRouter,_) {
    'use strict';

    window.addEventListener('load',load);
    Vue.controller = controller;



    function controller(url,cls,option){
        controller.tempData = controller.tempData || [];
        if(typeof url === 'string'){
            var paths = url.split('/'), tempRouters = controller.tempData;
            while(paths.length){
                var path = paths.shift();
                var router = _.find(tempRouters,{name:path});
                if(!router){
                    router = {
                        name: path,
                        class: cls,
                        path:'/'+(paths.length?path:url),
                        url: !paths.length && ('/'+url),
                        option: !paths.length && option
                    };
                    tempRouters.push(router);
                }
                router.children = router.children || [];
                tempRouters = router.children;
            }
        }else{
            return routerToMenu(_.find(controller.tempData,{name:'main'})).children;
        }
    }

    function routerToMenu(v){
        return _.extend({},v,{
            children:_.map(v.children,routerToMenu)
        });
    }

    function load(){
        var router = new VueRouter({ routes:initComponent(controller.tempData)});
        var appElement = document.createElement('div');
        window.document.body.appendChild(appElement);

        Vue.use(VueRouter);
        window.app = new Vue({
            template:'<router-view></router-view>',
            el:appElement,
            router: router
        });
        window.goto = function(url){
            router.push(url);
        };
    }

    function initComponent(tempData){
        return _.map(tempData,function(v){
            var item = _.extend({},v);
            if(item.option){
                if(typeof item.option === 'function'){
                    item.component = Vue.extend(_.extend({},item.option(Vue.createController)));
                }else{
                    item.component = Vue.extend(_.extend({},item.option));
                }
            }
            item.children = initComponent(item.children);
            return item;
        });
    }



})(window,window.Vue,window.VueRouter,window._);
