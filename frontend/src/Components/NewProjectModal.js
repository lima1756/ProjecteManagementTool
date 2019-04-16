import React from 'react';
import PropTypes from 'prop-types';
import FormInput from './FormInput'

class NewProjectModal extends React.Component {

    state = {
        toast: false,
        toastMessage: '',
        name: ''
    }
    constructor(props) {
        super(props)
        this.submit = this.submit.bind(this);
    }

    submit() {
        const self = this;
        fetch('http://127.0.0.1:3000/api/projects/create', {
            method: 'post',
            Accept: 'application/json',
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem('token')
            },
            body: JSON.stringify({
                name: this.state.name
            })
        })
        .then(response => {
            if (response.status == 500)
                throw new Error('500')
            else if (response.status == 400)
                throw new Error('400')
            return response.json()
        })
        .then(json => {
            if (json.success) {
                self.props.close();
            }
            else {
                throw new Error('error')
            }
        })
        .catch(e => {
            if (e.message === '500')
                this.setState({ toastMessage: "There was an unexpected problem, please try again in a moment" })
            else if (e.message === '400')
                this.setState({ toastMessage: "Please check your username/email and password" })
            this.setState({ toast: true });
        })
        
    }

    render() {
        return (
            <div className="modal active" id="modal-id">
                <a href="#close" className="modal-overlay" aria-label="Close" onClick={this.props.close}></a>
                <div className="modal-container">
                    <div className="modal-header">
                        <a href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={this.props.close}></a>
                        <div className="modal-title h5">New Project</div>
                    </div>
                    <div className="modal-body">
                        {
                            this.state.toast &&
                            <div className={"toast toast-error"} >
                                <button className="btn btn-clear float-right" onClick={() => { this.setState({ toast: false }) }}></button>
                                {this.state.toastMessage}
                            </div>
                        }
                        <div className="content">
                            <FormInput inputName='Project Name' inputId='projectName' inputType='text'
                                value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })} />
                            <button className="btn btn-primary input-group-btn" onClick={this.submit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    static propTypes = {
        close: PropTypes.func.isRequired
    }

}

export default NewProjectModal;