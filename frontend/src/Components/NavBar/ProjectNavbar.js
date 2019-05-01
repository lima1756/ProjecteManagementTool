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
                <Button to='lists' text='Lists' position={Navbar.POSITION_LEFT} className='btn btn-link'/>
                <Button text='Tags' position={Navbar.POSITION_LEFT} className='btn btn-link' onClick={this.props.tagsAction}/>
                <Button to='.' text={this.props.name} position={Navbar.POSITION_CENTER} className='navbar-brand text-bold mr-2'/>
                <Button text='Project Option' position={Navbar.POSITION_RIGHT} className='btn btn-link' onClick={this.props.optionsAction}/>
                <Button to='/logout' text='LogOut' position={Navbar.POSITION_RIGHT} className='btn btn-link'/>
            </Navbar>
        )
    }

    static propTypes = {
        name: PropTypes.string.isRequired,
        tagsAction: PropTypes.func.isRequired,
        optionsAction: PropTypes.func.isRequired,
    }

    
}

export default ProjectNavbar;