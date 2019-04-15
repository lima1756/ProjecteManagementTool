import React from 'react';
import PropTypes from 'prop-types';

class FormInput extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            [props.inputId]:''
        }
    }

    render() {
        let input = (
            <input className={this.props.status.value===0?"form-input":this.props.status.value===1?"form-input is-success":"form-input is-error"}
                type={this.props.inputType} id={this.props.inputId} placeholder={this.props.inputName} value={this.props.value} onChange={this.props.onChange}></input>
        )
        if(this.props.check){
            input = (
                <div className="input-group">
                    {input}
                    <button className="btn btn-primary input-group-btn" onClick={this.props.check.checkFunction}>Check</button>
                </div>
            )
        }

        return (
            <div className="form-group">
                <label className="form-label" htmlFor={this.props.inputId}>{this.props.inputName}</label>
                { input }
                { this.props.status.message!=='' && <p className="form-input-hint">{this.props.status.message}</p> }
            </div>
        )
    }

    static propTypes = {
        inputName: PropTypes.string.isRequired,
        inputId: PropTypes.string.isRequired,
        inputType: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        status: PropTypes.shape({
            value: PropTypes.number,
            message: PropTypes.string
        }).isRequired,
        check: PropTypes.shape({
            chechButton: PropTypes.bool,
            checkFunction: PropTypes.func
        })
    }
}

export default FormInput;