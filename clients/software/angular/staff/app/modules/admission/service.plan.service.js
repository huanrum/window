/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular){

	'use strict';

	angular.module('staff.main').service('pServicePlanService',[
		'$global','baseService',function($global,baseService){
			var serviceOption = {
				name:'ServicePlan',
				loadUrl:$global.urls.getMenus,
				updateUrl:$global.urls.getMenus
			};


			var service = baseService(serviceOption);

			service.getColumns = function(){
				return [
					{title:'Id',model:'id',width:40},
					{title:'Name',model:'name'},
					{title:'Index',model:'index'},
					{title:'Icon',model:'icon',formatter:icon},
					{title:'Insert Date',model:'insertDate',formatter:'datetime',editor:'datetime'},
					{title:'Type',model:'type',editor:[{name:'X',value:1},{name:'Y',value:2}]},
					{title:'Live',model:'isLive',formatter:'boolean',editor:'boolean'}
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