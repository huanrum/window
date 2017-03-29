/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular){

	'use strict';

	angular.module('staff.common').service('fomatter',[
		'$global','baseService',function($global,baseService){
			return {
				boolean:boolean,
				datetime:datetime
			};

			function boolean(row,cell,value,entity,column){
				if(value === true){
					return '<input type="checkbox" disabled checked="true">';
				}else if(value === false){
					return '<input type="checkbox" disabled>';
				}
			}

			function datetime(row,cell,value,entity,column){
				return value && value.replace('T',' ');
			}

		}]);
})(window.angular);