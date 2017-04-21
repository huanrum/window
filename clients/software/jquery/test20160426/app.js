/**
 * Created by Administrator on 2016/4/26.
 */
(function($e){
	'use strict';

	$e(function(){
		return {
			title:'Grid',
			fn:function(panel,base){
				var columns = base.each(9,function(index){return {field:'Column'+index,editor:'text'};});

				var grid = window.createEhrControl('grid',columns,getData(base,columns),{
					height:800,width:1200,lineHeight:25,
					selectChange:selectChange
				});
				grid.appendTo(panel);
				panel.style.height = '500px';

				base.eachrun(function () {
					grid.update(getData(base, columns));
				}, 60 * 10000);


				function selectChange(e,r,item){
					window.alert(r+' : ' + item);
				}
			}
		};

		function getData(base,columns){
			return base.each(Math.random()*40+20,function(row){
				var item = {};
				base.each(columns,function(column,index){
					item[column.field] = Math.random() + index;
				});
				return item;
			});
		}
	});

	$e(function(){
		return {
			title:'Form',
			fn:function(panel,base){
				var rows = base.each(15,function(index){return {field:'Column'+index,editor:'text',group:'G'+index%3};});

				var form = window.createEhrControl('form',rows,getData(base,rows),{
					height:800,width:400,lineHeight:25
				});
				form.appendTo(panel);
			}
		};

		function getData(base,rows){
			var item = {};
			base.each(rows,function(row,index){
				item[row.field] = Math.random() + index;
			});
			return item;
		}
	});

	$e(function(){

		window.createEhrControl.addlookups('undefined',{
			columns:[{field:'text'}],
			data:$e.each(100,function(index){return {text:'T'+index};})
		});

		return {
			title:'Dialog',
			fn:function(panel,base){
				panel.className = 'jquery-test20160426-dialog';
				var editors = ['text','lookup','dialog'];
				var columns = base.each(9,function(index){return {field:'Column'+index,group:'G'+index%3,editor:editors[index%editors.length]};});
				var data = getData(base,columns);
				var grid = window.createEhrControl('grid',columns,data,{
					height:600,width:790,
					selectChange:function selectChange(e,r,item){form.update(item);},
					update:function selectChange(e,r,value,colimn,item){form.update(item);}
				});
				var form = window.createEhrControl('form',columns,data[0],{
					height:800,width:500,lineHeight:25,
					update:function selectChange(e,r,value,row,item){grid.update();}
				});

				var dialogGrid = window.createEhrControl('dialog',{
					title:'Grid',
					height:800,width:800,top:25,left:100
				},grid);
				var dialogForm = window.createEhrControl('dialog',{
					title:'Form',
					height:800,width:504,top:25,left:920
				},form);
				dialogGrid.appendTo(panel);
				dialogForm.appendTo(panel);
				dialogGrid.then(function(e,res){
					dialogGrid.remove();
				});

			}
		};

		function getData(base,columns){
			return base.each(Math.random()*40+20,function(row){
				var item = {};
				base.each(columns,function(column,index){
					item[column.field] = Math.random() + index;
				});
				return item;
			});
		}
	});

})(window.$ehr);