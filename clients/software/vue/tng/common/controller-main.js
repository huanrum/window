(function(window,_,Vue){
    'use strict';


    Vue.controller('main','fa-main', {
        template: [
            '<div class="content">',
            '   <div class="main-left">',
            '       <ul class="sidebar-menu list-style-none">',
            '          <li v-for="it in items" >',
            '               <div v-on:click="active=it;goto(it)" class="btn btn-default form-control">',
            '                   <i v-bind:class="it.class"></i>',
            '                   <span>{{it.name}}</span>',
            '               </div>',
            '              <ul class="sidebar-menu list-style-none sub-menu" v-show="active===it">',
            '                  <li v-for="st in it.children" >',
            '                     <div v-on:click="goto(st)" class="btn btn-default form-control">',
            '                         <i v-bind:class="st.class"></i>',
            '                         <span>{{st.name}}</span>',
            '                     </div>',
            '                  </li>',
            '              </ul>',
            '          </li>',
            '       </ul>',
            '   </div>',
            '   <div class="main-right">',
            '       <router-view></router-view>',
            '   </div>',
            '</div>'
        ].join(''),
        data: function () {
            return {
                active:null,
                items:Vue.controller()
            };
        },
        methods:{
            goto:function(menu){
                window.goto(menu.url);
            }
        }
    });

})(window,window._,window.Vue);

