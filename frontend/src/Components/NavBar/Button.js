import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-relative-link';

class Button extends React.Component{

    constructor(props){
        super(props)
    }

    render(){
        if(this.props.to)
            return (
                <Link to={this.props.to} className={this.props.className}> {this.props.text} </Link>            
            )
        return(
            <button className={this.props.className} onClick={this.props.onClick}> {this.props.text} </button>
        )
    }

    static propTypes = {
        position: PropTypes.number.isRequired,
        to: PropTypes.string,
        text: PropTypes.string.isRequired,
        className: PropTypes.string.isRequired,
        onClick: PropTypes.func
    }
}

export default Button;