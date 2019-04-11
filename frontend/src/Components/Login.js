import React from 'react';
import PropTypes from 'prop-types';

class Login extends React.Component {
    
    constructor(props){
        super(props);
        this.loginButton = this.loginButton.bind(this);
    }

    loginButton(){
        
    }

    render() {
        return (
        <div className="modal active" id="modal-id">
            <a href="#close" className="modal-overlay" aria-label="Close" onClick={this.props.close}></a>
            <div className="modal-container">
              <div className="modal-header">
                <a href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={this.props.close}></a>
                <div className="modal-title h5">LogIn</div>
              </div>
              <div className="modal-body">
                <div className="content">
                  holi
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
  

export default Login;