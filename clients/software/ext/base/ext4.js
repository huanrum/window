/**
 * Created by sus on 2016/1/15.
 */
(function($e,Ext){
	'use strict';

	$e(function ajax() {
		return {
			title: 'Ajax',
			fn: function (panel) {
				panel.classList.add('ext-ajax');
			},
			action: function (panel, base) {
				if (!this.init) {
					this.init = true;
				}
				login(function(req){
					new Ext.Window({
						title:'loginForm',
						width: 300,
						height: 200,
						html:req.responseText
					}).show();
				});
			}
		};

		function login(fun){
			var config = {
				url:'../data/ext.login.html',
				form:'loginForm',
				callback:function(option,success,response){
					fun(response,option);
				}
			};
			Ext.Ajax.request(config);
		}
	});


})(window.$ehr,window.Ext);