import React from 'react';
import FormInput from '../Forms/FormInput';
import PropTypes from 'prop-types';
import {Redirect} from 'react-router-dom';

class Login extends React.Component {
    

    state = {
      user:'',
      password:'',
      toast: false,
      toastMessage: '',
      logInMessage: '',
      loggedIn: false
    }

    constructor(props){
        super(props);
        this.submit = this.submit.bind(this);
    }

    submit(){
        fetch('http://127.0.0.1:3000/api/users/login', {
          method: 'post',
          Accept: 'application/json',
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              user: this.state.user,
              password: this.state.password
          })
      })
        .then(response=>{
          if(response.status==500)
            throw new Error('500')
          else if(response.status==400)
            throw new Error('400')
          return response.json()
        })
        .then(json=>{
          if(json.success){
            localStorage.setItem('token', json.token);
            this.setState({
              loggedIn: true
            })
          }
          else{
            throw new Error('error')
          }
        })
        .catch(e=>{
          if(e.message==='500')
            this.setState({logInMessage:"There was an unexpected problem, please try again in a moment"})
          else if(e.message==='400')
            this.setState({logInMessage:"Please check your username/email and password"})
          this.setState({toast:true});
        })
    }

    render() {
        if(this.state.loggedIn){
          return <Redirect to="/dashboard" />
        }
        return (
        <div className="modal active" id="modal-id">
            <a href="#close" className="modal-overlay" aria-label="Close" onClick={this.props.close}></a>
            <div className="modal-container">
              <div className="modal-header">
                <a href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={this.props.close}></a>
                <div className="modal-title h5">LogIn</div>
              </div>
              <div className="modal-body">
                {
                    this.state.toast && 
                    <div className={"toast toast-error"} >
                        <button className="btn btn-clear float-right" onClick={()=>{this.setState({toast:false})}}></button>
                        {this.state.logInMessage}
                    </div>
                }
                <div className="content">
                  <FormInput inputName='User or Email' inputId='userInput' inputType='text' 
                    status={{
                        value: 0,
                        message: ''
                    }}
                    value={this.state.user} onChange={(event)=>this.setState({user: event.target.value})}/>
                  <FormInput inputName='Password' inputId='passwordInput' inputType='password' 
                    status={{
                        value: 0,
                        message: ''
                    }}
                    value={this.state.password} onChange={(event)=>this.setState({password: event.target.value})}/>
                  <button className="btn btn-primary input-group-btn" onClick={this.submit}>Submit</button>
                </div>
              </div>
            </div>
          </div>
        );
    }

    static propTypes={
      close: PropTypes.func.isRequired
    }
}
  

export default Login;