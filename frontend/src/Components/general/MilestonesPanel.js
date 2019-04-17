import React, { Component } from 'react';
import Panel from './Panel';
import NewMilestoneModal from '../general/Modal/NewMilestoneModal'
import PropTypes from 'prop-types';

class MilestonesPanel extends Component {
    
    state = {
        data: null,
        isEmpty: true,
        modal: false,
        loading: true
    }
    
    constructor(props){
        super(props);
        this.updateMilestones = this.updateMilestones.bind(this);
        this.updateMilestones();
        this._isMounted = true;

    }

    updateMilestones(){
        if(this._isMounted)
        {
            this.setState({
                loading: true
            })
        }
        fetch('http://127.0.0.1:3000/api/projects/milestones?projectId='+this.props.projectId, {
            method: 'get',
            Accept: 'application/json',
            headers: {
                "token": localStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.status!=200)
                throw new Error("");
            return response.json();
        })
        .then(json=>{
            this.setState({
                data: json,
                isEmpty: !json.size>0,
                loading: false
            })
        })
        .catch(err=>{
            console.log(err);
        })
    }

    render(){
        const modal = (<div>{this.state.modal && <NewMilestoneModal projectId={parseInt(this.props.projectId)} close={()=>{this.setState({modal:false})}} reload={this.updateMilestones} />}</div>);
        if(this.state.isEmpty){
            return(
                <div className='column col-4'>
                    <div className="empty">
                        <div className="empty-icon">
                            <i className="icon icon-bookmark"></i>
                        </div>
                        <p className="empty-title h5">You have no milestones</p>
                        <p className="empty-subtitle">Click the button to create a new one.</p>
                        <div className="empty-action">
                            <button className="btn btn-primary" onClick={()=>{this.setState({modal:true})}}>New milestone</button>
                        </div>
                        
                    </div>
                    {modal}
                </div>
                
            )
        }
        return (
            <div className='column col-4'>
                <Panel title='Milestones' loading={this.state.loading}>
                    {
                        this.state.data.rows.map((row,index)=>{
                            const date = new Date(row['DEADLINE']);
                            const dateString = date.toLocaleDateString()
                            let color;
                            let icon;
                            if(row['MILESTONE_STATE']==='closed'){
                                color = 'example-tile-icon bg-success';
                                icon = 'icon icon-check centered'
                            }
                            else{
                                color = 'example-tile-icon ' + (date<=Date.now()?'bg-error':'bg-warning')
                                icon = 'icon icon-time centered'
                            }
                            
                            return(
                                <div className='tile tile-centered c-hand' key={row['ID']} position={Panel.POSITION_BODY} onClick={this.props.loadInfo(row['ID'])}>
                                    <div className="tile-icon">
                                        <div className={color}>
                                            <i className={icon}></i>
                                        </div>
                                    </div>
                                    <div className='tile-content'>
                                        <div  className="tile-title">
                                            {row['MILESTONE_NAME']}
                                        </div>
                                        <small className='tile-subtitle text-gray'>
                                            {dateString}
                                        </small>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <button className="btn btn-primary btn-block" onClick={()=>{this.setState({modal:true})}} position={Panel.POSITION_FOOTER}>New Milestone</button>
                </Panel>
                {modal}
            </div>
        )
    }

    static propTypes = {
        loadInfo: PropTypes.func
    }
}



export default MilestonesPanel;