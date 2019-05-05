import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormTextArea from "../Forms/FormTextArea";
import FormInput from "../Forms/FormInput";

class NewTaskModal extends Component {
    state = {
        toast: false,
        toastMessage: '',
        taskName: '',
        taskDescription: '',
        deadline: ''
    }

    constructor(props){
        super(props);
        this.modal = React.createRef();
        this.submit = this.submit.bind(this);
    }

    submit() {
        fetch('http://127.0.0.1:3000/api/projects/milestones/tasks/create', {
            method: 'post',
            Accept: 'application/json',
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem('token')
            },
            body: JSON.stringify({
                projectId: this.props.projectId,
                milestoneId: this.props.milestoneId,
                taskName: this.state.taskName,
                taskDescription: this.state.taskDescription,
                deadline: this.state.deadline
            })
        })
        .then(response => {
            if (response.status == 500)
                throw new Error('500')
            else if (response.status == 400)
                throw new Error('400')
            if (response.status == 403){
                alert("You're not allowed to do this")
                throw new Error('403')
            }
            return response.json()
        })
        .then(json => {
            if (json.success) {
                this.props.reload();
                this.props.close();
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
            this.modal.current.scrollTop=0;
        })
        
    }

    render() {
        return (
            <div className="modal active" id="modal-id">
                <a href="#close" className="modal-overlay" aria-label="Close" onClick={this.props.close}></a>
                <div className="modal-container">
                    <div className="modal-header">
                        <a href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={this.props.close}></a>
                        <div className="modal-title h5">New Task</div>
                    </div>
                    <div className="modal-body" ref={this.modal}>
                        {
                            this.state.toast &&
                            <div className={"toast toast-error"} id='toast'>
                                <button className="btn btn-clear float-right" onClick={() => { this.setState({ toast: false }) }}></button>
                                {this.state.toastMessage}
                            </div>
                        }
                        <div className="content">
                            <FormInput inputName='Task Name' inputId='taskName' inputType='text'
                                value={this.state.taskName} onChange={(event) => this.setState({ taskName: event.target.value })} />
                            <FormTextArea inputName='Description' inputId='taskDescription' value={this.state.taskDescription}
                                onChange={(event) => this.setState({ taskDescription: event.target.value })}/>
                            <FormInput inputName='Deadline' inputId='milestoneDeadline' inputType='date'
                                value={this.state.deadline} onChange={(event) => this.setState({ deadline: event.target.value })} />
                            <button className="btn btn-primary input-group-btn" onClick={this.submit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    static propTypes = {
        close: PropTypes.func.isRequired,
        projectId: PropTypes.number.isRequired,
        milestoneId: PropTypes.number.isRequired,
        reload: PropTypes.func
        
    }
}

export default NewTaskModal;