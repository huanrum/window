import React from 'react';
import { Link } from 'react-router';

export default class MainMenu extends React.Component {
     render() {
        return (
            <div className="main-menu">
                <ul>
                    {
                        this.props.menus.map(l=>(<li className={this.props.router.routes.indexOf(l)!==-1?'active':''}><Link to={l.path}>{l.title}</Link></li>))
                    }
                </ul>
            </div>
        );
    }
}