/**
 * Created by sus on 2016/1/14.
 */
(function($e,Ext){
	'use strict';

	$e(function tree(){
		return {
			title: 'Tree',
			fn: function (panel) {
				panel.classList.add('ext-tree');
			},
			action:function(panel,base){
				if(!this.init){
					this.init = true;
					Ext.QuickTips.init();
					getTree(base).render(panel);
				}
			}
		};

		function getTree(base){
			var root = new Ext.tree.TreeNode({text:'Menu'});
			addNode(base,root,0);
			var tree = new Ext.tree.TreePanel({root:root});
			tree.on('dblclick',function(node){
					Ext.Msg.alert('Click',node.text);
			});
			tree.on('click',function(node){
				node.ui.addClass('selected-node');
			});
			addMenu(tree);
			return tree;
		}

		function addMenu(tree){
			var treeEditor = new Ext.tree.TreeEditor(tree,{});

			var contextmenu = new Ext.menu.Menu({items:[
				{text:'New',handler:addNode},
				{text:'Delete',handler:deleteNode}
			]});

			tree.on('contextmenu',function(node,event){
				event.preventDefault();
				node.select();
				contextmenu.showAt(event.getXY());
			});

			function addNode(){
				var parentNode = tree.getSelectionModel().getSelectedNode();
				var child = new Ext.tree.TreeNode({
					text:parentNode.text +' - ' +parentNode.childNodes.length//,icon:'../../../../Icons/files/directory.png'
				});
				parentNode.expand(false,true);
				parentNode.appendChild(child);

				setTimeout(function(){
					treeEditor.editNode = child;
					treeEditor.startEdit(child.ui.textNode);
				});
			}
			function deleteNode(){
				tree.getSelectionModel().getSelectedNode().remove();
			}
		}

		function addNode(base,parentNode,level){
			if(level > 3){return;}
			base.each(Math.floor(Math.random() * 12),function(index){
				var child = new Ext.tree.TreeNode({text:parentNode.text +' - ' +index});
				addNode(base,child,level+1);
				parentNode.appendChild(child);
			});
		}
	});

	$e(function layout(){
		return {
			title: 'Layout',
			fn: function (panel) {
				panel.classList.add('ext-layout');
			},
			action:function(panel,base){
				if(!this.init){
					this.init = true;
					accordionLayout().show(panel);
					borderLayout().show(panel);
					cardLayout().show(panel);
					columnLayout().show(panel);
					anchorLayout().show(panel);
					fitLayout().show(panel);
					containerLayout().show(panel);
				}
			}
		};

		function accordionLayout() {
			return new Ext.Window({
				title: 'AccordionLayout',
				width: 250,
				height: 550,
				plain: true,
				layout: 'accordion',
				layoutConfig: {
					activeOnTop: true,
					fill: true,
					hideCollapseTop: false,
					titleCollapse: true,
					animate: true
				},
				items: [
					new Ext.Panel({title: 'Tab-01', html: 'this is 01 panel'}),
					new Ext.Panel({title: 'Tab-02', html: 'this is 02 panel'}),
					new Ext.Panel({title: 'Tab-03', html: 'this is 03 panel'})
				]
			});
		}

		function borderLayout() {
			return new Ext.Window({
				title: 'BorderLayout',
				width: 400,
				height: 500,
				layout: 'border',
				items: [
					{title: 'Tab-01',region: 'north',height: 50,width: 400,html: 'this is 01 panel'},
					{title: 'Tab-02',region: 'center',height: 50,width: 400,html: 'this is 02 panel'},
					{title: 'Tab-03',region: 'south',height: 50,width: 400,html: 'this is 03 panel'}
				]
			});
		}

		function cardLayout() {
			return new Ext.Window({
				title: 'CardLayout',
				width: 500,
				height: 300,
				frame: true,
				layout: 'card',
				activeItem: 0,
				layoutConfig: {
					animate: true
				},
				items: [
					{title: 'Tab-01', html: 'this is 01 panel'},
					{title: 'Tab-02', html: 'this is 02 panel'}
				]
			});
		}

		function columnLayout() {
			return new Ext.Window({
				title: 'ColumnLayout',
				width: 470,
				height: 300,
				frame: true,
				layout: 'column',
				defaults:{
					bodyStyle:'background-color:#ffffff',
					frame: true
				},
				items: [
					{title: 'Tab-01',height: 300,columnWidth: 0.3, html: 'this is 01 panel'},
					{title: 'Tab-02',height: 300,columnWidth: 0.7, html: 'this is 02 panel'}
				]
			});
		}

		function anchorLayout() {
			return new Ext.Window({
				title: 'AnchorLayout',
				width: 420,
				height: 300,
				frame: true,
				layout: 'anchor',
				autoScroll:true,
				defaults:{
					bodyStyle:'background-color:#ffffff',
					frame: true
				},
				items: [
					{title: 'Tab-01',anchor:'30% 30%', html: 'this is 01 panel'},
					{title: 'Tab-02',anchor:'-30 100', html: 'this is 02 panel'},
					{title: 'Tab-03',anchor:'r b', html: 'this is 03 panel'}
				]
			});
		}

		function fitLayout() {
			return new Ext.Window({
				title: 'FitLayout',
				width: 420,
				height: 240,
				frame: true,
				layout: 'fit',
				items: [
					{title: 'Tab-01',border:false, html: 'this is 01 panel'},
					{title: 'Tab-02',border:false, html: 'this is 02 panel'}
				]
			});
		}

		function containerLayout() {
			return new Ext.Window({
				title: 'ContainerLayout',
				width: 420,
				height: 150,
				frame: true,
				layout: 'column',
				items: [
					{title: 'Tab-01',columnWidth: 0.4, html: 'this is 01 panel'},
					{title: 'Tab-02',columnWidth: 0.6, html: 'this is 02 panel'}
				]
			});
		}
	});

})(window.$ehr,window.Ext);