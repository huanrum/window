/**
 * Created by Administrator on 2017/5/31.
 */
(function ($e) {
    'use strict';

    $e(function base() {
        var src = location.protocol + '//' +  location.hostname + ':8888';
        var file = '..\\command\\start.sh.lnk';
        return {
            title: 'Base',
            fn: function (panel, base) {
                base.http(src+'/test',null,function(req){
                    panel.appendChild(base.new('iframe','fixed','',{},{src:src,width:'100%',height:'100%'}));
                },function(){
                    panel.appendChild(base.new('button','','ReStart',{onclick:function(){
                        base.http('../../../../explorerCatalog/run?file='+file,null,function(req){
                            if(JSON.parse(req)){
                                panel.appendChild(base.new('div','',req));
                            }else{
                                panel.innerHTML = '';
                                panel.appendChild(base.new('iframe','fixed','',{},{src:src,width:'100%',height:'100%'}));
                            }
                        });
                    }}));
                });
            }
        };
    });

})(window.$ehr);
