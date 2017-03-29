/**
 * Created by Administrator on 2016/9/22.
 */
(function(document,$ehr){
    'use strict';

    var functions = {};
    var initAppendChild = (function init(){
        var elements = [];
        window.addEventListener('load',function(){
            for(var i=0;i<elements.length;i++){
                document.body.appendChild(elements[i]);
            }
        });

        return function (onclick){
            var contentEditable = document.createElement('div');
            contentEditable.style.background = '#dddddd';
            contentEditable.style.margin = '2em';
            contentEditable.style.fontSize = '2em';
            contentEditable.onclick = onclick;
            //contentEditable.contentEditable = true;
            if(document.body){
                document.body.appendChild(contentEditable);
            }else{
                elements.push(contentEditable);
            }
            functions.appendChild = function(element,children){
                for(var i=0;i<children.length;i++){
                    element.appendChild(children[i]);
                }
                contentEditable.appendChild(element);
            };
        };
    })();


    window.elFunction = function elFunction(str){
        var subStr = '',result = '';
        initAppendChild(onclick);
        for (var i=0;i<str.length+1;i++){
            if(str[i] && /[\s|a-zA-z0-9,\(\)]/.test(str[i])){
                subStr += str[i];
            }else{
                var fas = subStr.split(/\(/);
                if(functions[fas[0]]){
                    result += functions[fas[0]].apply(functions,fas[1].slice(0,fas[1].length-1).split(','));
                }else{
                    result += functions.sign(subStr);
                }
                result += functions.sign(str[i]);
                subStr = '';
            }
        }
        return calculate;

        function onclick(e){
            var currentTarget = e.currentTarget;
            var content = document.createElement('div');
            var input = document.createElement('div');
            var countResult = document.createElement('div');
            var dialog = $ehr.dialog('calculate',content,{close:Close,ok:Ok});
            var getInputs = createInputs(input,result.match(/@[\s]*[a-zA-Z]{1}[a-zA-Z0-9]*[\s]*@/gm));

            content.style.minWidth = '25em';
            content.style.minHeight = '12em';
            countResult.style.textAlign = 'center';
            countResult.style.margin = '2em';
            countResult.style.fontSize = '2em';
            countResult.style.color = '#000066';
            content.appendChild(input);
            content.appendChild(countResult);

            currentTarget.style.background = '#9999ff';
            document.body.appendChild(dialog);

            function Close(){
                currentTarget.style.background = '#dddddd';
                document.body.removeChild(dialog);
            }

            function Ok(){
                countResult.innerHTML = calculate(getInputs());
            }

            function createInputs(inputElement,variables){
                var inputs = {};
                for(var i=0;i<variables.length;i++){
                    var pro = variables[i].slice(1,variables[i].length-1).trim();
                    if(!inputs[pro]){
                        var row = document.createElement('div');
                        var name = document.createElement('span');
                        inputs[pro] = document.createElement('input');

                        name.innerHTML = pro;
                        row.style.fontSize = '1.5em';
                        row.style.padding = '5px 1em';
                        inputs[pro].style.float = 'right';
                        row.appendChild(name);
                        row.appendChild(inputs[pro]);
                        inputElement.appendChild(row);
                    }
                }
                return function(){
                    var inputObject = {};
                    /* jshint -W089*/
                    for(var pro in inputs){
                        inputObject[pro] = inputs[pro].value;
                    }
                    return inputObject;
                };
            }
        }

        function calculate(obj){
            var countResult = result;
            /* jshint -W089*/
            for(var pro in obj){
                while(new RegExp('@'+pro+'@').test(countResult)){
                    countResult = countResult.replace('@'+pro+'@',obj[pro]);
                }
            }
            while(new RegExp('@').test(countResult)){
                countResult = countResult.replace('@','');
            }
            /* jshint -W061*/
            eval('countResult='+countResult.split('=').pop());
            return countResult;
        }
    };


    functions.sign = function(sign){
        var element = document.createElement('span');
        element.className = 'functions-sign';
        element.innerHTML = ' '+(sign||'')+' ';
        this.appendChild(element,[]);
        return sign || '';
    };

    functions.sub = function(variable,subscript){
        var element = document.createElement('span');
        element.className = 'functions-sub';

        var value = document.createElement('span');
        value.innerHTML = variable;
        var sub = document.createElement('sub');
        sub.style.fontSize = '0.5em';
        sub.innerHTML = subscript;

        this.appendChild(element,[value,sub]);
        return '(@'+variable+'@[@'+subscript+'@] || 0)';
    };

    functions.pow = function(variable,subscript){
        var element = document.createElement('span');
        element.className = 'functions-pow';

        var value = document.createElement('span');
        value.innerHTML = variable;
        var sup = document.createElement('sup');
        sup.style.fontSize = '0.5em';
        sup.innerHTML = subscript;

        this.appendChild(element,[value,sup]);
        return 'Math.pow(@'+variable+'@,@'+subscript+'@)';
    };

    functions.log = function(variable,subscript){
        var element = document.createElement('span');
        element.className = 'functions-log';

        var log = document.createElement('span');
        log.innerHTML = 'Log';
        var value = document.createElement('span');
        value.innerHTML = variable;
        var sub = document.createElement('sub');
        sub.style.fontSize = '0.5em';
        sub.innerHTML = subscript;

        this.appendChild(element,[log,sub,value]);
        return 'Math.log(@'+variable+'@) / Math.log(@'+subscript+'@)';
    };

    functions.sqrt = function(variable,subscript){
        var element = document.createElement('span');
        element.className = 'functions-sub';

        var sqrt = document.createElement('span');

        var value = document.createElement('span');
        value.style.borderTop = '1px solid #333333';
        value.style.padding = '0 0.5em';
        value.innerHTML = variable;
        var sup = document.createElement('sup');
        sup.style.fontSize = '0.5em';
        sup.style.verticalAlign = 'top';
        sup.style.borderRight = '1px solid #333333';
        sup.innerHTML = subscript || '&nbsp;';

        sqrt.appendChild(sup);
        this.appendChild(element,[sqrt,value]);
        return 'Math.sqrt(@'+variable+'@)';
    };

})(window.document,window.$ehr);