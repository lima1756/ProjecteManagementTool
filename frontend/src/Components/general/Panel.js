import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Panel extends Component {

    static get POSITION_NAVIGATION(){ return 0; }
    static get POSITION_BODY(){ return 1; }
    static get POSITION_FOOTER(){ return 2; }

    constructor(props){
        super(props);
        
    }

    mapChildren(position, children){
        let components = []
        children.map(child=>{
            if(child.props && child.props.position === position){
                components.push(child);
            }
            else if(!child.props){
                components.push(this.mapChildren(position, child));
            }
        })
        return components;
    }

    render() {
        if(this.props.loading){
            return (
                <div className="empty">
                    <div className="loading loading-lg"></div>
                </div>
            )
        }
        return (
            <div className="panel">
                <div className="panel-header">
                    <div className="panel-title">{this.props.title}</div>
                </div>
                <div className="panel-nav">
                    {
                        this.mapChildren(Panel.POSITION_NAVIGATION, this.props.children)
                    }
                </div>
                <div className="panel-body auto-scroll-height-60">
                    {
                        this.mapChildren(Panel.POSITION_BODY, this.props.children)
                    }
                </div>
                <div className="panel-footer">
                    {
                        this.mapChildren(Panel.POSITION_FOOTER, this.props.children)
                    }
                </div>
            </div>
        );
    }

    static propTypes = {
        loading: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired
    }
}

export default Panel;