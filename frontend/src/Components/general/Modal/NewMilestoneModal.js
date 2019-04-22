import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormInput from '../Forms/FormInput';
import FormTextArea from '../Forms/FormTextArea'
import Select from 'react-select'
import chroma from 'chroma-js';

class NewMilestoneModal extends Component {

    state = {
        toast: false,
        toastMessage: '',
        milestoneName: '',
        milestoneDescription: '',
        deadline: ''
    }

    constructor(props){
        super(props);
        this.modal = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);

        this.state.tags = this.props.tags.map(row=>{
            return { value: row.ID, label: row.TAG_NAME, color: row.COLOR }
        })
    }

    submit() {
        fetch('http://127.0.0.1:3000/api/projects/milestones/create', {
            method: 'post',
            Accept: 'application/json',
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem('token')
            },
            body: JSON.stringify({
                projectId: this.props.projectId,
                milestoneName: this.state.milestoneName,
                milestoneDescription: this.state.milestoneDescription,
                deadline: this.state.deadline,
                tags: this.state.selectedOption.map(tag=>{return tag.value;})
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
                this.props.reload();
                this.props.close();
            }
            else {
                throw new Error('error')
            }
        })
        .catch(e => {
            if (e.message === '500')
                this.setState({ toastMessage: "There was an unexpected problem, please try again in a moment" })
            else if (e.message === '400')
                this.setState({ toastMessage: "Please check your username/email and password" })
            this.setState({ toast: true });
            this.modal.current.scrollTop=0;
        })
        
    }

    handleChange(selectedOption){
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    }

    render() {
        return (
            <div className="modal active" id="modal-id">
                <a href="#close" className="modal-overlay" aria-label="Close" onClick={this.props.close}></a>
                <div className="modal-container">
                    <div className="modal-header">
                        <a href="#close" className="btn btn-clear float-right" aria-label="Close" onClick={this.props.close}></a>
                        <div className="modal-title h5">New Milestone</div>
                    </div>
                    <div className="modal-body" ref={this.modal}>
                        {
                            this.state.toast &&
                            <div className={"toast toast-error"} id='toast'>
                                <button className="btn btn-clear float-right" onClick={() => { this.setState({ toast: false }) }}></button>
                                {this.state.toastMessage}
                            </div>
                        }
                        <div className="content">
                            <FormInput inputName='Milestone Name' inputId='milestoneName' inputType='text'
                                value={this.state.milestoneName} onChange={(event) => this.setState({ milestoneName: event.target.value })} />
                            <FormTextArea inputName='Description' inputId='milestoneDescription' value={this.state.milestoneDescription}
                                onChange={(event) => this.setState({ milestoneDescription: event.target.value })}/>
                            <Select onChange={this.handleChange} options={this.state.tags} isMulti closeMenuOnSelect={false} styles={colourStyles}/>
                            <FormInput inputName='Deadline' inputId='milestoneDeadline' inputType='date'
                                value={this.state.deadline} onChange={(event) => this.setState({ deadline: event.target.value })} />
                            
                            <button className="btn btn-primary input-group-btn" onClick={this.submit}>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    static propTypes = {
        close: PropTypes.func.isRequired,
        projectId: PropTypes.number.isRequired,
        reload: PropTypes.func,
        tags: PropTypes.array
        
    }
}

const colourStyles = {
    control: styles => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
        color: isDisabled
          ? '#ccc'
          : isSelected
            ? chroma.contrast(color, 'white') > 2 ? 'white' : 'black'
            : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',
      };
    },
    multiValue: (styles, { data }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: color.alpha(0.1).css(),
      };
    },
    multiValueLabel: (styles, { data }) => ({
      ...styles,
      color: data.color,
    }),
    multiValueRemove: (styles, { data }) => ({
      ...styles,
      color: data.color,
      ':hover': {
        backgroundColor: data.color,
        color: 'white',
      },
    }),
  };

export default NewMilestoneModal;