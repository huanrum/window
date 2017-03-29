/**
 * Created by Administrator on 2016/10/14.
 */
(function($e){
    'use strict';

    $e.reLoginInterval = 60*60*1000;

    $e.account = {
        gridOption : {height:25,maxWidth:500,hideId:true,hideTooltip:true,readonly:true,showToolbar:true},
        getUrls:function(api,data){
            var url = '../../../../'+api;
            if(data){
                url += '?'+$e.each(data,function(v,k){return k+'='+v;}).join('&');
            }
            return url;
        }
    };


})(window.$ehr);