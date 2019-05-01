import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormInput from '../Forms/FormInput';

class ProjectOptionsModal extends Component {

    constructor(props){
        super(props);

        this.searchUsers = this.searchUsers.bind(this);
        this.addUser = this.addUser.bind(this);

        this.state = {
            userSearch: '',
            userStatus: 0,
            userStatusMessage: '',
            projectUsers: [],
            searchedUsers: [],
            addUsers: true,
            selectedUser: []
        }
    }

    searchUsers(event){
        const searchTerm = event.target.value;
        this.setState({
            userSearch: searchTerm,
            searchedUsers:[]
        })
        if(searchTerm==='')
            return;
        fetch('http://127.0.0.1:3000/api/users/searchUser?user='+searchTerm, {
            method: 'get',
            Accept: 'application/json',
            headers: {
                "token": localStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.status==200){
                return response.json();
            }
            else{
                console.log("not 200")
            }
        })
        .then(json=>{
            if(json.size===0){
                this.setState({searchedUsers:json.rows})
            }
            else{
                this.setState({searchedUsers:json.rows})
            }
        })
        .catch(err=>{
            console.log(err);
        })
        
    }

    addUser(){
        if(this.state.selectedUser.length===0 || this.state.selectedUser.length>1)
        {
            alert("Select one user")
            return;
        }
        console.log(this.state.selectedUser[0]);
        fetch('http://127.0.0.1:3000/api/projects/addColaborator', {
            method: 'post',
            Accept: 'application/json',
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem('token')
            },
            body: JSON.stringify({
                projectId: this.props.projectId,
                memberId: parseInt(this.state.selectedUser[0]),
                permissions: [0,1,1,1,1,1,1,1,1,1,1,1]
            })
        })
        .then(response=>{
            if(response.status==200){
                return response.json();
            }
            else{
                console.log("not 200")
            }
        })
        .then(json=>{
            if(!json.success){
                console.log("error")
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }


    render() {
        return (
            <div className="modal active modal-lg" id="modal-id">
                <a href="#close" className="modal-overlay" aria-label="Close" onClick={this.props.close}></a>
                <div className="modal-container">
                    <div className="modal-header">
                        <a href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={this.props.close}></a>
                        <div className="modal-title h5">Options</div>
                    </div>
                    <div className="modal-body">
                        <div className="content">
                            { this.state.addUsers && 
                                <div>
                                    <i className="icon icon-back text-primary" onClick={()=>this.setState({addUsers:false})}></i>
                                    <FormInput inputName="Search an user" inputId="userSearch" inputType="text" 
                                    value={this.state.userSearch} onChange={this.searchUsers}
                                    status={{
                                        value: this.state.userStatus,
                                        message: this.state.userStatusMessage
                                    }} />
                                    <label className="form-label" htmlFor="select">Select an user</label>
                                    <select className="form-select" id="select" multiple value={this.state.selectedUser} onChange={event=>this.setState({selectedUser:event.target.value})}>
                                        {this.state.searchedUsers.map(user=>{
                                            return <option key={user.ID} value={user.ID}>{user.USERNAME}  -  {user.EMAIL}</option>   
                                        })}
                                    </select>
                                    <button className="btn btn-primary input-group-btn" onClick={this.addUser}>Add User to Project</button>
                                </div>
                            }
                            { !this.state.addUsers && 
                                <div>

                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ProjectOptionsModal.propTypes = {
    projectId: PropTypes.number.isRequired,
    close: PropTypes.func.isRequired,
};

export default ProjectOptionsModal;