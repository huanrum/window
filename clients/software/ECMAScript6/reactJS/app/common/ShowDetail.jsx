import React from 'react';

export default class ShowDetail extends React.Component {
    render() {
        var map = (obj,func) =>{
            var list = [];
            for(var pro in obj){
                list.push(func(obj[pro],pro,obj))
            }
            return list;
        };
        return (
            <div className="show-dialog">
                <div className="header">{this.props.title}</div>
                <div className="content">
                    {
                        map(this.props.data,(val,pro)=>(
                            <div className="contnet-item">
                                <div className="title">{pro}</div><div className="value">{val}</div>
                            </div>
                        ))
                    }
                </div>
                <div className="footer text-align-center"><button onClick={this.props.remove}>关闭</button></div>
            </div>
        );
    }
}