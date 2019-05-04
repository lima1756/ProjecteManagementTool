import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChipTag from './ChipTag'
import TaskInfoModal from './Modal/TaskInfoModal';

class TaskTile extends Component {

    constructor(props){
        super(props);
        this.state = {
            tags:[],
            infoModal: false
        }

        this.openInfoModal = this.openInfoModal.bind(this);
        this.closeInfoModal = this.closeInfoModal.bind(this);
        this.updateTags = this.updateTags.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);

        this.updateTags();
    }

    updateTags(){
        fetch('http://127.0.0.1:3000/api/projects/milestones/tasks/getTags?projectId='+this.props.projectId+'&taskId='+this.props.task['ID'], {
            method: 'get',
            Accept: 'application/json',
            headers: {
                "token": localStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.status===200)
                return response.json();
            else if (response.status == 403){
                alert("You're not allowed to do this")
                throw new Error('403')
            }
        })
        .then(json=>{
            console.log(json);
            this.setState({
                tags:json.rows.map(row=>{ return {value: row.TAG_ID, label: row.TAG_NAME, color: row.COLOR } })
            })
        })
    }

    handleTagChange(selectedTags){
        for(let i = 0; i< selectedTags.length; i++){
            const id = this.state.tags.findIndex(tag=>selectedTags[i].value===tag.value);
            if(id===-1){
                fetch('http://127.0.0.1:3000/api/projects/milestones/tasks/addTag', {
                    method: 'put',
                    Accept: 'application/json',
                    headers: {
                        "Content-Type": "application/json",
                        "token": localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        projectId: this.props.projectId,
                        taskId: this.props.task.ID,
                        tagId: selectedTags[i].value
                    })
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
                        new Error("couldn't upload the tag")
                    }
                })
                .then(json=>{
                    if(json.success){
                        this.setState({
                            tags:selectedTags
                        })
                    }
                    else{
                        console.log("no tags")
                    }
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }

        for(let i = 0; i< this.state.tags.length; i++){
            const id = selectedTags.findIndex(tag=>this.state.tags[i].value===tag.value);
            if(id===-1){
                fetch('http://127.0.0.1:3000/api/projects/milestones/tasks/removeTag', {
                    method: 'delete',
                    Accept: 'application/json',
                    headers: {
                        "Content-Type": "application/json",
                        "token": localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        projectId: this.props.projectId,
                        taskId: this.props.task.ID,
                        tagId: this.state.tags[i].value
                    })
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
                        new Error("couldn't upload the tag")
                    }
                })
                .then(json=>{
                    if(json.success){
                        this.setState({
                            tags:selectedTags
                        })
                    }
                    else{
                        console.log("no tags")
                    }
                })
                .catch(err=>{
                    console.log(err);
                })
            }
        }
        
        this.updateTags();

    }


    openInfoModal(){

        if(!this.state.infoModal)
        {
            this.setState({
                infoModal:true
            })
        }
    }

    closeInfoModal(){
        this.setState({
            infoModal:false
        })
    }


    render() {
        const task = this.props.task;
        const date = new Date(task['DEADLINE']);
        const dateString = date.toLocaleDateString()
        return (
            <div className="tile tile-centered task-tile" key={task['ID']} onClick={this.openInfoModal} >
                <div className="tile-content">
                    <div className="tile-title c-hand">{task['TASK_NAME']}</div>
                    <small className="tile-subtitle text-gray">Deadline: {dateString}</small>
                    <div className="tile-action">
                        {this.state.tags.map((tag, id)=>{
                            return (<ChipTag key={id} value={tag['label']} color={tag['color']}/>)
                        })}
                    </div>
                </div>
                <div className="tile-action">
                    <button className="btn btn-link">
                    <i className="icon icon-more-vert"></i>
                    </button>
                </div>
                { this.state.infoModal && <TaskInfoModal tags={this.state.tags} handleTagChange={this.handleTagChange} updateTags={this.updateTags} close={this.closeInfoModal} allTags={this.props.allTags} task={this.props.task} projectId={this.props.projectId}/>}
            </div>
        );
    }
}

TaskTile.propTypes = {
    task: PropTypes.object.isRequired,
    projectId: PropTypes.number.isRequired,
    allTags: PropTypes.array.isRequired
};

export default TaskTile;