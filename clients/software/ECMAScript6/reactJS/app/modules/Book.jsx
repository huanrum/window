import React from 'react';
import ShowList from '../common/ShowList.jsx';

export default class Book extends React.Component {
    render() {
        return (
            <div className="main-book">
                这里有好多的书籍
                <ShowList list={this.props.route.path} />
            </div>
        );
    }
}