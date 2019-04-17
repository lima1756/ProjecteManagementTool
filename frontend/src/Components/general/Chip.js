import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Chip extends Component {

    render() {
        const color = hexToRgb(this.props.color);
        const chipStyle = {
            color: (color.r*0.299 + color.g*0.587 + color.b*0.114) > 186?'#000000':'#FFFFFF',
            background: this.props.color
        }
        return (
            <span class="chip" style={chipStyle}>{this.props.value}</span>
        );
    }

    static hexToRgb(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
    
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

}

Chip.propTypes = {
    value: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired
};

export default Chip;