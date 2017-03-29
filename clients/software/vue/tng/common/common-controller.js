(function(_,Vue){
    'use strict';

    function noThing(){}

    function getDefaultTemplate(){
        return [
            '<div class="main-content">',
            '   <h1>{{active}} {{name}}</h1>',
            '   <a class="fa fa-refresh fa-3x" v-on:click="refresh()"></a>',
            '   <a class="fa fa-external-link fa-3x" v-on:click="goto(\'\/login\')"></a>',
            '   <a class="fa fa-question-circle-o fa-3x" v-on:click="goto(\'\/about\')"></a>',
            '   <p>This is the tutorial about vue-router.</p>',
            '   <table>',
            '      <thead>',
            '          <tr><th v-for="column in columns">{{column.title}}</th><th v-if="!!actions.length"></th></tr>',
            '      </thead>',
            '      <tbody>',
            '          <tr v-for="item in dataList">',
            '              <td v-for="column in columns">{{formatter(item,column)}}</td>',
            '              <td v-if="!!actions.length" class="btn-group"><a v-for="ac in actions" v-bind:class="ac.class" v-on:click="ac.fn(dataList,item)">{{ac.title}}</td>',
            '          </tr>',
            '      </tbody>',
            '   </table>',
            '</div>'
        ].join('');
    }

    Vue.createController = function(scope,template,interval){
        var data = scope && scope.data;
        var methods = scope && scope.methods;

        return _.extend(scope||{},_.extend({
            template : template || getDefaultTemplate(),
            data:function(){
                var vm = this;
                if(typeof data === 'function'){
                    data = data.call(vm);
                }

                setTimeout(timeout,interval || 5000);

                return _.extend({
                    active: 'Hello',
                    actions:[]
                },data);

                function timeout(){
                    vm.refresh();
                    setTimeout(timeout,5000);
                }
            },
            methods:_.extend({},{
                goto:function(url){
                    window.goto(url);
                },
                refresh:function(){
                    var columns = _.map(this.columns,function(i){return i.field;});
                    this.dataList = _.times(Math.floor(Math.random()*20)+10,function(){
                        return _.zipObject(columns,_.map(columns,function(column){
                            return column + Math.floor(Math.random() * 1000000);
                        }));
                    });
                },
                formatter:function(entity,column){
                    return entity[column.field];
                }
            },methods)
        }));
    };

})(window._,window.Vue);