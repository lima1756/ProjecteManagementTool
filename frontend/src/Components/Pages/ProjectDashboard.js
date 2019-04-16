import React from 'react';
import PropTypes from 'prop-types';
import ProjectNavbar from '../NavBar/ProjectNavbar';
import ProjectsPanel from '../general/ProjectsPanel';
import NotFoundPage from './NotFoundPage';

class ProjectDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            projectId: this.props.match.params.id,
            error: false
        }
        fetch('http://127.0.0.1:3000/api/projects?projectId='+this.state.projectId, {
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
                
            }
        })
        .then(json=>{
            if(json.size===0){
                this.setState({
                    error:true
                })
            }
            else{
                this.setState({
                    loading:false,
                    projectName: json.rows[0]["PROJECT_NAME"]
                })
            }
        })
        .catch(err=>{
            console.log(err);
        })
    }

    render() {
        if(this.state.error){
            return( <NotFoundPage/> )
        }
        if (this.state.loading) {
            return (
                <div className='container grid-xl'>
                    <div className='columns'>
                        <div className='column col-12'>
                            <div className="empty">
                                <div className="loading loading-lg"></div>
                            </div>
                        </div>
                    </div>

                </div>

            )
        }
        else {
            return (
                <div className='container grid-xl'>
                    <ProjectNavbar name={this.state.projectName} />
                </div>

            )
        }
    }
}

export default ProjectDashboard;