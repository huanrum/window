/**
 * Created by Administrator on 2016/6/11.
 */
(function(angular){

    'use strict';

    angular.module('staff.common').directive('protalHeaderContainer',['$compile','$global',function($compile,$global){

        function getTemplate(){
            return [
                '<a ng-click="logout()" class="header-logout">',
                    '<img class="logout-img" src="images/btn_logout32.png" />',
                    '<label class="pc-white-font logout-label pointer"> Logout </label>',
                '</a>',

                '<a href="javascript:history.back();" class="header-back">',
                    '<img class="back-img" src="images/BE_back_button.png"> ',
                    '<label class="pc-white-font back-label pointer"> Back </label>',
                '</a>',
                 //   <!-- weather div -->
                '<div class="weatherDiv">',
                '   <img ng-src="{{weatherImg}}" style="width:36px;height:36px;" />',
                '   <label class="pc-white-font back-label">',
                '       <span>{{low}}°C</span> -- <em>{{high}}°C</em><span>{{curTime}}</span>',
                '   </label>',
                '</div>',
                 //   <!-- staff div -->
                '<div class="right20 pull-right">',
                '   <img ng-src="images/top_bar_staff_icon.png">',
                '   <label class="pc-white-font back-label">{{userName}} ({{userNo}}) </label>',
                '</div>',
                 //<!-- Location div -->
                 '<div class="right20 pull-right">',
                    '<img ng-src="images/top_bar_location_icon.png">',
                    '<label class="pc-white-font back-label">{{location}} </label>',
                '</div>',
                '<div class="right20 pull-right" ng-click="goToGuestRoom()">',
                     '<img ng-src="images/BE_silentCheckIn.png">',
                     '<label class="pc-white-font back-lanel">{{CheckInProgressNum}}</label>',
                '</div>'
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