import React, { Component } from 'react';
import PropTypes from 'prop-types';
import  MilestoneBody from './MilestoneBody'
import TaskTile from './TaskTile';


class TasksList extends Component {


    constructor(props){
        super(props);
        this.loadTasks = this.loadTasks.bind(this);
        this.state = {
            status: MilestoneBody.STATE_EMPTY
        }   
        this.loadTasks();
        this._isMounted = true;
    }
       
    loadTasks(){
        if(this._isMounted){
            this.setState({
                status:MilestoneBody.STATE_LOADING
            })
        }
        fetch('http://127.0.0.1:3000/api/projects/milestones/tasks/milestoneTasks?projectId='+this.props.projectId+'&milestoneId='+this.props.milestoneId, {
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
                    taskStatus:MilestoneBody.STATE_ERROR
                })
                console.log("not 200")
            }
        })
        .then(json=>{
            if(json.size===0){
                this.setState({
                    taskStatus:MilestoneBody.STATE_EMPTY,
                    tasks: json.rows
                })
            }
            else{
                this.setState({
                    taskStatus:MilestoneBody.STATE_LOADED,
                    tasks: json.rows
                })
            }
        })
        .catch(err=>{
            this.setState({
                taskStatus:MilestoneBody.STATE_ERROR
            })
            console.log(err);
        })
    }


    render() {
        switch(this.state.status){
            case MilestoneBody.STATE_ERROR:
                break;
            case MilestoneBody.STATE_EMPTY:
                return (
                        <div className="empty">
                            <div className="empty-icon">
                                <i className="icon icon-bookmark"></i>
                            </div>
                            <p className="empty-title h5">There is no task for current milestone</p>
                            <p className="empty-subtitle">You can create a new one!</p>      
                            <div className="empty-action">
                                <button className="btn btn-primary" onClick={()=>{/* TODO: create new Task modal */}}>New task</button>
                            </div>              
                        </div>
                )
            case MilestoneBody.STATE_LOADING:
                return (
                        <div className='card'>
                            <div className='card-body'>
                                <div className="loading loading-lg"></div>
                            </div>
                        </div>
                )
            case MilestoneBody.STATE_LOADED:
                return (
                    this.state.tasks.map(task=>{
                        return (
                            <TaskTile task={task} projectId={this.props.projectId}/>
                        )
                    }) 
                );
        }
    }
}

TasksList.propTypes = {
    milestoneId: PropTypes.number.isRequired,
    projectId: PropTypes.number.isRequired
};

export default TasksList;