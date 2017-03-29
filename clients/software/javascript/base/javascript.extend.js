/**
 * Created by Administrator on 2017/3/21.
 */
(function ($e) {
    'use strict';

    navigator.getUserMedia = (navigator.getUserMedia || navigator.mozGetUserMedia ||  navigator.webkitGetUserMedia || navigator.msGetUserMedia);

    $e(function(){
        return {
            title:'摄像头',
            isMobile:true,
            fn:function(panel,base){
                var video = base.new('video','','',{width:'400',height:'600'});
                panel.appendChild(video);
                panel.appendChild(base.new('button','','摄像头',{onclick:function(){
                    open(video)
                }}));
            }
        };

        function open(video){

            // Prefer camera resolution nearest to 1280x720.
            var constraints = {
                audio: true,
                video: true
            };

            navigator.getUserMedia(constraints,function(stream){
                    alert(stream);
                    video.src = window.URL.createObjectURL(stream);
                    video.onloadedmetadata = function(e) {
                        video.play();
                    };
            },function(error){
                console.log("Video capture error: ", error.code);
            });

            return video;

        }

    });

})(window.$ehr);
