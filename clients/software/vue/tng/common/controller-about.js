(function(Vue){
    'use strict';

    Vue.controller('about','fa-helper', {
        template: [
            '<div>',
            '   <h1>About</h1><p>This is the tutorial about vue-router.</p>',
            '   <a  v-on:click="login()">Login</a>',
            '</div>'

        ].join(''),
        methods:{
            login:function(){
                window.goto('/login');
            }
        }
    });

})(window.Vue);