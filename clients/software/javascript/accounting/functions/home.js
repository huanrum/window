/**
 * Created by Administrator on 2016/5/21.
 */
(function($e){
    'use strict';
    $e(function(){
        return {
            title:['Current Month','当前月记录'],
            fn:function(panel,base){
                loadData(panel,base);
            }
        };

        function loadData(panel,base){
            base.http($e.account.getUrls('accountconsume/getdata',{order:false,date:base.dateFomatter(new Date(),'yyyy-MM')}),function(req){
                base.http($e.account.getUrls('accountconsume/getcolumns'),function(columnData){
                    var columns = JSON.parse(columnData);
                    var toolbarColumn = addToolbarColumn(base,$e.account.getUrls('accountconsume/deletedata'),cellDbClick,afterBack);
                    var grid = base.toGrid(base.arrangement(JSON.parse(req)).concat([{consumeDate:base.dateFomatter(new Date(),'yyyy-MM-dd')}]),base.extend({columns:columns.concat([toolbarColumn]),navigator:getNavigator(panel,base,columns)},base.extend({className:'root-grid-data'},$e.account.gridOption)),cellDbClick);
                    panel.innerHTML = '';
                    panel.appendChild(grid);

                    function afterBack(){
                        loadData(panel,base);
                    }
                    function cellDbClick(e, data) {
                        if(!data.item){
                            if(/.*Fk$/.test(data.column.name) && data.column.edit){
                                openChildData(panel,base,data.column);
                            }
                        }else{
                            openDialog(panel,base,base.translate(['','消费信息'],'Entering'),columns,$e.account.getUrls('accountconsume/postdata'),data.item,function(){
                                loadData(panel,base);
                            });
                        }
                    }
                });
            });
        }

        function openChildData(panel,base,column,selectValue){
            base.http($e.account.getUrls('accounttype/getcolumns'),function(columnData) {
                var columns = JSON.parse(columnData);
                base.http($e.account.getUrls('accounttype/getdata',{column:column.name}), function (items) {
                    var toolbarColumn = addToolbarColumn(base,$e.account.getUrls('accounttype/deletedata'),cellDbClick,afterBack);
                    var grid = base.toGrid(base.arrangement(JSON.parse(items)), base.extend({columns:columns.concat([toolbarColumn]),selectItemFn:function(i){return i.id ===selectValue;}},$e.account.gridOption),cellDbClick );
                    var dialog = base.dialog( base.translate('Show ') + base.translate(column.title,column.name.slice(0,column.name.length-2)), grid,[function Ok(){panel.removeChild(dialog);}]);
                    panel.appendChild(dialog);

                    function afterBack(columnItem,type){
                        panel.removeChild(dialog);
                        openChildData(panel,base,column);
                        if(typeof columnItem === 'number'){
                            column.selection = column.selection.filter(function(i){return i.id !== columnItem;});
                        }
                        if(columnItem && columnItem.id){
                            column.selection = column.selection.push(columnItem);
                        }
                    }
                    function cellDbClick(e, data) {
                        if(data.item){
                            openDialog(panel,base,base.translate(column.title,column.name.slice(0,column.name.length-2)),columns,$e.account.getUrls('accounttype/postdata'),data.item.$back ||data.item,afterBack);
                        }
                    }
                });
            });
        }

        function openDialog(panel,base,name,columns,postUrl,entity,afterBack){
            var form = base.editForm(columns, entity, [
                {
                    name: 'Ok',
                    fn: function (e, data) {
                        if(!data.valueChange){
                            base.alert( base.translate(entity.id > 0 ? 'Edit ' : 'Add ') +name + base.translate(['','没有修改不需要保存！'],' no update to save'), 1);
                            return;
                        }
                        if (data.canSubmit) {
                            this.disabled = true;
                            base.http(postUrl, entity, function (req) {
                                panel.removeChild(dialog);
                                afterBack(JSON.parse(req));
                            }, function (error) {
                                this.disabled = false;
                            });
                        } else {
                            base.alert( base.translate(entity.id > 0 ? 'Edit ' : 'Add ') +name + base.translate(['','验证不通过！'],' validate is faile'), 2);
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
            var dialog = base.dialog( base.translate(entity.id > 0 ? 'Edit ' : 'Add ') + name, form);
            panel.appendChild(dialog);
        }

        function getNavigator(panel,base,columns){
            return base.each(columns,function(column){
                if(/.*fk$/.test(column.name.toLocaleLowerCase()) && column.edit){
                    return {
                        name:column.name.toLocaleLowerCase(),
                        fn:function(e,column,item,value){
                            openChildData(panel,base,column,value);
                        }
                    };
                }
            }).toObject('name','fn');
        }

        function addToolbarColumn(base,deleteUrl,cellClick,afterBack){
            return {
                name: '@@Fk',
                title:['Edit Base','编辑基本类型'],
                width:160,
                field:'',
                show:true,
                edit:true,
                getValue:function(){},
                formatter:function(entity){
                    var editButton = document.createElement('button'),deleteButton = document.createElement('button');
                    var buttons = [editButton,deleteButton];
                    editButton.innerHTML = base.translate('Edit');
                    deleteButton.innerHTML = base.translate('Delete');
                    editButton.style.margin = '2px 10px';
                    deleteButton.style.margin = '2px 10px';
                    editButton.onclick = editButtonClick(this,entity);
                    deleteButton.onclick = deleteButtonClick(this,entity);
                    return entity.id && buttons;
                }
            };

            function editButtonClick(column,item){
                return function(e){
                    cellClick(e, {
                        action:'edit',
                        list: [item],
                        item: item,
                        column: column,
                        value: null
                    });
                };
            }
            function deleteButtonClick(column,item){//$ehr.alert
                return function(e){
                    base.alert(base.translate(['','你确定删除这条数据？'],'You can Delete the item?'),function(){
                        base.http(deleteUrl,item,function(){
                            afterBack(item.id);
                        });
                    });
                };
            }
        }

    });

})(window.$ehr);