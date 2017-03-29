(function(angular){
    'use strict';

    angular.element(function(){
        angular.element('<protal-login-dialog />').prependTo(window.document.body);
        angular.bootstrap(window.document.body,['staff.main']);

    });

})(window.angular);