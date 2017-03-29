/**
 * Created by sus on 2016/1/8.
 */
(function($e,$){
	'use strict';

	$e({
		title:'Selector',
		fn:function(panel,base){
			panel.classList.add('jquery-selector');
			panel.innerHTML = $(base.template).find('.jquery-selector').html();
		}
	});

	$e({
		title:'Event',
		fn:function(panel,base){
			var content =  $(base.template).find('.jquery-event').appendTo(panel);
			panel.classList.add('jquery-event');

			content.find('input[type=button]').on('click',function(){
				content.find('span').toggle();
				content.find('button').
				off('click.my').
				on('click.my',function(){window.alert('Namespace');}).
				trigger('click');
			});

			content.find('span').each(function(){
				base.addTooltip(this,'Message !!!!');
			});
		}
	});


	$e({
		title:'Style',
		fn:function(panel,base){
			var content =  $(base.template).find('.jquery-style').appendTo(panel);
			panel.classList.add('jquery-style');
			content.find('#switcher-default').click(function(){
				window.alert(content.find('#speech').css('fontSize'));
			});
			content.find('#switcher-large').click(function(){
				content.find('#speech').css('fontSize',parseFloat(content.find('#speech').css('fontSize'))*1.25);
			});
			content.find('#switcher-small').click(function(){
				content.find('#speech').css('fontSize',parseFloat(content.find('#speech').css('fontSize'))*0.8);
			});
		}
	});



	$e({
		title:'Animation',
		fn:function(panel,base){
			var content =  $(base.template).find('.jquery-animation').appendTo(panel);
			panel.classList.add('jquery-animation');
			content.find('button').click(function(){
				var $p = content.find('p');
				if(this.id === 'animation-default'){
					$p.hide(2000).show(2000);
				}
				if(this.id === 'animation-slide'){
					$p.fadeOut(2000).fadeIn(2000);
				}
				if(this.id === 'animation-fade'){
					$p.slideUp(2000);
					$p.slideDown(2000);
				}
			});
		}
	});

	$e({
		title:'DOM',
		fn:function(panel,base){
			var content =  $(base.template).find('.jquery-dom').appendTo(panel);
			panel.classList.add('jquery-dom');
			content.find('.jquery-dom-p').attr({a:1,b:2}).clone().appendTo(content);
			var info = $('<div style="color:#ff0000;text-underline:single #666666;"></div>').appendTo(content);
			info.html([
					'.append() .appendTo()    .prepend()   .prependTo()',
					'.after()  .insertAfter() .before()    .insertBefore()',
					'.wrap()   .wrapAll()     .warpInner()',
					'.html()   .text()       .replaceAll() .replaceWith()',
					'.empty()',
					'.remove() .detach()'
				].join('<br>')
			);
		}
	});

	$e({
		title:'AJAX',
		fn:function(panel,base){
			var content =  $(base.template).find('.jquery-ajax').appendTo(panel);
			panel.classList.add('jquery-ajax');

			$('<button>GetJson</button>').appendTo(content).click(function(){
				$.get('../data/jquery.ajax.json',function(req){
					window.alert(JSON.stringify(req));
				});
			});

			$('<button>GetXML</button>').appendTo(content).click(function(){
				$.get('../data/jquery.ajax.xml',function(req){
					window.alert(req.documentElement.outerHTML);
				});
			});

			$('<div></div>').appendTo(content).html('$.ajax, $.get, $.getJson $().load, $.ajaxSetup, $.ajaxStart, $.ajaxStop');

		}
	});

	$e({
		title:'Plugin',
		fn:function(panel,base){
			var content =  $(base.template).find('.jquery-plugin').appendTo(panel);
			panel.classList.add('jquery-ajax');
		}
	});


	$e({
		title:'jQuery Closure',
		fn:function(panel,base){
			var content =  $(base.template).find('.jquery-closure').appendTo(panel);
			panel.classList.add('jquery-ajax');
		}
	});

	$e({
		title:'Advanced',
		fn:function(panel,base){
			var content =  $(base.template).find('.jquery-advanced').appendTo(panel);
			panel.classList.add('jquery-advanced');
		}
	});

	$e({
		title:'UI',
		info:' jQuery.ui.js jQuery.ui.css',
		fn:function(panel,base){
			var content =  $(base.template).find('.jquery-ui').appendTo(panel);
			panel.classList.add('jquery-ui');

			content.filter('.jquery-ui-tabs').tabs({event:'mouseover'});
			content.find('.jquery-ui-accordion').accordion({active:1});

			var dialog = content.find('.jquery-ui-dialog #jquery-ui-dialog').hide();
			content.find('.jquery-ui-dialog .btn').click(function(){dialog.dialog({buttons:{'Yes':function(){dialog.dialog('close');}}});});

			content.find('.jquery-ui-button>*').button();

			content.find('.jquery-ui-progress>div').progressbar();
			var run = base.eachrun(function progress(){
				progress.value = (progress.value || 0) + 1 +Math.floor(Math.random() * 5);
				if(progress.value>100){progress.value = 0;}
				content.find('.jquery-ui-progress>div').progressbar('value',progress.value);
				content.find('.jquery-ui-progress>span').html(progress.value + '%');
			},1000);

			content.find('.jquery-ui-slider>div').slider({range:true,slide:function(){
				content.find('.jquery-ui-slider>span').html($(this).slider('values')[0]+ '% - '+$(this).slider('values')[1]+ '%');
			}});

			content.find('.jquery-ui-datepicker>input').datepicker({numberOfMonths:[1,2],minDate:-5,maxDate:'1w'});

			content.find('.jquery-ui-autocompletion>input:first').autocomplete({
				source:[
					'aaaaa','aassss','aaddeee','aassdd'
				]
			});
			content.find('.jquery-ui-autocompletion>input:last').autocomplete({
				source:function(req,callback){
					$.getJSON('../data/jquery.ui.autocompletion.json',function(data){
						callback(base.filter(data,function(i){
							return i.indexOf(req.term) !== -1;
						}));
					});
				}
			});

			content.find('.jquery-ui-drag>*').draggable({
				helper:'clone',
				cursos:'pointer',
				grid:[40,20],
				contsinment:content.find('.jquery-ui-drag')
			});

			content.find('.jquery-ui-select').selectable();

			content.find('.jquery-ui-permutation').sortable({cursos:'move'});

			content.find('.jquery-ui-zoom').resizable({animate:true});

		}
	});

})(window.$ehr,window.jQuery);