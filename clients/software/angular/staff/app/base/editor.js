/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular){

	'use strict';

	angular.module('staff.common').service('editor',[
		'$global','baseService',function($global,baseService){
			var editors = {
				boolean:boolean,
				datetime:datetime
			};


			return function(editor){
				if(angular.isString(editor)){
					return editors[editor] || input(editor);
				}else if(angular.isArray(editor)){
					return selected(editor);
				}else {
					return editor;
				}
			};

			function selected(options){
				return function(row,cell,value,entity,column){
					var result = '<select @ng-model@ value="'+value+'">';
					angular.forEach(options,function(op){
						result += '<option value="'+op.value+'">'+op.name+'</option>';
					});
					return result + '</select>';
				};
			}

			function repair(value,place,char){
				value = '' + value;
				while(value.length < place){
					value = (char||0) + value;
				}
				return value;
			}

			function input(type){
				return function(row,cell,value,entity,column){
					return '<input type="'+type+'" @ng-model@ value="'+(value||'')+'">';
				};
			}


			function boolean(row,cell,value,entity,column){
				if(value === true){
					return '<input type="checkbox" checked="true" @ng-model@>';
				}else{
					return '<input type="checkbox" @ng-model@>';
				}
			}

			function datetime(row,cell,value,entity,column) {
				value = value&&(angular.isDate(value)?value:new Date(value));
				return '<input type="datetime" value="@value@" @ng-model@>'.replace('@value@',
					value?(repair(value.getFullYear(), 4) + '-' + repair(value.getMonth() + 1, 2) + '-' + repair(value.getDate(), 2) + 'T' + repair(value.getHours(), 2) + ':' + repair(value.getMinutes(), 2) + ':' + repair(value.getSeconds(), 2)):'');
			}

		}]);
})(window.angular);