import React, { Component } from 'react';
import ReactMapboxGl, {
  ZoomControl,
  Cluster,
  Marker,
  Popup
} from 'react-mapbox-gl';

import images from './img';
import resumes from './resumes';

const popupOffsets = {
  top: [0, 30],
  'top-left': [30, 30],
  'top-right': [-30, 30],
  bottom: [0, -30],
  'bottom-left': [30, -30],
  'bottom-right': [-30, -30],
  left: [30, 0],
  right: [-30, 0]
};

const Map = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOXACCESSTOKEN,
  maxZoom: 7
});

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fitBounds: [[-38, 25], [69, 63]]
    };

    this.renderMarkers.bind(this);
  }

  clusterMarker(coordinates, pointCount) {
    return (
      <Marker
        key={coordinates}
        coordinates={coordinates}
        offset={[0, 60 / 2]}
        className="marker"
        s
      >
        <img
          src={images.team}
          alt="team icon"
          style={{ height: 60, width: 60 }}
        />
      </Marker>
    );
  }

  renderMarkers() {
    return this.props.members.map(p => {
      return (
        <Marker
          key={p.id}
          coordinates={p.location}
          offset={[0, 60 / 2]}
          onClick={() => this.props.selectMember(p)}
          className="marker"
        >
          <img
            src={images[p.id]}
            alt={p.name}
            style={{ height: 60, width: 60 }}
          />
        </Marker>
      );
    });
  }

  render() {
    const sm = this.props.selectedMember;

    return (
      <Map // eslint-disable-next-line
        style="mapbox://styles/mapbox/streets-v9"
        className="map"
        fitBounds={this.state.fitBounds}
        onMouseDown={this.props.unselectMember}
        onStyleLoad={map => this.props.setMap(map)}
      >
        <ZoomControl />
        <Cluster ClusterMarkerFactory={this.clusterMarker} zoomOnClick={true}>
          {this.renderMarkers()}
        </Cluster>
        {sm && (
          <Popup
            className="popup"
            coordinates={sm.location}
            offset={popupOffsets}
          >
            <div>
              <h1>{sm.name}</h1>
              <p>{sm.description}</p>
              <p>ECTS involvement: {sm.ects}</p>
              {sm.email.map(m => {
                return (
                  <p key={m}>
                    <a href={`mailto:${m}`}>{m}</a>
                  </p>
                );
              })}
              <p>
                {resumes[sm.id - 1] && (
                  <a target="_blank" href={resumes[sm.id - 1]}>
                    CV
                  </a>
                )}
              </p>
            </div>
          </Popup>
        )}
      </Map>
    );
  }
}

export default MapComponent;
