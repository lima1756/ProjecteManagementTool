import React, { Component } from 'react';
import PropTypes from 'prop-types';
import  MilestoneBody from './MilestoneBody'
import TaskTile from './TaskTile';
import NewTaskModal from './Modal/NewTaskModal';


class TasksList extends Component {


    constructor(props){
        super(props);
        this.loadTasks = this.loadTasks.bind(this);
        this.state = {
            status: MilestoneBody.STATE_EMPTY,
            modal: false
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
            else if (response.status == 403){
                alert("You're not allowed to do this")
                throw new Error('403')
            }
            else{
                this.setState({
                    status:MilestoneBody.STATE_ERROR
                })
                console.log("not 200")
            }
        })
        .then(json=>{
            if(json.size===0){
                this.setState({
                    status:MilestoneBody.STATE_EMPTY,
                    tasks: json.rows
                })
            }
            else{
                this.setState({
                    status:MilestoneBody.STATE_LOADED,
                    tasks: json.rows
                })
            }
        })
        .catch(err=>{
            this.setState({
                status:MilestoneBody.STATE_ERROR
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
                                <button className="btn btn-primary" onClick={()=>{this.setState({modal:true})}}>New task</button>
                                
                            </div>              
                            {this.state.modal && <NewTaskModal close={()=>{this.setState({modal:false})}} reload={this.loadTasks} projectId={this.props.projectId} milestoneId={this.props.milestoneId}/>}
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
                    <div>
                        {
                            this.state.tasks.map(task=>{
                                return (
                                    <TaskTile key={task['ID']} task={task} projectId={this.props.projectId} allTags={this.props.allTags}/>
                                )
                            })
                        }
                        <div className='text-center task-tile'>
                            <button className="btn btn-primary" onClick={()=>{this.setState({modal:true})}}>New task</button>
                        </div>
                        
                        {this.state.modal && <NewTaskModal close={()=>{this.setState({modal:false})}} reload={this.loadTasks} projectId={this.props.projectId} milestoneId={this.props.milestoneId}/>}
                    </div>
                    
                );
        }
    }
}

TasksList.propTypes = {
    milestoneId: PropTypes.number.isRequired,
    projectId: PropTypes.number.isRequired,
    allTags: PropTypes.array.isRequired
};

export default TasksList;