import React from 'react';

export default class MainContent extends React.Component {
    render() {
        return (
            <div className="main-content">
                {this.props.active}
                {this.props.children}
            </div>
        );
    }
}