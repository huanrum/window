/**
 * Created by Administrator on 2016/6/11.
 */
(function(angular){

    'use strict';

    angular.module('staff.common').directive('protalContentContainer',['$compile','$global',function($compile,$global){

        function getTemplate(){
            return [
                '<div class="home"></div>'
            ].join('');
        }
        
        return {
            restrict: "AE",
            scope:'=',
            template:getTemplate(),
            link: function ($scope) {

            }
        };

    }]);
})(window.angular);