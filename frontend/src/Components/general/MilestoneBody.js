import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Panel from './Panel';
import TasksList from './TasksList';
import SelectTag from './Forms/SelectTag';

class MilestoneBody extends Component {
    
    static get STATE_ERROR(){ return -1; }
    static get STATE_EMPTY(){ return 0; }
    static get STATE_LOADING(){ return 1; }
    static get STATE_LOADED(){ return 2; }


    render() {
        switch(this.props.state){
            case MilestoneBody.STATE_ERROR:
                break;
            case MilestoneBody.STATE_EMPTY:
                return (
                    <div className='column col-8'>
                        <div className="empty">
                            <div className="empty-icon">
                                <i className="icon icon-bookmark"></i>
                            </div>
                            <p className="empty-title h5">No milestone selected</p>
                            <p className="empty-subtitle">Please select a milestone from the left panel.</p>                    
                        </div>
                    </div>
                )
            case MilestoneBody.STATE_LOADING:
                return (
                    <div className='column col-8'>
                        <div className='card'>
                            <div className='card-body'>
                                <div className="loading loading-lg"></div>
                            </div>
                        </div>
                    </div>
                )
            case MilestoneBody.STATE_LOADED:
                const date = new Date(this.props.milestone['DEADLINE']);
                const dateString = date.toLocaleDateString()
                return (
                    <div className='column col-8'>
                        <div className='card auto-scroll-height-80'>
                            <div className="card-header">
                                <div className="card-title h5">{this.props.milestone['MILESTONE_NAME']}</div>
                                <div className="card-subtitle text-gray">Deadline: {dateString}</div>
                            </div>
                            <div className="card-body">
                                {this.props.milestone['MILESTONE_DESCRIPTION']}
                            </div>
                            <div className="card-footer">
                                <SelectTag selectedTags={this.props.selectedTags} allTags={this.props.allTags} handleChange={this.props.handleTagChange}/>
                                {/* TODO: Create the edit and remove button */}
                                
                            </div>
                            <div className="divider text-center" data-content="Tasks"></div>
                            <div>
                                <TasksList projectId={this.props.projectId} milestoneId={parseInt(this.props.milestone['ID'])} allTags={this.props.allTags}/>
                            </div>
                            
                        </div>
                    </div>
                    
                );
        }
    }
}

MilestoneBody.propTypes = {
    milestone: PropTypes.object,
    state: PropTypes.number.isRequired,
    projectId: PropTypes.number.isRequired,
    selectedTags: PropTypes.array.isRequired,
    allTags: PropTypes.array.isRequired,
    handleTagChange: PropTypes.func.isRequired
};

export default MilestoneBody;