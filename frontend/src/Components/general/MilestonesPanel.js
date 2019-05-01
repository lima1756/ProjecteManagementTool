import React, { Component } from 'react';
import Panel from './Panel';
import NewMilestoneModal from '../general/Modal/NewMilestoneModal'
import PropTypes from 'prop-types';

class MilestonesPanel extends Component {
    
    state = {
        data: null,
        isEmpty: true,
        modal: false,
        loading: true,
        orderBy: 0,
        filter: 0
    }
    
    constructor(props){
        super(props);
        this.updateMilestones = this.updateMilestones.bind(this);
        this.order = this.order.bind(this);
        this.filter = this.filter.bind(this);
        this.updateMilestones(0, 0);
        this._isMounted = true;

    }

    updateMilestones(filter, orderBy){
        if(this._isMounted)
        {
            this.setState({
                loading: true
            })
        }
        let endpoint = 'http://127.0.0.1:3000/api/projects/milestones?projectId='+this.props.projectId;
        
        if(filter===1){
            endpoint += '&filter=expired'
        }
        else if(filter===2){
            endpoint += '&filter=open'
        }
        else if(filter === 3){
            endpoint += '&filter=closed'
        }
        if(orderBy === 0){
            endpoint += '&orderBy=DEADLINE'
        }
        else if(orderBy === 1){
            endpoint += '&orderBy=NAME'
        }

        fetch(endpoint, {
            method: 'get',
            Accept: 'application/json',
            headers: {
                "token": localStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.status!=200)
                throw new Error(response.status);
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

    order(event){
        const val = parseInt(event.target.value);
        this.setState({orderBy:val});
        this.updateMilestones(this.state.filter, val);
    }

    filter(event){
        const val = parseInt(event.target.value);
        this.setState({filter:val});
        this.updateMilestones(val, this.state.orderBy);
    }

    render(){
        const filter = (
            <div position={Panel.POSITION_NAVIGATION}>
                <div className="filter" >
                    <input hidden type="radio" id="tag-all" className="filter-tag" name="filter" value={0} onChange={this.filter} checked={this.state.filter === 0} />
                    <input hidden type="radio" id="tag-expired" className="filter-tag" name="filter" value={1} onChange={this.filter} checked={this.state.filter === 1} />
                    <input hidden type="radio" id="tag-non-expired" className="filter-tag" name="filter" value={2} onChange={this.filter} checked={this.state.filter === 2} />
                    <input hidden type="radio" id="tag-closed" className="filter-tag" name="filter" value={3} onChange={this.filter} checked={this.state.filter === 3} />
                    <div className="filter-nav">
                        <label className={this.state.filter===0?"chip bg-primary":"chip"} htmlFor="tag-all">All</label>
                        <label className={this.state.filter===1?"chip bg-primary":"chip"} htmlFor="tag-expired">Expired</label>
                        <label className={this.state.filter===2?"chip bg-primary":"chip"} htmlFor="tag-non-expired">Open Unexpired</label>
                        <label className={this.state.filter===3?"chip bg-primary":"chip"} htmlFor="tag-closed">Closed</label>
                    </div>
                </div>
                <div className="filter" >
                    <input hidden type="radio" id="tag-0" className="filter-tag" name="order" value={0} onChange={this.order} checked={this.state.orderBy === 0} />
                    <input hidden type="radio" id="tag-1" className="filter-tag" name="order" value={1} onChange={this.order} checked={this.state.orderBy === 1} />
                    <div className="filter-nav">
                        <label className={this.state.orderBy===0?"chip bg-primary":"chip"} htmlFor="tag-0">Order by Deadline</label>
                        <label className={this.state.orderBy===1?"chip bg-primary":"chip"} htmlFor="tag-1">Order by Name</label>
                    </div>
                </div>
            </div>
        )
        const modal = (<div>{this.state.modal && <NewMilestoneModal tags={this.props.tags} projectId={parseInt(this.props.projectId)} close={()=>{this.setState({modal:false})}} reload={this.updateMilestones} />}</div>);
        if(this.state.isEmpty){
            return(
                <div className='column col-4'>
                    <Panel title='Milestones' loading = {false}>
                        {filter}
                        <div className="empty" position={Panel.POSITION_BODY}>
                            <div className="empty-icon">
                                <i className="icon icon-bookmark"></i>
                            </div>
                            <p className="empty-title h5">You have no milestones</p>
                            <p className="empty-subtitle">Click the button to create a new one or change the filter.</p>
                            <div className="empty-action">
                                <button className="btn btn-primary" onClick={()=>{this.setState({modal:true})}}>New milestone</button>
                            </div>
                            
                        </div>
                    </Panel>
                    
                    {modal}
                </div>
                
            )
        }
        return (
            <div className='column col-4'>
                <Panel title='Milestones' loading={this.state.loading}>
                    {filter}
                    
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
        loadInfo: PropTypes.func,
        tags: PropTypes.array
    }
}



export default MilestonesPanel;