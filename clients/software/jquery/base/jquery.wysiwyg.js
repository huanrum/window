/**
 * Created by sus on 2016/2/19.
 */
(function($e,$){
	'use strict';

	$e({
		title:'Wysiwyg',
		fn:function(panel,base){
			panel.classList.add('jquery-wysiwyg');
			panel.innerHTML = $(base.template).find('.jquery-wysiwyg').html();
		},
		action:function(panel,base){
			$('#editor1').each( function(index, element){
				var toolbars = 'smilies,insertimage,insertlink,fontname,fontsize,header,bold,italic,underline,strikethrough,forecolor,highlight,alignleft,aligncenter,alignright,removeformat';
				$(element).wysiwyg({
						classes: 'some-more-classes',
						// 'selection'|'top'|'top-selection'|'bottom'|'bottom-selection'
						toolbar: 'top',
						buttons: base.filter(window.wysiwyg.toolbars(element,'../../../../Icons/'),function(value,pro){
							return toolbars.split(',').indexOf(pro) !== -1;
						},true),
						// Submit-Button
						submit: {
							title: 'Submit',
							image: '\uf00c' // <img src="path/to/image.png" width="16" height="16" alt="" />
						},
						// Other properties
						dropfileclick: 'Drop image or click',
						placeholderUrl: 'www.example.com',
						maxImageSize: [600,200]
					});
			});
		}
	});

})(window.$ehr,window.jQuery);