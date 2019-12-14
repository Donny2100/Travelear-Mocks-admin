import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";

export class Track extends PureComponent {
  renderEditButton(track, role, useId) {
    // invisible for any user
    if (role === "user") {
      return null;
    }

    if (role === 'creator' && track.author !== useId) {
      return null;
    }

    // invisible on any public tracks for any creators
    if (role === 'creator' && track.isPublic) {
      return null;
    }

    return (
      <Link
        className="list-edit"
        to={`/admin/new-track?collection=tracks&id=${track.id}`}
      >
        Edit
      </Link>
    );
  }

  renderReviewButton(track, role) {
    // invisible for any user
    if (role === "user") {
      return null;
    }

    if (role === "admin" && !track.isPublic) {
      return (
        <Link
          className="list-edit"
          to={`/admin/review-track?collection=tracks&id=${track.id}`}
        >
          Review Track
        </Link>
      );
    }
    return null;
  }

  render() {
    const { track, role, useId } = this.props;
    return (
      <div className="list-detail" key={track.id}>
        <span>
          {this.renderEditButton(track, role, useId)}
          {this.renderReviewButton(track, role)}
        </span>
        <div className="detail-info">
          <img src={track.image} alt={track.name} height="130" width="130" />
          <div className="flex-full flex-column detail-info-right">
            <span className="detail-name">{track.name}</span>
            <span>{track.authorName}</span>
            <span>{track.location}</span>
            <div>
              <span>{track.latitude}</span>
              <span>{track.longitude}</span>
            </div>
            <span>{track.tags}</span>
          </div>
        </div>
        <audio controls className="audio">
          <source src={track.file} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }
}

Track.propTypes = {
  track: PropTypes.object.isRequired,
  role: PropTypes.string,
  useId: PropTypes.string.isRequired
};

Track.defaultProps = {
  role: "user"
};
