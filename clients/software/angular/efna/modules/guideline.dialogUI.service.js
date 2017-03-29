(function (angular) {
	'use strict';

	angular.module('cms.main').factory('guidelineDialogUiService', ['_','$q',function (_,$q) {

		function getRow(languageType,item,index){
			return {
				title: 'uploaded',
				titleExtend: languageType,
				field: '[' + index + '].guidelineName',
				editor: 'sino-upload',
				mime: 'application/pdf',
				editorInfo: 'Update File:' + languageType,
				change: function (entity, field, value) {
					item.guidelineName = value[0].name;
					item.file = value[0];
				}
			};
		}

		return function($scope,dataService) {
			return {
				rows:function($entities){
					return _.map($entities,function(item,index){
						var languageType = $scope.languageTypes[item.languageType] || item.languageType;
						return getRow(languageType,item,index);
					});
				},
				collectEntity:collectEntity
			};

			function collectEntity($entities){
				var defer = $q.defer();
				$q.all(_.map(_.filter($entities,function(entity){return entity.file instanceof Blob;}),saveFile)).then(function(){
					defer.resolve($entities);
				});
				return defer.promise;
			}

			function saveFile(entity){
				return dataService.saveFile(entity.file).then(function(req){
					entity.path = req.data.path;
					delete entity.file;
				});
			}
		};
	}]);

})(window.angular);