import React from 'react';
import {
  Map, GoogleApiWrapper
} from 'google-maps-react';
import PropTypes from 'prop-types';


class MapContainer extends React.Component {
  render() {
    const {
      google, campground: {
        lat, lng
      }
    } = this.props;
    const center = { lat, lng };
    const style = {
      width: '100%',
      height: '400px'
    };
    return (
      <Map
        google={google}
        style={style}
        center={center}
        zoom={15}
        onClick={this.onMapClicked}
        scrollwheel={false}
      />
    );
  }
}

MapContainer.propTypes = {
  campground: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }).isRequired,
  google: PropTypes.shape({
    maps: PropTypes.shape({
      Map: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCzu35XTda9FLYoYkDRnHGoNVU6bVukyio'
})(MapContainer);
