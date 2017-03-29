import React from 'react';
import ShowGrid from '../common/ShowGrid.jsx';

export default class Food extends React.Component {
    render() {
        return (
            <div className="main-food">
                想吃什么自己拿。
                <ShowGrid list={this.props.route.path} />
            </div>
        );
    }
}