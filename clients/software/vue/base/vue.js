/**
 * Created by Administrator on 2016/11/8.
 */
(function($e,Vue) {
    'use strict';



    Vue.filter('add_char',function (value,char = '@') {
        return char + value + char
    });

    // 注册一个全局自定义指令 v-focus
    Vue.directive('afocus', {
        // 当绑定元素插入到 DOM 中。
        inserted: function (el) {
            // 聚焦元素
            el.focus()
            alert(el.tagName);
        }
    })


    $e(function base() {
        return {
            title: 'Base',
            fn: function (panel, base) {
                panel.classList.add('vue-base');
            },
            action:function(panel, base){
                panel.innerHTML = [
                    '<div id="app">',
                    '   {{ message }}',
                    '</div>'
                ].join('');

                var app = new Vue({
                    el: '#app',
                    data: {
                        message: 'Hello Vue!'
                    }
                });

                panel.unload(base.eachrun(function (index) {
                    app.message = 'Hello Vue! ' + index;
                }, 1000));
            }
        };
    });

    $e(function base() {
        return {
            title: 'Bind',
            fn: function (panel, base) {
                panel.classList.add('vue-bind');
            },
            action:function(panel, base){
                panel.innerHTML = [
                    '<div id="app-2">',
                    '   <span v-bind:title="message">',
                    '       Hover your mouse over me for a few seconds to see my dynamically bound title!',
                    '   </span>',
                    '</div>'
                ].join('');

                var app2 = new Vue({
                    el: '#app-2',
                    data: {
                        message: 'You loaded this page on ' + new Date()
                    }
                });
                panel.unload(base.eachrun(function (index) {
                    app2.message = index + ' You loaded this page on ' + new Date();
                }, 1000));
            }
        };
    });

    $e(function base() {
        return {
            title: 'IF',
            fn: function (panel, base) {
                panel.classList.add('vue-if');
            },
            action:function(panel, base){
                panel.innerHTML = [
                    '<div id="app-3">',
                    '   <p v-if="seen">Now you see me</p>',
                    '</div>'
                ].join('');

                var app3 = new Vue({
                    el: '#app-3',
                    data: {
                        seen: true
                    }
                });

                panel.unload(base.eachrun(function (index) {
                    app3.seen = !app3.seen;
                }, 1000));
            }
        };
    });

    $e(function base() {

        return {
            title: 'For',
            fn: function (panel, base) {
                panel.classList.add('vue-for');
            },
            action:function(panel, base){
                panel.innerHTML = [
                    '<div id="app-4">',
                    '   <ul>',
                    '       <li v-for="(todo,index) in todos">',
                    '       {{index + 1}} {{ todo.text }}',
                    '       <button v-on:click="todos.splice(index, 1)">&times;</button>',
                    '       </li>',
                    '   </ul>',
                    '</div>'
                ].join('');
                var app4 = new Vue({
                    el: '#app-4',
                    data: {
                        todos:[
                            { text: 'Learn JavaScript' },
                            { text: 'Learn Vue' },
                            { text: 'Build something awesome' }
                        ]
                    }
                });

                panel.unload(base.eachrun(function (index) {
                    app4.todos.push({text: 'Test-' + index});
                }, 1000));
            }
        };
    });


    $e(function component() {

        Vue.component('my-component', {
            // 模板
            template: [
                '<div>',
                '   <button @click="show">{{btn |add_char(\'000\')}}</button>',
                '   <div>{{msg}} {{privateMsg}} {{index}}</div>',
                '</div>'
            ].join(''),
            // 接受参数
            props: {
                index:Number,
                msg: String,
                btn:String,
                show:Function
            },
            // 私有数据，需要在函数中返回以避免多个实例共享一个对象
            data: function () {
                return {
                    privateMsg: 'component!'
                };
            }
        });

        return {
            title: 'Component',
            fn: function (panel, base) {
                panel.classList.add('vue-component');
            },
            action: function (panel, base) {
                panel.innerHTML = [
                    '<div id="app-5">',
                    '   <div>Component</div>',
                    '   <my-component :msg="msg" :index="index" :btn="btn" :show="show"></my-component>',
                    '</div>'
                ].join('');

                var app5 = new Vue({
                    el: '#app-5',
                    data: {
                        btn:'show',
                        index:0,
                        msg:'Hi,'
                    },
                    methods:{
                        show:function(){
                            window.alert(this.index);
                        }
                    },
                    watch:{
                        index:function(value){
                            console.log('index:',value);
                        }
                    }
                });

                panel.unload(base.eachrun(function (index) {
                    app5.index = index;
                }, 200));

            }
        };
    });

    $e(function directive() {

        Vue.directive('focus',{
            bind: function(el, binding){
                console.log('bind:',binding.value);
            },
            inserted: function(el, binding){
                console.log('insert:',binding.value);
            },
            update: function(el, binding, vnode, oldVnode){
                if(binding.oldValue !== binding.value){
                    el.focus();
                    //console.log(binding.expression ,' = ',binding.oldValue,' -> ',binding.value);//这里的数据是可以动态绑定的
                }
            },
            componentUpdated: function(el, binding){
                //console.log('componentUpdated:',binding.name);
            }
        });

        return {
            title: 'Directive',
            fn: function (panel, base) {
                panel.classList.add('vue-directive');
            },
            action: function (panel, base) {
                panel.innerHTML = [
                    '<div id="app-6">',
                    '   <div>Directive</div>',
                    '   <div v-once>起始数据 {{index1}} {{index2}}</div>',
                    '   <input @keyup.enter.ctrl="enter()">',
                    '   <textarea v-focus="index1">{{msg}} {{index1}}</textarea>',
                    '   <textarea v-focus="index2">{{msg}} {{index2}}</textarea>',
                    '</div>'
                ].join('');

                var app6 = new Vue({
                    el: '#app-6',
                    data: {
                        btn:'show',
                        index1:1,
                        index2:0,
                        msg:'Hi,'
                    },
                    methods:{
                        show:function(){
                            window.alert(this.index1);
                        },
                        enter(){
                            window.alert(this.index2);
                        }
                    }
                });

                panel.unload(base.eachrun(function () {
                    app6.index1 = app6.index1 + Math.random();
                    base.timeout(function () {
                        app6.index2 = app6.index2 + Math.random();
                    }, 1000);
                }, 2000));

            }
        };
    });


    $e(function checkBox() {
        return {
            title: 'CheckBox',
            fn: function (panel, base) {
                panel.classList.add('vue-base');
            },
            action:function(panel, base){
                panel.innerHTML = [
                    '<div id="app">',
                    '   <input type="checkbox" id="jack" value="Jack" v-model="checkedNames">',
                    '   <label for="jack">Jack</label>',
                    '   <input type="checkbox" id="john" value="John" v-model="checkedNames">',
                    '   <label for="john">John</label>',
                    '   <input type="checkbox" id="mike" value="Mike" v-model="checkedNames">',
                    '   <label for="mike">Mike</label>',
                    '   <br>',
                    '   <span>Checked names: {{ checkedNames }}</span>',
                    '   <br>',
                    '   <br>',
                    '   <input type="radio" id="one" value="One" v-model="picked">',
                    '   <label for="one">One</label>',
                    '   <br>',
                    '   <input type="radio" id="two" value="Two" v-model="picked">',
                    '   <label for="two">Two</label>',
                    '   <br>',
                    '   <span>Picked: {{ picked }}</span>',
                    '   <br>',
                    '   <br>',
                    '   <input v-model.number="age" type="number">',
                    '</div>'
                ].join('');

                var app = new Vue({
                    el: '#app',
                    props: {
                        age:{
                            type:Number,
                            default:12,
                            validator: function (value) {
                                return value > 10
                            }
                        }
                    },
                    data: {
                        picked:'',
                        checkedNames : []//数组时候是多选，其他的时候为单选
                    }
                });

                panel.unload(base.eachrun(function (index) {
                    app.message = 'Hello Vue! ' + index;
                }, 1000));
            }
        };
    });

})(window.$ehr,window.Vue);