import React from 'react';
import PropTypes from 'prop-types';

class SignUp extends React.Component {
    

    state = {
        checkUser: 0,
        checkEmail: 0,
        user:'',
        email:''
    };

    constructor(props){
        super(props);
        this.checkEmail = this.checkEmail.bind(this);
        this.checkUsername = this.checkUsername.bind(this)
    }

    signUpButton(){
        
    }

    checkUsername(){
        fetch('http://127.0.0.1:3000/api/users/userExists?user='+this.state.user, {
            method: 'GET',
            Accept: 'application/json'
        })
        .then(response => {
            if(response.status!=200)
                throw new Error("error");
            return response.json()
        })
        .then(json => {
            this.setState({
                checkUser: (json.exists?1:-1)
            }); 
        })
        .catch(err=> console.log(err))
    }

    checkEmail(){
        fetch('http://127.0.0.1:3000/api/users/emailExists?email='+this.state.email, {
            method: 'GET',
            Accept: 'application/json'
        })
        .then(response => {
            if(response.status!=200)
                throw new Error("error");
            return response.json()
        })
        .then(json => {
            this.setState({
                checkEmail: (json.exists?1:-1)
            }); 
        })
        .catch(err=> console.log(err))
    }

    render() {
        return (
        <div className="modal active" id="modal-id">
            <a href="#close" className="modal-overlay" aria-label="Close" onClick={this.props.close}></a>
            <div className="modal-container">
              <div className="modal-header">
                <a href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={this.props.close}></a>
                <div className="modal-title h5">SignUp</div>
              </div>
              <div className="modal-body">
                <div className="content">
                    <div className="form-group">
                        <label className="form-label" htmlFor="input-example-1">First Name</label>
                        <input className="form-input" type="text" id="input-example-1" placeholder="First Name"></input>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="input-example-1">Last Name</label>
                        <input className="form-input" type="text" id="input-example-1" placeholder="Last Name"></input>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="input-example-1">User</label>
                        <div className="input-group">
                            <input className={this.state.checkUser==0?"form-input":this.state.checkUser==1?"form-input is-error":"form-input is-success"}
                                 type="text" id="input-example-1" placeholder="User" value={this.state.user} onChange={(event)=>this.setState({user: event.target.value})}></input>
                            <button className="btn btn-primary input-group-btn" onClick={this.checkUsername}>Check</button>
                        </div>
                        { this.state.checkUser==1 && <p className="form-input-hint">This username is already taken.</p> }
                        { this.state.checkUser==-1 && <p className="form-input-hint">You can use this username.</p> }
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="input-example-1">email</label>
                        <div className="input-group">
                            <input className={this.state.checkEmail==0?"form-input":this.state.checkEmail==1?"form-input is-error":"form-input is-success"}
                                type="email" id="input-example-1" placeholder="email" value={this.state.email} onChange={(event)=>this.setState({email: event.target.value})}></input>
                            <button className="btn btn-primary input-group-btn" onClick={this.checkEmail}>Check</button>
                        </div>
                        { this.state.checkEmail==1 && <p className="form-input-hint">This email is already in use.</p>}
                        { this.state.checkEmail==-1 && <p className="form-input-hint">You can use this email.</p>}
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="input-example-1">Password</label>
                        <input className="form-input" type="password" id="input-example-1" placeholder="Password"></input>
                    </div>
                    <button className="btn btn-primary input-group-btn">Submit</button>
                  
                </div>
              </div>
              <div className="modal-footer">
                ...
              </div>
            </div>
          </div>
        );
    }

}
  

export default SignUp;