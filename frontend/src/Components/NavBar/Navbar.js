import React from 'react';
import PropTypes from 'prop-types';

class Navbar extends React.Component{

    static get POSITION_LEFT(){ return 1; }
    static get POSITION_CENTER(){ return 2; }
    static get POSITION_RIGHT(){ return 3; }

    constructor(props){
        super(props);
    }

    render(){

        return(
            <header className="navbar">
                <section className="navbar-section">
                    {
                        this.props.children.map((child)=>{
                            if(child.props.position === Navbar.POSITION_LEFT){
                                return child;
                            }
                        })
                    }
                </section>
                <section className="navbar-center">
                    {
                        this.props.children.map((child)=>{
                            if(child.props.position === Navbar.POSITION_CENTER){
                                return child;
                            }
                        })
                    }
                </section>
                <section className="navbar-section">
                    {
                        this.props.children.map((child)=>{
                            if(child.props.position === Navbar.POSITION_RIGHT){
                                return child;
                            }
                        })
                    }
                </section>
            </header>
        )
    }

}

export default Navbar;