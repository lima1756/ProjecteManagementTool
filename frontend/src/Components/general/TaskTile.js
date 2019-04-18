import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChipTag from './ChipTag'

class TaskTile extends Component {

    constructor(props){
        super(props);
        this.state = {
            tags:[]
        }
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
        })
        .then(json=>{
            this.setState({
                tags: json.rows
            })
        })
    }

    render() {
        const task = this.props.task;
        const date = new Date(task['DEADLINE']);
        const dateString = date.toLocaleDateString()
        return (
            <div className="tile tile-centered task-tile" key={task['ID']}>
                <div className="tile-content">
                    <div className="tile-title">{task['TASK_NAME']}</div>
                    <small className="tile-subtitle text-gray">Deadline: {dateString}</small>
                    <small className="tile-subtitle text-gray">
                        {this.state.tags.map((tag, id)=>{
                            return (<ChipTag key={id} value={tag['tag_name']} color={tag['color']}/>)
                        })}
                    </small>
                </div>
                <div className="tile-action">
                    <button className="btn btn-link">
                    <i className="icon icon-more-vert"></i>
                    </button>
                </div>
            </div>
        );
    }
}

TaskTile.propTypes = {
    task: PropTypes.object.isRequired,
    projectId: PropTypes.number.isRequired
};

export default TaskTile;