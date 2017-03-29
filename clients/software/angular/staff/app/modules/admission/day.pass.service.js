/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular){

	'use strict';

	angular.module('staff.main').service('pDayPassService',[
		'$global','baseService',function($global,baseService){
			var serviceOption = {
				name:'DayPass',
				loadUrl:'',
				updateUrl:''
			};


			var service = baseService(serviceOption);

			service.getColumns = function(){
				return [
					{title:'Id',model:'id',width:40},
					{title:'Name',model:'name',editor:'text'},
					{title:'Index',model:'index'},
					{title:'Icon',model:'icon',formatter:icon},
					{title:'Insert Date',model:'insertDate',formatter:'datatime'},
					{title:'Type',model:'type'},
					{title:'Live',model:'isLive',formatter:'boolean'}
				];

				function icon(row,cell,value,entity,column){
					if(value){
						return '<img src="images/menu_icon/'+value+'">';
					}
				}
			};

			service.updateLoadedData = function($data,data){
				$data.list = data.data;
			};

			service.load();
			return service;
		}]);
})(window.angular);