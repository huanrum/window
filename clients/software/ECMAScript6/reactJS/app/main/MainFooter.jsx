import React from 'react';

export default class MainFooter extends React.Component {
    render() {
        return (
            <div className="main-footer">
                {this.props.active}
            </div>
        );
    }
}