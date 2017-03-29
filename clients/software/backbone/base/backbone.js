/**
 * Created by sus on 2016/1/21.
 */
(function($e,$,Backbone,_){
	'use strict';

	$e(function underScope(){
		return {
			title:'UnderScope',
			fn:function(panel,base){
				panel.classList.add('backbone-underScope');
				base.toElements(_,function(el){panel.appendChild(el);});
			}
		};
	});

	$e(function event(){
		return {
			title:'Event',
			fn:function(panel,base){
				panel.classList.add('backbone-event');
				base.toElements(addClass(base),function(el){panel.appendChild(el);},function(e,value,pro,obj){
					obj.trigger('change:'+ pro);
				});
			}
		};

		function addClass(base){
			var Person = Backbone.Model.extend({default:{
				name:'',sex:'feman',sge:32,score:120
			}});

			var man = new Person();
			man.set({
				name:'',sex:'feman',sge:32,score:120
			});

			base.each(man,function(value,pro){
				man.on('change:'+ pro,function(model,newvalue){
					window.alert(value);
				});
			});

			return man;
		}
	});

	$e(function template() {
		return {
			title: 'Template',
			fn: function (panel, base) {
				panel.classList.add('backbone-template');
				addClass(panel,base);
			}
		};

		function addClass(panel,base){
			_.templateSettings = {
				interpolate:/\{\{.+?\}\}/g
			};

			var Student = Backbone.Model.extend({default:{
				code:'',name:'',score:120
			}});

			var student = new Student({
				code:'20121145',name:'Seto Sun',score:120
			});

			var StudentView = Backbone.View.extend({
				el:$(base.template).find('#ulshowstus').appendTo(panel),
				initialize:function(){
					this.template = _.template($(base.template).find('#stus-tpl').html());
				},
				render:function(){
					this.$el.html(this.template(this.model.toJSON()));
				}
			});

			var studentView = new StudentView({model:student});
			studentView.render();
			return studentView;
		}
	});

})(window.$ehr,window.jQuery,window.Backbone,window._);