/**
 * Created by Administrator on 2016/5/21.
 */
(function($e){
    'use strict';
    $e(function(){
        return {
            title:'phone',
            isMobile:true,
            fn:function(panel,base){
                loadData(panel,base);
            }
        };

        function loadData(panel,base){
            base.http($e.account.getUrls('accountconsume/getdata',{order:false,date:base.dateFomatter(new Date(),'yyyy-MM')}),function(req){
                base.http($e.account.getUrls('accountconsume/getcolumns'),function(columnData){
                    panel.innerHTML = '';
                    panel.appendChild(createButton(base,panel,JSON.parse(columnData)));
                    panel.appendChild(base.toListView(base.arrangement(JSON.parse(req)),createRow(panel,base,JSON.parse(columnData))));
                });
            });
        }


        function createButton(base,panel,columns){
            var btn = base.new('div',{width:'100%',textAlign:'center',background:'#99ff99',margin:'0.5em 0',fontSize:'4em'},'+');
            btn.onclick = function(){openDialog(base,panel,columns,{item:{consumeDate:base.dateFomatter(new Date(),'yyyy-MM-dd')}});};
            return btn;
        }

        function createRow(panel,base,columns) {
            return function (item,index) {
                var row = base.new('div', {width: '100%',borderBottom:'2px solid #d3d3d3' });
                var contentList = base.new('div', {display: 'inline-block'});
                var buttons = base.new('div', {display: 'inline-block',float:'right',padding:'0.5em',position: 'absolute',right:'0'});

                createContent(contentList, item,columns);
                row.appendChild(contentList);
                createButton(buttons, item);
                row.appendChild(buttons);
                return row;
            };

            function createButton(parent, item,top) {
                var deleteButton = base.new('div', {fontSize:'10em',color:'#ff0000'}, '&times;');
                deleteButton.onclick = function (e) {
                    base.alert(base.translate(['', '你确定删除这条数据？'], 'You can Delete the item?'), function () {
                        base.http($e.account.getUrls('accountconsume/deletedata'), item, function () {
                            loadData(panel, base);
                        });
                    });
                };
                parent.appendChild(deleteButton);
            }

            function createContent(parent, item,columns) {
                base.filter(columns,function(i){return i.show;},function(column){
                    var field = column.name&&(column.name[0].toLocaleLowerCase()+column.name.slice(1));
                    var el = base.new('div', {display: 'inline-table', width: '46%',margin:'0.2em 0.5em',fontSize:'2em'},formatter(column,item[field]));
                    base.each(column.style,function(style){
                        base.new(el,base.each(style.split(';')).toObject(function(i){return i.split(':').shift();},function(i){return i.split(':').pop();}));
                    });
                    parent.appendChild(el);
                });
                parent.onclick = function () {
                    openDialog(base,panel,columns,item);
                };

                function formatter(column,value){

                    switch (Object.prototype.toString.apply(value)){
                        case '[object Date]':
                            return base.dateFomatter(value);
                        default:
                            var select = base.filter(column.selection,function(i){return i.id ===value; },0);
                            return select&&base.translate([select.name,select.info]) || value || '--';
                    }
                }
            }


        }

        function openDialog(base,panel,columns,entity) {
            var name = base.translate(['', '消费信息'], 'Entering');
            var form = base.editForm(columns, entity, [
                {
                    name: 'Ok',
                    fn: function (e, data) {
                        if (!data.valueChange) {
                            base.alert(base.translate(entity.id > 0 ? 'Edit ' : 'Add ') + name + base.translate(['', '没有修改不需要保存！'], ' no update to save'), 1);
                            return;
                        }
                        if (data.canSubmit) {
                            this.disabled = true;
                            base.http( $e.account.getUrls('accountconsume/postdata'), entity, function (req) {
                                panel.removeChild(dialog);
                                loadData(panel, base);
                            }, function (error) {
                                this.disabled = false;
                            });
                        } else {
                            base.alert(base.translate(entity.id > 0 ? 'Edit ' : 'Add ') + name + base.translate(['', '验证不通过！'], ' validate is faile'), 2);
                        }
                    }
                },
                {
                    name: 'Cancel',
                    fn: function () {
                        panel.removeChild(dialog);
                    }
                }
            ]);
            var dialog = base.dialog(base.translate(entity.id > 0 ? 'Edit ' : 'Add ') + name, form);
            panel.appendChild(dialog);
        }


    });

})(window.$ehr);