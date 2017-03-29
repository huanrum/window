/**
 * Created by sus on 2016/1/11.
 */
(function($e,Ext){
	'use strict';

	$e(function demo(){
		return {
			title:'Demo',
			fn:function(panel,base){
				panel.classList.add('ext-demo');

				base.each([
					function alert(title){
						Ext.MessageBox.alert(title,' Hello World ! <br> click at ' + new Date() + '<br>');
					},
					function confirm(title){
						Ext.MessageBox.confirm(title,'Are you sure ?',function(btn){
							Ext.MessageBox.alert('Select', 'you select ' +btn);
						});
					},
					function prompt(title){
						Ext.MessageBox.prompt(title,' Please input some string !',function(btn,text){
							Ext.MessageBox.alert('Input', text);
						});
					},
					function wait(title){
						Ext.MessageBox.wait(' Running ... ',title,function(a){

						});
					},
					function show(title){
						Ext.MessageBox.show({
							title:title,
							buttons:Ext.MessageBox.YESNOCANCEL
						});
					}
				],function(action){
					new Ext.Button({
						text:'MessageBox - '+action.name[0].toLocaleUpperCase() + action.name.slice(1),
						width:150,
						handler:function(){
							action(this.text);
						}
					}).render(panel);
				});

			}
		};
	});

	$e(function assembly(){

		var login = new Ext.Panel({
			title:'Login',
			width:400,
			height:200,
			collapsible:true,
			layout:'form',
			items:[
				{
					fieldLabel:'Name',
					xtype:'textfield',
					width:150,
					name:'username',
					allowBlank:false,
					blankText:'not null',
					id:'username'
				},
				{
					fieldLabel:'Password',
					xtype:'textfield',
					width:150,
					name:'password',
					allowBlank:false,
					blankText:'not null',
					id:'password'
				}
			],
			tbar:[{text:'welcome'}],
			bbar:[{pressed:true,text:'Ok'},'',{pressed:true,text:'Cancel'},'',{pressed:true,text:'Reset'}],
			tools:[
				{id:'refresh',handler:function(event,toolEl,p){p.getUpdate().update({url:'panel.html',script:true});}},
				{id:'close',handler:function(event,toolEl,p){p.hide();}}
			]
		});

		var tab = new Ext.TabPanel({
			width:400,
			height:200,
			items:[
				{title:'Tab-1',closable:true,html:'Tab-1 Tab-1'},
				{title:'Tab-2',closable:true,html:'Tab-2 Tab-2'}
			],
			activeItem:0
		});

		var progressBar1 = new Ext.ProgressBar({
			text:'WORKING...',
			width:400
		});

		progressBar1.runConfig = {
			interval:1000,
			run:function(){
				this.count = (this.count>100?0:(this.count || 0)) + 1;
				progressBar1.updateProgress(this.count / 100,'manual: ' +this.count + '%');
			}
		};

		var progressBar2 = new Ext.ProgressBar({
			text:'WORKING...',
			width:400,
			cls:'progressbar'
		});

		progressBar2.runConfig = {
			duration:10000,
			interval:100,
			increment:100,
			scope:this,
			fn:function(){
				progressBar2.updateProgress(1.0,'auto: succeed');
			}
		};

		var newT = new Ext.Toolbar({
			width:'90%',
			height:200
		});

		newT.buttonClick = function(e){
			Ext.MessageBox.alert('Button Click',e.text);
		};

		newT.addButton({text:'Btn-01',handler:newT.buttonClick});
		newT.addButton({text:'Btn-02',menu:new Ext.menu.Menu({
			shadow:'frame',
			items:[
				{text:'Btn-02 01',handler:newT.buttonClick},
				{text:'Btn-02 02',handler:newT.buttonClick},
				{text:'Btn-02 03',menu:new Ext.menu.Menu({
					items:[
						{text:'Btn-02 03-01',handler:newT.buttonClick},
						{text:'Btn-02 03-02',handler:newT.buttonClick},
						{text:'Btn-02 03-03',handler:newT.buttonClick}
					]})}
			]
		})});
		newT.addButton({text:'Btn-03',menu:new Ext.menu.Menu({
			shadow:'frame',
			items:[
				{text:'Btn-03 01',group:'theme',checked:false,handler:newT.buttonClick},
				{text:'Btn-03 02',group:'theme',checked:false,handler:newT.buttonClick},
				{text:'Btn-03 03',group:'theme',checked:false,handler:newT.buttonClick}
			]
		})});
		newT.addButton({text:'Btn-04',handler:newT.buttonClick});
		newT.add('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;','please input some text','-',new Ext.form.TextField({width:100}),{text:'search'});

		return {
			title:'Assembly',
			action:function(panel){
				if(!this.init){
					this.init = true;
					login.render(panel);
					tab.render(panel);
					progressBar1.render(panel);
					progressBar2.render(panel);
					newT.render(panel);


					Ext.TaskMgr.start(progressBar1.runConfig);
					progressBar2.wait(progressBar2.runConfig);

				}
				login.show();
			},
			fn:function(panel){
				panel.classList.add('ext-assembly');
			}
		};
	});

	$e(function element() {
		return {
			title: 'Element',
			fn: function (panel) {
				panel.classList.add('ext-element');
				panel.innerHTML = [
					'<div id="xyn"></div>',
					'<div>Ext.query <div style="color:#9999ff;">Ext.query("{display=none}")</div></div>',
					'<div>Ext.Template ||  Ext.XTemplate</div>'
				].join('');
			},
			action:function(panel){
				if(!this.init){
					this.init = true;
					Ext.fly('xyn').wrap();
				}
				Ext.fly('xyn').update('Time:'+Date.now());
				Ext.fly('xyn').frame();
			}
		};
	});

})(window.$ehr,window.Ext);