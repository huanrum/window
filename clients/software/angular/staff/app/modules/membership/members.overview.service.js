/**
 * Created by Administrator on 2016/6/10.
 */
(function(angular){

	'use strict';

	angular.module('staff.main').service('pMembersOverviewService',[
		'$global','baseService',function($global,baseService){
			var serviceOption = {
				name:'MembersOverview',
				loadUrl:'../../../../login/login?name=ehuanrum&password=25d55ad283aa400af464c76d713c07ad',
				updateUrl:''
			};


			var service = baseService(serviceOption);

			service.getColumns = function(){
				return [
					{title:'Id',model:'id',width:40},
					{title:'Name',model:'name'},
					{title:'Title',model:'title'},
					{title:'Icon',model:'icon',formatter:icon},
					{title:'Open Count',model:'openCount',editor:'number'},
					{title:'Fn Url',model:'fnUrl'},
					{title:'Dialog Size',model:'dialogSize'},
					{title:'No Can Max',model:'noCanMax',formatter:'boolean',editor:'boolean'},
					{title:'Hide Desktop',model:'hideDesktop',formatter:'boolean',editor:'boolean'},
					{title:'Suspension',model:'suspension',formatter:'boolean',editor:'boolean'}
				];

				function icon(row,cell,value,entity,column){
					if(value){
						return '<img height="25px" src="images/menu_icon/'+value.replace('@path:','../../../../../')+'">';
					}
				}
			};

			service.updateLoadedData = function($data,data){
				$data.list = data.softwares || [];
			};

			service.load();
			return service;
		}]);
})(window.angular);