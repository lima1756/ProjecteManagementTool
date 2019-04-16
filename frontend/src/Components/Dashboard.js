import React from 'react';
import PropTypes from 'prop-types';
import ProjectsPanel from './ProjectsPanel';

class Dashboard extends React.Component {
    
    render(){
        return (
            <div className='container grid-xl'>
                <div className='columns'>
                    <ProjectsPanel />
                </div>
            </div>
        )
    }
}

export default Dashboard;