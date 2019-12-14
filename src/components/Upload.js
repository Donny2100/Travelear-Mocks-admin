import React, { Component } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';

import { uploadFile } from '../firebase/storage';
import './Upload.css';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };
    this.onUpload = this.onUpload.bind(this);
    this.onClick = this.onClick.bind(this);
    this.inputFile = React.createRef();
  }

  onUpload(e) {
    const { accept } = this.props;
    const { name } = this.props;
    const file = e.target.files[0];
    let ref = file.name;
    if (accept === 'audio') {
      ref = `audio/$${uuid()}-${file.name}`;
    } else {
      ref = `image/$${uuid()}-${file.name}`;
    }
    uploadFile(file, ref, progress => this.setState({ progress }))
      .then(value => {
        this.props.onChange({
          target: {
            name,
            value
          }
        });
      })
      .catch(error => console.log(error));
  }

  onClick(e) {
    this.inputFile.current.click();
  }

  render() {
    const { value, type, placeholder, name, accept } = this.props;
    let acceptFile = 'image/*';
    if (accept === 'audio') {
      acceptFile = 'audio/*';
    }

    return (
      <div className="form-input">
        {type === 'thumb' ? (
          <div className="profile-image" onClick={this.onClick}>
            {value === '' ? (
              <span>profile image</span>
            ) : (
              <img width={130} height={130} src={value} alt={placeholder} />
            )}
          </div>
        ) : (
          <div className="form-input-upload">
            <input
              name={name}
              value={value}
              onChange={this.props.onChange}
              placeholder={placeholder}
            />
            <span onClick={this.onClick}>Choose</span>
          </div>
        )}
        {this.state.progress ? <span>{this.state.progress}%</span> : null}
        <input
          style={{ opacity: 0, width: 0, height: 0 }}
          accept={acceptFile}
          ref={this.inputFile}
          type="file"
          name="Upload"
          onChange={this.onUpload}
          hidden
        />
      </div>
    );
  }
}

Upload.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  accept: PropTypes.oneOf(['image', 'audio']),
  type: PropTypes.oneOf(['thumb', 'input']),
  name: PropTypes.string,
  placeholder: PropTypes.string
};

Upload.defaultProps = {
  value: '',
  accept: 'image',
  type: 'thumb',
  name: 'image',
  placeholder: 'Upload'
};

export default Upload;
