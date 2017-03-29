/**
 * Created by sus on 2016/1/13.
 */
(function($e,Ext){
	'use strict';

	$e(function form() {

		return {
			title: 'Form',
			fn: function (panel) {
				panel.classList.add('ext-form');
			},
			action:function(panel){
				if(!this.init){
					this.init = true;
					Ext.BLANK_IMAGE_URL = '../../../../lib/images/default/s.gif';
					Ext.QuickTips.init();
					this.form1 = new Ext.form.FormPanel(initForm1Config(this.login));
					this.form2 = new Ext.form.FormPanel(initForm2Config(this.login));
					this.form1.render(panel);
					this.form2.render(panel);
				}
			},
			login:function(){

			}
		};

		function initForm1Config(login){
			var store = new Ext.data.SimpleStore({
				fields:['value','text'],
				data:[
					[1,'AT'],
					[2,'FG'],
					[3,'LM']
				]
			});

			return {
				title:'A Login Form1',
				height:370,
				width:300,
				frame:true,
				labelSeparator:':',
				labelWidth:60,
				labelAlign:'right',
				items:[
					new Ext.form.TextField({id:'name',fieldLabel:'Name',allowBlank:false}),
					new Ext.form.TextField({id:'password',fieldLabel:'Password',allowBlank:false,inputType:'password'}),
					new Ext.form.ComboBox({id:'city',fieldLabel:'City',displayField:'text',valueField:'value',triggerAction:'all',mode:'local',emptyText:'Please select city',store:store}),
					new Ext.form.TextField({id:'email',fieldLabel:'E-mail',allowBlank:false,selectOrForce:true,regex:/\s*@\s*\.\s*/}),
					new Ext.form.NumberField({id:'age',fieldLabel:'Age',allowNegative:false,decimalPrecision:0}),
					new Ext.form.TextArea({id:'remark',fieldLabel:'Remark',width:200}),
					new Ext.form.Radio({name:'sex',fieldLabel:'Sex',itemCls:'float-left',clearCls:'allow-float',boxLabel:'Male'}),
					new Ext.form.Radio({name:'sex',clearCls:'stop-float',boxLabel:'Female',hideLabel:false}),
					new Ext.form.Checkbox({name:'hobby',fieldLabel:'Hobby',itemCls:'float-left',clearCls:'allow-float',boxLabel:'Football'}),
					new Ext.form.Checkbox({name:'hobby',clearCls:'stop-float',boxLabel:'Ping-Pang',hideLabel:false})
				],
				buttons:[
					new Ext.Button({text:'Ok',handler:login})
				]
			};
		}

		function initForm2Config(login){

			return {
				title:'A Login Form2',
				height:370,
				width:540,
				frame:true,
				labelSeparator:':',
				labelWidth:60,
				labelAlign:'right',
				items:[
					new Ext.form.DateField({id:'birthday',fieldLabel:'Birthday',width:200,emptyText:'Please select date',format:'Y-m-d',disableDays:[0,6]}),
					new Ext.form.HtmlEditor({id:'something',fieldLabel:'Something',width:400,height:240})
				],
				buttons:[
					new Ext.Button({text:'Ok',handler:login})
				]
			};
		}
	});


	$e(function grid() {

		return {
			title: 'Grid',
			fn: function (panel,base) {
				panel.classList.add('ext-grid');
				this.grid = getDataGrid(base,getData(base));
			},
			action: function (panel,base) {
				if (!this.init) {
					this.init = true;
					this.grid.render(panel);
				}
			}
		};

		function getDataGrid(base,items){
			var columns = [],data = [];
			base.each(items,function(item){
				base.each(item,function(value,pro){
					if(!base.filter(columns,function(i){return i.dataIndex === pro;}).length){
						var column = {header:pro[0].toLocaleUpperCase()+pro.slice(1),dataIndex:pro};
						if(/#[0-9|a-f]{6}/.test(value)){
							column.renderer = function(val){
								return '<div style="background:'+val+' ">'+val+'</div>';
							};
						}else if(value instanceof Date){
							column.renderer = new Ext.util.Format.dateRenderer('Y/m/d');
							column.editor = new Ext.grid.GridEditor(new Ext.form.DateField({}));
						}else if(typeof value === 'number'){
							column.editor = new Ext.grid.GridEditor(new Ext.form.NumberField({}));
						}else{
							column.editor = new Ext.grid.GridEditor(new Ext.form.TextField({}));
						}
						columns.push(column);
					}
				});
			});

			base.each(items,function(value){
				data[data.length] = [];
				base.each(columns,function(column,index){
					data[data.length-1][index] = value[column.dataIndex];
				});
			});


			var scm = new Ext.grid.CheckboxSelectionModel();
			var columnModel = base.merge(scm,columns);
			var cum = new Ext.grid.ColumnModel(columnModel);
			var store = new Ext.data.Store({
				proxy:new Ext.data.MemoryProxy(data),
				reader:new Ext.data.ArrayReader({},base.each(columns,function(i){return {name:i.dataIndex};})),
				groupField:columns[Math.floor(Math.random() * (columns.length-1))+1].dataIndex,
				getGroupState:function(){return this.groupField;},
				sortInfo:{field:columns[0].dataIndex}
			});
			var viewConfig = {
				forceFit:true,
					getRowClass:function(recode,index){
					return index%2===0?'odd-row':'even-row';
				}
			};
			var grid = new Ext.grid.GridPanel({
				store:store,
				colModel:cum,
				sm:scm,
				stripeRows:true,
				width:100 * columns.length + 25,
				height:400,
				viewConfig:new Ext.grid.GroupingView({}),
				bbar:new Ext.PagingToolbar({
					pageSize:12,
					store:store,
					displayInfo:true,
					displayMsg:'show {0}-{1},count {2}'
				})
			});
			return {grid:grid,render:function(parent){
				grid.render(parent);
				store.load({params:{start:0,limit:10}});
			}};
		}

		function getData(base){
			return base.each(Math.random() * 100 + 12,function(value){
				return {
					id:value + 1,
					bane:value % 5,
					color:base.color(Math.floor(value / 12)),
					date:new Date(value)
				};
			});
		}

	});
})(window.$ehr,window.Ext);