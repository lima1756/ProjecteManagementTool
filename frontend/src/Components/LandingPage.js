import React from 'react';
import PropTypes from 'prop-types';
import Login from './Login'
import SignUp from './SignUp'

class LandingPage extends React.Component {
    
    state = {
        renderLogin: false,
        renderSignUp: false
    };

    constructor(props){
        super(props);
        this.loginButton = this.loginButton.bind(this);
        this.signUpButton = this.signUpButton.bind(this);
        this.closeLoginButton = this.closeLoginButton.bind(this);
        this.closeSignUpButton = this.closeSignUpButton.bind(this);
    }

    loginButton(){
        this.setState({
            renderLogin: true
        });
    }

    closeLoginButton(){
        this.setState({
            renderLogin: false
        });
    }


    signUpButton(){
        this.setState({
            renderSignUp: true
        });
    }

    closeSignUpButton(){
        this.setState({
            renderSignUp: false
        });
    }

    render() {
        return (
        <div className='fullHeight'>
            <div className='bg'>
                <div className='centered-table'>
                    <div className='content-table'>
                        <h1 className="text-primary text-uppercase mainTitle">Project Management web App</h1>
                        <div className="btn-group">
                            <button className="btn btn btn-lg" id='EnterBtn' onClick={this.loginButton}>Login</button>
                            
                            <button className="btn btn-primary btn-lg" id='EnterBtn' onClick={this.signUpButton}>Sign Up</button>
                            
                        </div>
                            
                            
                        
                    </div>
                </div>
            </div>
            {
                this.state.renderLogin && <Login close={this.closeLoginButton}/>
            }
            {
                this.state.renderSignUp && <SignUp close={this.closeSignUpButton}/>
            }
        </div>
    );
    }
}
  

export default LandingPage;