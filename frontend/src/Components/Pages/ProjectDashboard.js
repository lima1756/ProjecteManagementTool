import React from 'react';
import PropTypes from 'prop-types';
import ProjectNavbar from '../NavBar/ProjectNavbar';
import ProjectsPanel from '../general/ProjectsPanel';
import NotFoundPage from './NotFoundPage';
import MilestonesPanel from '../general/MilestonesPanel';
import MilestoneBody from '../general/MilestoneBody';
import TagsModal from '../general/Modal/TagsModal';
import ProjectOptionsModal from '../general/Modal/ProjectOptionsModal';

class ProjectDashboard extends React.Component {

    constructor(props) {
        super(props);
        this._rendered = false;

        this.loadMilestone = this.loadMilestone.bind(this);
        this.loadBody = this.loadBody.bind(this);
        this.obtainTags = this.obtainTags.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.state.tags=[];
        this.state.selectedTags = [];

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
        
        this.obtainTags();
        this._rendered = true;
    }

    obtainTags(successCallback, errorCallback, finallyCallback) {
        fetch('http://127.0.0.1:3000/api/projects/tags?projectId='+this.state.projectId, {
            method: 'get',
            Accept: 'application/json',
            headers: {
                "token": localStorage.getItem('token')
            }
        })
        .then(response => {
            if (response.status === 200)
                return response.json()
            else
                throw new Error(response.status);
        })
        .then(json => {
            if (json) {
                if(successCallback)
                    successCallback(json);
                if(this._rendered){
                    this.setState({
                        tags:json.rows.map(row=>{ return {value: row.ID, label: row.TAG_NAME, color: row.COLOR } })
                    })
                }
                else{
                    this.state.tags=json.rows;
                }
                
            }
            else {
                throw new Error('error')
            }
        })
        .catch(e => {
            if(errorCallback)
                errorCallback(e);
        })
        .finally(()=>{
            if(finallyCallback)
                finallyCallback();
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
        tagsModal: false,
        optionsModal: false
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

        fetch('http://127.0.0.1:3000/api/projects/milestones/getTags?projectId='+this.state.projectId+'&milestoneId='+milestoneId, {
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
                new Error("couldn't get the tags")
            }
        })
        .then(json=>{
            if(json.rows){
                this.setState({
                    selectedTags:json.rows.map(row=>{ return {value: row.ID, label: row.TAG_NAME, color: row.COLOR } })
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

    loadBody(milestoneId){
        return ()=>{
            this.loadMilestone(milestoneId);
        }
    }

    handleTagChange(selectedTags){
        for(let i = 0; i< selectedTags.length; i++){
            const id = this.state.selectedTags.findIndex(tag=>selectedTags[i].value===tag.value);
            if(id===-1){
                fetch('http://127.0.0.1:3000/api/projects/milestones/addTag', {
                    method: 'put',
                    Accept: 'application/json',
                    headers: {
                        "Content-Type": "application/json",
                        "token": localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        projectId: this.state.projectId,
                        milestoneId: this.state.selectedMilestone.ID,
                        tagId: selectedTags[i].value
                    })
                })
                .then(response=>{
                    if(response.status==200){
                        return response.json();
                    }
                    else{
                        new Error("couldn't upload the tag")
                    }
                })
                .then(json=>{
                    if(json.success){
                        this.setState({
                            selectedTags:selectedTags
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

        for(let i = 0; i< this.state.selectedTags.length; i++){
            const id = selectedTags.findIndex(tag=>this.state.selectedTags[i].value===tag.value);
            if(id===-1){
                fetch('http://127.0.0.1:3000/api/projects/milestones/removeTag', {
                    method: 'delete',
                    Accept: 'application/json',
                    headers: {
                        "Content-Type": "application/json",
                        "token": localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        projectId: this.state.projectId,
                        milestoneId: this.state.selectedMilestone.ID,
                        tagId: this.state.selectedTags[i].value
                    })
                })
                .then(response=>{
                    if(response.status==200){
                        return response.json();
                    }
                    else{
                        new Error("couldn't upload the tag")
                    }
                })
                .then(json=>{
                    if(json.success){
                        this.setState({
                            selectedTags:selectedTags
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
                    <ProjectNavbar name={this.state.projectName} tagsAction={()=>{this.setState({tagsModal:true})}} optionsAction={()=>{this.setState({optionsModal:true})}}/>
                    <div className='columns'>
                        <MilestonesPanel tags={this.state.tags} projectId={this.state.projectId} loadInfo={this.loadBody} tags={this.state.tags}/>
                        <MilestoneBody handleTagChange={this.handleTagChange} allTags={this.state.tags} selectedTags={this.state.selectedTags} state={this.state.milestoneStatus} projectId={parseInt(this.state.projectId)} milestone={this.state.selectedMilestone} tasks={this.state.tasks} tasksStatus={this.state.taskStatus}/>    
                    </div>
                    {this.state.optionsModal && <ProjectOptionsModal close={()=>{this.setState({optionsModal:false})}} projectId={parseInt(this.state.projectId)}/>}
                    {this.state.tagsModal && <TagsModal obtainTags={this.obtainTags} projectId={parseInt(this.state.projectId)} close={()=>{this.setState({tagsModal:false})}}/>}
                </div>

            )
        }
    }
}

export default ProjectDashboard;