(function( neighbourhood ) {

    //Private Variables
    var map = document.getElementById('map');
    var center = {
        lat: 49.2827,
        lng: -123.1207
    };
    var zoom = 13;
    var markers = [];
    var markersModel = [];
    var styles = [];
    var zomatoAPIKey = "57af914482656343f203e3886d78f719";
    var zomatoURL = "https://developers.zomato.com/api/v2.1/search?";
    //Public Variaables
    //Public Methods

    neighbourhood.getZomatoAPIKey = function() {
        return zomatoAPIKey;
    }

    neighbourhood.getZomatoURL = function() {
        return zomatoURL;
    }

    neighbourhood.getMap = function() {
        return map;
    };

    neighbourhood.setStyles = function( styleArray ) {
        styles = styleArray;
    };

    neighbourhood.getCenter = function() {
        return center;
    };

    neighbourhood.getStyle = function() {
        return styles;
    };

    neighbourhood.setMarkers = function( markersArray ) {
        markers = markersArray;
    }

    neighbourhood.getMarkers = function() {
        return markers;
    }

    neighbourhood.addMarker = function( marker ) {
        var map = neighbourhood.getMap();
        if ( !marker.map ) {
            console.log(marker);
            marker.setMap( map );
        }   
    }

    neighbourhood.removeMarker = function ( marker ) {
        marker.setMap( null );
    }

    neighbourhood.getMarkers = function() {
        return markers;
    };

    neighbourhood.getZoom = function() {
        return zoom;
    }; 

    neighbourhood.initMap = function(){
        map = new google.maps.Map(map, {
            center: neighbourhood.getCenter(),
            zoom: neighbourhood.getZoom(),
            disableDefaultUI: true,
            styles: neighbourhood.getStyle()
        });

          google.maps.event.addDomListener(window, 'resize', function() {
              map.setCenter( neighbourhood.getCenter() );
          });

        renderMarkers();

}

    //Private Methods
    function renderMarkers() {

        var bounds = new google.maps.LatLngBounds();
        var largeInfowindow = new google.maps.InfoWindow();

        neighbourhood.getMarkers().forEach( function ( marker ) {

            marker.setMap(neighbourhood.getMap());
            marker.infoWindow = largeInfowindow;
            marker.addListener("click", function() {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout( function() { 
                    marker.setAnimation(null); 
                }, 750);
                renderInfoWindow(marker, largeInfowindow);
            });
            bounds.extend(marker.position);
        });
        neighbourhood.getMap().fitBounds(bounds);
    };

    function renderInfoWindow(marker, infoWindow) {
        if ( infoWindow.marker != marker ) {
            jQuery.get(zomatoURL, { 
                lat: marker.position.lat(),
                lon: marker.position.lng(),
                radius: 40,
                apikey: zomatoAPIKey
            } ).done( function( data ) {
                console.log(data);

                if ( data.results_found === 0) {
                    infoWindow.setContent('<div>' + marker.address + '</div><div>No near by restaurants from Zomato!</div>');
                } else {
                    var restaurantName = data.restaurants[0].restaurant.name;
                    var userRating = data.restaurants[0].restaurant.user_rating.aggregate_rating;
                    infoWindow.setContent('<div>' + marker.address + '</div><div>Zomato found ' + restaurantName +' nearby!  It has a user rating of ' + userRating +'!</div>');
                }

                infoWindow.marker = marker;
                infoWindow.open(map, marker);
                infoWindow.addListener('closeclick',function(){
                    infoWindow.setMarker = null;
              });
            });

        }
    };

}( window.neighbourhood = window.neighbourhood || {} ) );

neighbourhood.setMarkers(
    [
        new google.maps.Marker({
                  position: {lat: 49.285071, lng: -123.112098},
                  title: 'Simon Fraser University',
                  address: 'Harbour Centre, 555 W Hastings St, Vancouver, BC V6B, Canada'  
                }),

        new google.maps.Marker({
                  position: {lat: 49.287286, lng: -123.117867},
                  title: 'Douglas Jung Building',
                  address: '1006-1034 W Hastings St, Vancouver, BC V6E, Canada'             
        }),
         new google.maps.Marker({
                  position: {lat: 49.279253, lng: -123.117686},
                  title: 'Noodlebox',
                  address: '833 Homer St, Vancouver, BC V6B 0H4, Canada'             
        }),
         new google.maps.Marker({
                  position: {lat: 49.287086, lng: -123.124697},
                  title: 'Steve Nash Fitness World',
                  address: '1185 W Georgia St, Vancouver, BC V6E 4E6, Canada'             
        }),
          new google.maps.Marker({
                  position: {lat: 49.300952, lng:  -123.141288},
                  title: 'Stanley Park' ,
                  address: '23 Stanley Park Causeway, Vancouver, BC V6G, Canada'         
        }),
          new google.maps.Marker({
                  position: {lat: 49.282500, lng:  -123.129968},
                  title: 'Nelson Park',
                  address: '1109-1143 Comox St, Vancouver, BC V6E, Canada'             
        })               
    ]);

neighbourhood.setStyles([
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#444444"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    }
]);

neighbourhood.initMap();

function contains(value, searchFor)
{
    var v = (value || '').toLowerCase();
    var v2 = searchFor;
    if (v2) {
        v2 = v2.toLowerCase();
    }
    return v.indexOf(v2) > -1;
}

var ViewModel = function() {

    var self = this;

    self.markers = ko.observableArray( neighbourhood.getMarkers() );
    
    self.filterText = ko.observable("");
    self.filteredMarkers = ko.computed( function() {
        if (self.filterText().length > 0) {
            var markerArray = self.markers();
            return ko.utils.arrayFilter( markerArray, function( marker ) {
                if ( contains( marker.title, self.filterText() ) === true ) {
                    neighbourhood.addMarker( marker );
                    return true;
                } else {
                    neighbourhood.removeMarker( marker );
                    return false;
                }
            });
        } else {
            neighbourhood.getMarkers().forEach( function(marker) {
                marker.setMap(neighbourhood.getMap());
            });
            return self.markers();
        }
    });

    self.renderOnMap = function( marker ) {
        var infoWindow = marker.infoWindow;
            jQuery.get(neighbourhood.getZomatoURL, { 
                            lat: marker.position.lat(),
                            lon: marker.position.lng(),
                            radius: 40,
                            apikey: neighbourhood.getZomatoAPIKey()
                        } ).done( function( data ) {
                            console.log(data);

                            if ( data.results_found === 0) {
                                infoWindow.setContent('<div>' + marker.address + '</div><div>No near by restaurants from Zomato!</div>');
                            } else {
                                var restaurantName = data.restaurants[0].restaurant.name;
                                var userRating = data.restaurants[0].restaurant.user_rating.aggregate_rating;
                                infoWindow.setContent('<div>' + marker.address + '</div><div>Zomato found ' + restaurantName +' nearby!  It has a user rating of ' + userRating +'!</div>');
                            }
                        });
            infoWindow.open(neighbourhood.getMap(), marker);
    }
    /*
    this.listItem = ko.computed( function() {
        return this.markers().title + " " + this.markers().address;
    }, this);
    */
}
ko.applyBindings( new ViewModel() );
