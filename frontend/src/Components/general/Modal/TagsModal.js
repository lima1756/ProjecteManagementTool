import React, { Component } from 'react';
import ChipTag from '../ChipTag'
import PropTypes from 'prop-types';
import FormInput from '../Forms/FormInput'

class TagsModal extends Component {

    static randomColor(){
        const r = Math.floor(Math.random()*255).toString(16);
        const g = Math.floor(Math.random()*255).toString(16);
        const b = Math.floor(Math.random()*255).toString(16);
        return '#'+r+g+b;
    }

    state = {
        toast: false,
        color: TagsModal.randomColor(),
        name: '',
        tags: [],
        loading: true,
        selectedTag:-1,
        tagForm: 'New tag'
    }

    constructor(props){
        super(props);
        this.modal = React.createRef();
        this.obtainTags = this.obtainTags.bind(this);
        this.deleteTag = this.deleteTag.bind(this);
        this.submit = this.submit.bind(this);
        this.obtainTags();
    }

    obtainTags() {
        fetch('http://127.0.0.1:3000/api/projects/tags?projectId='+this.props.projectId, {
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
                console.log(json);
                this.setState({
                    tags:json.rows
                })
            }
            else {
                throw new Error('error')
            }
        })
        .catch(e => {
            this.setState({ toastMessage: "There was an unexpected problem, please try again in a moment" })
            this.setState({ toast: true });
            this.modal.current.scrollTop=0;
        })
        .finally(()=>{
            this.setState({
                loading:false
            })
        })
    }

    deleteTag(tagId){
        return ()=>{
            this.setState({
                loading:true
            })
            fetch('http://127.0.0.1:3000/api/projects/tags/delete', {
                method: 'delete',
                Accept: 'application/json',
                headers: {
                    "Content-Type": "application/json",
                    "token": localStorage.getItem('token')
                },
                body: JSON.stringify({
                    projectId: this.props.projectId,
                    tagId: tagId
                })
            })
            .then(response => {
                if (response.status == 500)
                    throw new Error('500')
                else if (response.status == 400)
                    throw new Error('400')
                return response.json()
            })
            .then(json => {
                if (json.success) {
                    this.obtainTags();
                }
                else {
                    throw new Error('error')
                }
            })
            .catch(e => {
                if (e.message === '500' || e.message === '400')
                    this.setState({ toastMessage: "There was an unexpected problem, please try again in a moment" })
                this.setState({ toast: true });
                this.modal.current.scrollTop=0;
            })
        }
    }

    submit(){
        this.setState({
            loading:true
        })
        fetch('http://127.0.0.1:3000/api/projects/tags/create', {
            method: 'post',
            Accept: 'application/json',
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem('token')
            },
            body: JSON.stringify({
                projectId: this.props.projectId,
                tagName: this.state.name,
                color: this.state.color
            })
        })
        .then(response => {
            if (response.status == 500)
                throw new Error('500')
            else if (response.status == 400)
                throw new Error('400')
            return response.json()
        })
        .then(json => {
            if (json.success) {
                this.obtainTags();
                this.setState({
                    name:'',
                    color: TagsModal.randomColor()
                })
            }
            else {
                throw new Error('error')
            }
        })
        .catch(e => {
            if (e.message === '500')
                this.setState({ toastMessage: "There was an unexpected problem, please try again in a moment" })
            else if (e.message === '400')
                this.setState({ toastMessage: "Please check the input values are correct" })
            this.setState({ toast: true });
            this.modal.current.scrollTop=0;
        })
    }

    render() {
        return (
            <div className="modal active" id="modal-id">
                <a href="#close" className="modal-overlay" aria-label="Close" onClick={this.props.close}></a>
                <div className="modal-container">
                    <div className="modal-header">
                        <a href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={this.props.close}></a>
                        <div className="modal-title h5">Project's Tags</div>
                    </div>
                    <div className="modal-body" ref={this.modal}>
                        {
                            this.state.tags.map((tag)=>{
                                return <ChipTag value={tag['TAG_NAME']} color={tag['COLOR']} delete={this.deleteTag(tag['ID'])}/>
                            })
                        }
                        <div className="modal-title h5">{this.state.tagForm}</div>
                        {
                            this.state.toast &&
                            <div className={"toast toast-error"} id='toast'>
                                <button className="btn btn-clear float-right" onClick={() => { this.setState({ toast: false }) }}></button>
                                {this.state.toastMessage}
                            </div>
                        }
                        <div className="content">
                            <FormInput inputName='Tag Name' inputId='tagName' inputType='text'
                                value={this.state.name} onChange={(event) => this.setState({ name: event.target.value })} />
                            <FormInput inputName='Tag Color' inputId='color' inputType='color'
                                value={this.state.color} onChange={(event) => {this.setState({ color: event.target.value })}} />
                            <button className="btn btn-primary input-group-btn" onClick={this.submit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

TagsModal.propTypes = {
    projectId: PropTypes.number.isRequired,
    close: PropTypes.func.isRequired
};

export default TagsModal;