import React from 'react';
import FormInput from './FormInput';
import PropTypes from 'prop-types';

class SignUp extends React.Component {
    

    state = {
        checkUser: 0,
        checkEmail: 0,
        checkFirstName: 0,
        checkLastName: 0,
        checkPassword: 0,
        fName: '',
        lName: '',
        user: '',
        email: '',
        password: '',
        fNameMessage: 'The first name must be at least 1 character long',
        lNameMessage: 'The last name must be at least 1 character long',
        userMessage: 'The username must be at least 1 character long',
        emailMessage: 'The email must be an email',
        passwordMessage: 'The password must be at least 5 characters long',
        toast: false,
        signUpMessage: '',
        signUpStatus:0,

    };

    constructor(props){
        super(props);
        this.checkEmail = this.checkEmail.bind(this);
        this.checkUsername = this.checkUsername.bind(this)
        this.submit = this.submit.bind(this)
    }

    checkUsername(){
        fetch('http://127.0.0.1:3000/api/users/userExists?user='+this.state.user, {
            method: 'GET',
            Accept: 'application/json'
        })
        .then(response => {
            if(response.status!==200)
                throw new Error("error");
            return response.json()
        })
        .then(json => {
            if(json.exists){
                this.setState({
                    checkUser: -1,
                    userMessage: 'This username is already in use, please try with another'
                }); 
            }
            else{
                this.setState({
                    checkUser: 1,
                    userMessage: 'You can use this username!'
                }); 
            }
            
        })
        .catch(err=> console.log(err))
        
    }

    checkEmail(){
        fetch('http://127.0.0.1:3000/api/users/emailExists?email='+this.state.email, {
            method: 'GET',
            Accept: 'application/json'
        })
        .then(response => {
            if(response.status!==200)
                throw new Error("error");
            return response.json()
        })
        .then(json => {
            if(json.exists){
                this.setState({
                    checkEmail: -1,
                    emailMessage: 'This email is already in use, please try with another'
                }); 
            }
            else{
                this.setState({
                    checkEmail: 1,
                    emailMessage: 'You can use this email!'
                }); 
            }
        })
        .catch(err=> console.log(err))
    }

    async submit(){
        let error = false;
        const emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g;
        if(this.state.fName.length==0){
            error = true;
            this.setState({
                checkFirstName:-1
            })
        }
        else{
            this.setState({
                checkFirstName:1
            })
        }

        if(this.state.lName.length==0){
            error = true;
            this.setState({
                checkLastName:-1
            })
        }
        else{
            this.setState({
                checkLastName:1
            })
        }

        if(this.state.user.length==0){
            error = true;
            this.setState({
                checkUser:-1
            })
        }
        else{
            this.checkUsername()
        }

        if(!emailRegex.test(this.state.email)){
            error = true;
            this.setState({
                checkEmail:-1
            })
        }
        else{
            this.checkEmail()
        }

        if(this.state.password.length<5){
            error = true;
            this.setState({
                checkPassword:-1
            })
        }
        else{
            this.setState({
                checkPassword:1
            })
        }
        if(error){
            this.setState({
                signUpMessage: 'Please check the fields below',
                signUpStatus:-1
            })
            return;
        }
        
        fetch('http://127.0.0.1:3000/api/users/signup', {
            method: 'post',
            Accept: 'application/json',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: this.state.user,
                password: this.state.password,
                email: this.state.email,
                fName: this.state.fName,
                lName: this.state.lName
            })
        })
        .then(response=>{
            if(response.status===200){
                return response.json();
            }
            else if(response.status===500){
                this.setState({
                    signUpMessage: 'There was a problem, please try again later',
                    signUpStatus:-1
                })
            }
            else if(response.status == 400){
                this.setState({
                    signUpMessage: 'Please check your information',
                    signUpStatus:-1
                })
            }
        })
        .then(json=>{
            if(json.success){
                this.setState({
                    signUpMessage: 'Succesfull sign-up, you can now login',
                    signUpStatus:1
                })

            }else{
                this.setState({
                    signUpMessage: 'There was a problem, please try again later',
                    signUpStatus:-1
                })
            }
        })
        .catch(e=>{
            this.setState({
                signUpMessage: 'There was a problem, please try again later',
                signUpStatus:-1
            })
        })
        .finally(()=>{
            this.setState({
                toast: true
            })
        })
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
                {
                    this.state.toast && 
                    <div className={"toast " + (this.state.signUpStatus===0?"toast-primary":(this.state.signUpStatus===1?"toast-success":"toast-error"))} >
                        <button className="btn btn-clear float-right" onClick={()=>{this.setState({toast:false})}}></button>
                        {this.state.signUpMessage}
                    </div>
                }
                
                <div className="content">
                    <FormInput inputName='First Name' inputId='firstNameInput' inputType='text' 
                        status={{
                            value: this.state.checkFirstName,
                            message: this.state.fNameMessage
                        }}
                        value={this.state.fName} onChange={(event)=>this.setState({fName: event.target.value})}/>
                    <FormInput inputName='Last Name' inputId='lastNameInput' inputType='text' 
                        value={this.state.lName} 
                        status={{
                            value: this.state.checkLastName,
                            message: this.state.lNameMessage
                        }}
                        onChange={(event)=>this.setState({lName: event.target.value})}/>
                    <FormInput inputName='User' inputId='userInput' inputType='text'
                        value={this.state.user}
                        status={{
                            value: this.state.checkUser,
                            message: this.state.userMessage
                        }}
                        check={{
                            checkButton: true,
                            checkFunction: this.checkUsername
                        }} 
                        onChange={(event)=>this.setState({user: event.target.value})}/>
                    <FormInput inputName='Email' inputId='emailInput' inputType='email' value={this.state.email} 
                        status={{
                            value: this.state.checkEmail,
                            message: this.state.emailMessage
                        }}
                        check={{
                            checkButton: true,
                            checkFunction: this.checkEmail
                        }} 
                        onChange={(event)=>this.setState({email: event.target.value})}/>
                    <FormInput inputName='Password' inputId='passwordInput' inputType='password' 
                        status={{
                            value: this.state.checkPassword,
                            message: this.state.passwordMessage
                        }}
                        value={this.state.password} 
                        onChange={(event)=>this.setState({password: event.target.value})}/>
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
  

export default SignUp;