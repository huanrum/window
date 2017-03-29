/**
 * Created by sus on 2016/1/28.
 */
(function(){
	'use strict';
	window.namespace('sun',
		function seto(){

			this.laseName = 'Seto';

		},
		function jian() {

			this.name = 'jian';

		},
		function seto(){

			this.firstName = 'Sun';
			this.sex = 1;
			this.say = function(){
				window.alert('my name is ' + this.laseName + ' ' + this.firstName);
			};

		},
		function jia() {

			this.name = 'jian';

		}



	);

})();
