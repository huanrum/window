/**
 * Created by sus on 2016/1/29.
 */
(function($e,angular){
	'use strict';

	$e(function test(){

		initialization(angular.module('angular.test',['ngFileUpload']));

		var dragoverList = [];

		return {
			title:'Test',
			action:function(panel){
				panel.style.height = panel.parentNode.scrollHeight - 36 + 'px';
			},
			fn:function(panel,base){
				panel.classList.add('angular-test');
				angular.element(base.template).find('.angular-test').appendTo(panel);
				angular.bootstrap(panel,['angular.test']);

				panel.addEventListener('dragover', function(evt){
					evt.stopPropagation();
					evt.preventDefault();
				});
				panel.addEventListener('drop', function(evt){
					evt.stopPropagation();
					evt.preventDefault();
					$e.each(dragoverList,function(fn){
						fn.call(panel,evt.dataTransfer.files);
					});
				});
			}
		};

		function initialization(module) {

			function openInput(callBack) {
				var fileElem = angular.element('<input type="file">').appendTo(document.body);
				fileElem.css('visibility', 'hidden').css('position', 'absolute').css('overflow', 'hidden')
					.css('width', '0px').css('height', '0px').css('border', 'none')
					.css('margin', '0px').css('padding', '0px').attr('tabindex', '-1');

				fileElem.bind('change', function (evt) {
					fileElem.remove();
					callBack(evt.__files_ || (evt.target && evt.target.files));
				});
				return fileElem;
			}

			function getLoadItem(message){
				function LoadItem(){}
				var self = new LoadItem();
				self.percentage = 0;
				self.message = message;
				self.FileArchiveDocId =  0;//req.data.FileArchiveDocId.FileArchiveDocId
				Object.defineProperty(self, 'percentage256', {
					get: function(){
						var percentage256 = Math.floor(255 - self.percentage * 255 / 100).toString(16);
						if(percentage256.length === 1){
							percentage256 = '0' + percentage256;
						}
						return percentage256;
					}
				});
				Object.defineProperty(self, 'color256', {
					get: function(){
						var color256 = Math.floor(self.percentage * 255 / 100).toString(16);
						if(color256.length === 1){
							color256 = '0' + color256;
						}
						return color256;
					}
				});
				return self;
			}

			module.controller('angularTestController',
				['$scope','$q', '$http', '$timeout','UploadBase', function ($scope, $q,$http, $timeout,UploadBase) {
					$scope.uploads = [];

					$scope.uploadFile = function (file, upload) {
						$scope.uploads.push(upload);
						UploadBase.upload({
							url: '../../../../ExplorerCatalog/UploadFile',
							file: file,
							resumeChunkSize: '1mb',
							resumeSize: function(){
								var defer = $q.defer();
								this._end = this._chunkSize;
								defer.resolve(0);
								return defer.promise;
							},
							fields: {
								action: 'Upload',
								SectionType: 'BusinessPartnerActivity',
								fileName: file.name,
								fileType:file.type
							}
						}).then(noThing, noThing, processBar);

						function noThing() {}

						function processBar(p) {
							upload.percentage = Math.floor(p.loaded / p.total * 100);
						}
					};

					$scope.openFileDialog = function () {
						openInput(upload).click();
					};

					init();

					dragoverList[dragoverList.length] = upload;


					function upload(files){
						$e.each(files, function (file) {
							$scope.uploadFile(file,getLoadItem(file.name));
						});
					}

					function init(){
						var uploadItem = getLoadItem('Test Progress Bar');
						$scope.uploads.push(uploadItem);
						$e.eachrun(function () {
							$timeout(function () {
								uploadItem.percentage = uploadItem.percentage + 2 * (uploadItem.direction || 1);
								if (uploadItem.percentage > 99) {
									uploadItem.direction = -1;
								}
								if (uploadItem.percentage < 0) {
									uploadItem.direction = 1;
								}
							});
						}, 200);
					}

				}]);
		}
	});

})(window.$ehr,window.angular);