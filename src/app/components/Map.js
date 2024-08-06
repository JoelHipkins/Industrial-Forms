import React from 'react'
import BaseComponent from './BaseComponent'
import GoogleMaps from 'google-maps'

export default class extends BaseComponent {

  constructor(props) {

    super(props)
    this._bind('initMap')
    this.id = this.props.id
  }

  componentDidMount() {

    this.initMap()
  }

  initMap() {
    GoogleMaps.KEY = 'AIzaSyCmw2dTJwu4hMI82pe_E_XD_Od4EmMUvKI'
    GoogleMaps.LANGUAGE = 'en'
    GoogleMaps.REGION = 'EN_GB'

    GoogleMaps.load(function(google) {
      let coord = new google.maps.LatLng(53.067139, -2.526211)
      let markerCoord = new google.maps.LatLng(53.067139, -2.526211)

      let icon = {
          url: "/assets/img/marker.png", // url
          scaledSize: new google.maps.Size(40, 60), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(20, 60) // anchor
      }

      let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: coord,
        disableDefaultUI: true,
        gestureHandling: 'cooperative',
        styles: [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "on"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#f5f5f5"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#dadada"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#e5e5e5"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#eeeeee"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#c9c9c9"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          }
        ]
      })

      let marker = new google.maps.Marker({
        position: markerCoord,
        map: map,
        icon: icon
      })
      marker.map = map
    })
  }

  render() {

    return (
      <div id="map"></div>
    )
  }
}
