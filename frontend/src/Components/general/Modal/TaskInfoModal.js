import React from 'react'
import PropTypes from 'prop-types'
import SelectTag from '../Forms/SelectTag'

class TaskInfoModal extends React.Component{

    constructor(props){
        super(props);
    }


    

    render(){
        const task = this.props.task;
        const dateString = new Date(task['DEADLINE']).toLocaleDateString();
        return(
            <div className="modal active modal-lg" id="modal-id">
                <a href="#close" className="modal-overlay" aria-label="Close" onClick={this.props.close}></a>
                <div className="modal-container">
                    <div className="modal-header">
                        <a href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={this.props.close}></a>
                        <div className="modal-title h5">{this.props.task.TASK_NAME}</div>
                    </div>
                    <div className="modal-body" ref={this.modal}>
                        
                        <small className="tile-subtitle text-gray">Deadline: {dateString}</small>
                        <SelectTag selectedTags={this.props.tags} allTags={this.props.allTags} handleChange={this.props.handleTagChange}/>
                        
                    </div>
                </div>
            </div>
        )
    }
}

TaskInfoModal.propTypes = {
    close: PropTypes.func.isRequired,
    allTags: PropTypes.array.isRequired,
    task: PropTypes.object.isRequired,
    projectId: PropTypes.number.isRequired,
    tags: PropTypes.array.isRequired,
    updateTags: PropTypes.func.isRequired,
};

export default TaskInfoModal;