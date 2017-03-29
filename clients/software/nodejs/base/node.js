/**
 * Created by sus on 2016/3/17.
 */
(function($e,$){
	$e(function service() {
		return {
			title: 'Service Test',
			fn: function (panel, base) {
				panel.classList.add('node-service-test');
				$('<button>Test</button>').appendTo(panel).click(function(){
					$.get('https://localhost:3000/',function(data){
						alert(data);
					});
				});
			}
		};
	});
})(window.$ehr,window.jQuery);