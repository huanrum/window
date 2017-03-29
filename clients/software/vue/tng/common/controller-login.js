(function(Vue){
    'use strict';

    Vue.controller('login','fa-login', {
        template: [
            '<div>',
            '   <h1>Login Page</h1>',
            '   <div><label style="width: 100px">LoginId</label><input v-model="entity.name"></div>',
            '   <div><label style="width: 100px">Password</label><input v-model="entity.password"></div>',
            '   <a class="btn" v-on:click="login()">Go</a>',
            '</div>'
        ].join(''),
        data: function () {
            return {
                entity:{name:'',password:''}
            };
        },
        methods:{
            login:function(){
                window.goto('/main');
            }
        }
    });

})(window.Vue);