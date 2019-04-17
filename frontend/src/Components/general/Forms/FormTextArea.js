import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FormTextArea extends Component {
    render() {
        return (
            <div className="form-group">
                <label className="form-label" htmlFor={this.props.inputId}>{this.props.inputName}</label>
                <textarea className={this.props.status.value===0?"form-input":this.props.status.value===1?"form-input is-success":"form-input is-error"}
                    id={this.props.inputId} placeholder={this.props.inputName} rows="3" onChange={this.props.onChange} value={this.props.value}/>
                { this.props.status.message!=='' && <p className="form-input-hint">{this.props.status.message}</p> }
            </div>
        );
    }

    static propTypes = {
        inputName: PropTypes.string.isRequired,
        inputId: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        status: PropTypes.shape({
            value: PropTypes.number,
            message: PropTypes.string
        })
    }

    static defaultProps = {
        status: {
            value: 0,
            message: ''
        }
    }
}

export default FormTextArea;