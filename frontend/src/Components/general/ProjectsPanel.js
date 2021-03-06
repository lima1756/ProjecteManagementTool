import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import NewProjectModal from './Modal/NewProjectModal';
import Panel from '../general/Panel'

class ProjectPanel extends React.Component {
    
    state = {
        data: null,
        isEmpty: true,
        modal: false,
        loading: true
    }
    
    constructor(props){
        super(props);
        this.updateProjects = this.updateProjects.bind(this);
        this.updateProjects();
        this._isMounted = true;

    }

    updateProjects(){
        if(this._isMounted)
        {
            this.setState({
                loading: true
            })
        }
        fetch('http://127.0.0.1:3000/api/projects', {
            method: 'get',
            Accept: 'application/json',
            headers: {
                "token": localStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.status!=200)
                throw new Error("");
            else if (response.status == 403){
                alert("You're not allowed to do this")
                throw new Error('403')
            }
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
        if(this.state.isEmpty){
            return(
                <div className='column col-3'>
                    <div className="empty">
                        <div className="empty-icon">
                            <i className="icon icon-bookmark"></i>
                        </div>
                        <p className="empty-title h5">You have no projects</p>
                        <p className="empty-subtitle">Click the button to create a new one.</p>
                        <div className="empty-action">
                            <button className="btn btn-primary" onClick={()=>{this.setState({modal:true})}}>New project</button>
                        </div>
                        
                    </div>
                    {this.state.modal && <NewProjectModal close={()=>{this.setState({modal:false}); this.updateProjects();}}/>}
                </div>
                
            )
        }
        return (
            <div className='column col-3'>
                <Panel title='Projects' loading={this.state.loading}>
                    {
                        this.state.data.rows.map((row,index)=>{
                            return(
                                <div className='tile' key={row['ID']} position={Panel.POSITION_BODY}>
                                    <div className="tile-content">
                                        <Link to={'/dashboard/project/'+row['ID']} className="tile-title text-bold">    
                                                {row['PROJECT_NAME']}
                                        </Link>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <button className="btn btn-primary btn-block" onClick={()=>{this.setState({modal:true})}} position={Panel.POSITION_FOOTER}>New project</button>
                </Panel>
                {this.state.modal && <NewProjectModal close={()=>{this.setState({modal:false})}} reload={this.updateProjects} />}
            </div>
        )
    }
}

export default ProjectPanel;