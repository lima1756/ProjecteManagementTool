import React from 'react';
import Navbar from './Navbar';
import Button from './Button';
import PropTypes from 'prop-types';

class ProjectNavbar extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <Navbar>
                <Button to='milestones' text='Milestones' position={Navbar.POSITION_LEFT} className='btn btn-link'/>
                <Button to='lists' text='Lists' position={Navbar.POSITION_LEFT} className='btn btn-link'/>
                <Button to='tags' text='Tags' position={Navbar.POSITION_LEFT} className='btn btn-link'/>
                <Button to='.' text={this.props.name} position={Navbar.POSITION_CENTER} className='navbar-brand text-bold mr-2'/>
                <Button to='options' text='Project Option' position={Navbar.POSITION_RIGHT} className='btn btn-link'/>
                <Button to='/logout' text='LogOut' position={Navbar.POSITION_RIGHT} className='btn btn-link'/>
            </Navbar>
        )
    }

    static propTypes = {
        name: PropTypes.string.isRequired
    }

    
}

export default ProjectNavbar;