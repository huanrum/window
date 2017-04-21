/**
 * Created by Administrator on 2017/3/2.
 */
(function ($e) {
    'use strict';

    $e.binding.reserve = true;

    $e(function(){
        var binding = $e.binding([
                '<div>',
                '   <div (innerHTML)="count" (style.fontSize)="fontsize"></div>',
                '   <input (value)="name" (style.background)="background" (onclick)="onchangebackground">',
                '   <input (value)="name">',
                '   <div (innerHTML)="fontsize" (style.fontSize)="fontsize" (onclick)="onclick"></div>',
                '</div>'
            ].join(''),
            {
                name: 123456789,
                count:0,
                background: '#999999',
                fontsize: '40px',
                onclick: function () {
                    alert(this.name);
                },
                onchangebackground: function () {
                    this.background = $ehr.color();
                    this.fontsize = Math.floor(Math.random() * 40) + 10 + 'px';
                }
            });

        setInterval(function(){
            binding.data().background = $ehr.color();
            binding.data().count = parseInt(binding.data().count) + 1;
        },200);

        return {
            title:'watch',
            action:function(panel){
                binding.appendTo(panel);
            }
        };
    });

    $e(function(){
        var binding = $e.binding([
                '<div  [class]="class">',
                '   <div [innerHTML]="count+(counter+1) +\':\'+count" [style.fontSize]="fontsize + \'px\'" [style.color]="color(background)"></div>',
                 '   <input [value]="name" [style.background]="background" [onclick]="onchangebackground">',
                 '   <input [value]="name">',
                 '   <input [value]="name">',
                 '   <input [value]="name">',
                 '   <textarea [value]="name"></textarea>',
                 '   <div [innerHTML]="fontsize" [style.fontSize]=" fontsize + \'px\' " [onclick]="onclick"></div>',
                '</div>'
            ].join(''),
            {
                class:'bg-f9f9f9',
                name: 123456789,
                counter:0,
                count:0,
                background: '#999999',
                fontsize: '40',
                color:function(background){
                    return $ehr.color(this.count);
                },
                onclick: function () {
                    alert(this.name);
                },
                onchangebackground: function () {
                    this.background = $ehr.color();
                    this.fontsize = Math.floor(Math.random() * 40) + 10;
                }
            });

        return {
            title:'defineProperty',
            fn:function(panel){
                binding.appendTo(panel);
            },
            action:function(panel,base){
                panel.unload(base.eachrun(function (index) {
                    var data = binding.data();
                    data.background = $ehr.color();
                    data.counter = index % 10;
                    data.count = index;

                }, 1000));
            }
        };
    });
})(window.$ehr);
