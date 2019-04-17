import React from 'react';
import PropTypes from 'prop-types';
import ProjectNavbar from '../NavBar/ProjectNavbar';
import ProjectsPanel from '../general/ProjectsPanel';
import NotFoundPage from './NotFoundPage';
import MilestonesPanel from '../general/MilestonesPanel';
import MilestoneBody from '../general/MilestoneBody';

class ProjectDashboard extends React.Component {

    constructor(props) {
        super(props);

        this.loadMilestone = this.loadMilestone.bind(this);
        this.loadBody = this.loadBody.bind(this);

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
                console.log("not 200")
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

    state = {
        loading: true,
        projectId: this.props.match.params.id,
        error: false,
        milestoneStatus: MilestoneBody.STATE_EMPTY,
        selectedMilestone: null,
        taskStatus: MilestoneBody.STATE_EMPTY,
        tasks: [],
    }

    loadMilestone(milestoneId){
        this.setState({
            milestoneStatus:MilestoneBody.STATE_LOADING,
            tasksStatus:MilestoneBody.STATE_LOADING
        });
        fetch('http://127.0.0.1:3000/api/projects/milestones?projectId='+this.state.projectId+'&milestoneId='+milestoneId, {
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
                this.setState({
                    milestoneStatus:MilestoneBody.STATE_ERROR
                })
                console.log("not 200")
            }
        })
        .then(json=>{
            if(json.size===0){
                this.setState({
                    milestoneStatus:MilestoneBody.STATE_ERROR
                })
            }
            else{
                this.setState({
                    milestoneStatus:MilestoneBody.STATE_LOADED,
                    selectedMilestone: json.rows[0]
                })
            }
        })
        .catch(err=>{
            this.setState({
                milestoneStatus:MilestoneBody.STATE_ERROR
            })
            console.log(err);
        })
    }

    loadBody(milestoneId){
        return ()=>{
            this.loadMilestone(milestoneId);
        }
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
                    <div className='columns'>
                        <MilestonesPanel projectId={this.state.projectId} loadInfo={this.loadBody}/>
                        <MilestoneBody state={this.state.milestoneStatus} projectId={parseInt(this.state.projectId)} milestone={this.state.selectedMilestone} tasks={this.state.tasks} tasksStatus={this.state.taskStatus}/>    
                    </div>
                </div>

            )
        }
    }
}

export default ProjectDashboard;