import React from 'react';
import Select from 'react-select'
import chroma from 'chroma-js';
import PropTypes from 'prop-types';

class SelectTag extends React.Component{ 

  render(){
      return (<Select value={this.props.selectedTags} onChange={this.props.handleChange} options={this.props.allTags} isMulti closeMenuOnSelect={false} styles={SelectTag.colourStyles}/>)
  }

  static propTypes={
    selectedTags:PropTypes.array,
    allTags:PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
  }

  static get colourStyles() 
  {
    return {
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
  }
  
}


export default SelectTag;