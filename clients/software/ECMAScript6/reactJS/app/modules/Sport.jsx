import React from 'react';
import ShowList from '../common/ShowList.jsx';

export default class Sport extends React.Component {
    render() {
        return (
            <div className="main-sport">
                你喜欢运动吗？
                <ShowList list={this.props.route.path} />
            </div>
        );
    }
}