/**
 * Created by sus on 2016/1/18.
 */
(function($e,$,Ember){
	'use strict';

	$e(function demo(){
		return {
			title : 'Demo',
			fn:function(panel,base){
				controller(createApplication());
				panel.classList.add('ember-demo');
				panel.innerHTML = $(base.template).find('.ember-demo').html();
			}
		};

		function createApplication(){
			var nodes = Ember.Application.create({});
			//nodes.Router.map(function(){
			//	this.resource('nodes',{path:'/'},function(){
			//		this.route('note',{path:'/node/:node_id'});
			//	});
			//});
			return nodes;
		}

		function controller(nodes){
			nodes.NotesController = Ember.ArrayController.extend({
				needs:['notesNode'],
				newNodeName:null,
				selectedNodeBinding:'controllers.nodesNode.model'
			});
		}
	});

	$e(function base(){
		return {
			title : 'Base'
		};
	});


})(window.$ehr,window.jQuery,window.Ember);