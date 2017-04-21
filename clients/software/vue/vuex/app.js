/**
 * Created by Administrator on 2017/3/20.
 */
(function ($e,Vue,Vuex) {
    'use strict';

    const store = new Vuex.Store({
        state: {
            count: 0
        },
        mutations: {
            increment (state) {
                state.count++
            }
        },
        actions: {
            increment (context) {
                context.commit('increment')
            }
        }
    });

    $e(function base() {
        return {
            title: 'Base',
            fn: function (panel, base) {
                panel.classList.add('vue-base');
            },
            action:function(panel, base){
                panel.innerHTML = [
                    '<div id="app" v-on:click="increment()">',
                    '   {{ message }}',
                    '</div>'
                ].join('');

                var app = new Vue({
                    el: '#app',
                    data: {
                        message: 'Hello Vue!'
                    },
                    methods:{
                        increment:() => store.dispatch('increment')
                        //...Vuex.mapActions([
                        //    'increment' // 映射 this.increment() 为 this.$store.dispatch('increment')
                        //]),
                        //...Vuex.mapActions({
                        //    add: 'increment' // 映射 this.add() 为 this.$store.dispatch('increment')
                        //})
                    }
                });

                panel.unload(base.eachrun(function (index) {
                    app.message = 'Hello Vue! ' + index;
                }, 1000));
            }
        };
    });


})(window.$ehr,window.Vue,window.Vuex);
