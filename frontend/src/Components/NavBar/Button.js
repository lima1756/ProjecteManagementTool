import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-relative-link';

class Button extends React.Component{

    constructor(props){
        super(props)
    }

    render(){
        return (
            <Link to={this.props.to} className={this.props.className}> {this.props.text} </Link>
        )
    }

    static propTypes = {
        position: PropTypes.number.isRequired,
        to: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        className: PropTypes.string.isRequired
    }
}

export default Button;