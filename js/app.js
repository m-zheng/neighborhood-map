var map;

var viewModel;

var locations = [{
        title: 'Big Ben',
        lat: 51.500729,
        lng: -0.124603
    },
    {
        title: 'London Eye',
        lat: 51.503257,
        lng: -0.119243
    },
    {
        title: 'British Museum',
        lat: 51.519410,
        lng: -0.126928
    },
    {
        title: 'Buckingham Palace',
        lat: 51.501365,
        lng: -0.141913
    },
    {
        title: 'Tower of London',
        lat: 51.508092,
        lng: -0.075896
    },
    {
        title: 'St. Paul\'s Cathedral',
        lat: 51.513825,
        lng: -0.098340
    },
    {
        title: 'National Gallery',
        lat: 51.508942,
        lng: -0.128288
    },
    {
        title: 'Tate Modern',
        lat: 51.507589,
        lng: -0.099367
    },
    {
        title: 'Victoria and Albert Museum',
        lat: 51.496639,
        lng: -0.172169
    },
    {
        title: 'Greenwich Park',
        lat: 51.476871,
        lng: -0.000556
    },
    {
        title: 'St James\'s Park',
        lat: 51.504036,
        lng: -0.131603
    },
    {
        title: 'Harrods',
        lat: 51.499405,
        lng: -0.163213
    },
    {
        title: 'Selfridges',
        lat: 51.5140049,
        lng: -0.1525702
    },
    {
        title: 'Saatchi Gallery',
        lat: 51.490697,
        lng: -0.158717
    },
    {
        title: 'Dr Johnson\'s House',
        lat: 51.515090,
        lng: -0.108179
    },
    {
        title: 'Mansion House',
        lat: 51.513026,
        lng: -0.089571
    },
    {
        title: 'National Maritime Museum',
        lat: 51.480862,
        lng: -0.005300
    },
];



/**
 * @description return error message when loading google map incorrectly
 */
function googleError() {
    alert('oops, the google map wasn\'t loaded properly!');
}

/**
 * @description Load google map via google map api.
 * Constructor creates a new map, only center and zoom are required.
 */
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 51.500729,
            lng: -0.124603
        },
        zoom: 13,
        styles: [{
                "featureType": "landscape.man_made",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f7f1df"
                }]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#d0e3b4"
                }]
            },
            {
                "featureType": "landscape.natural.terrain",
                "elementType": "geometry",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi.business",
                "elementType": "all",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi.medical",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#fbd3da"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#bde6ab"
                }]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ffe15f"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [{
                    "color": "#efd151"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#ffffff"
                }]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "black"
                }]
            },
            {
                "featureType": "transit.station.airport",
                "elementType": "geometry.fill",
                "stylers": [{
                    "color": "#cfb2db"
                }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#a2daf2"
                }]
            }
        ]
    });

    /**
     * @description It creates a new marker icon of that color.
     * have an origin of 0, 0 and be anchored at 10, 34).
     * It uses the location array to create an array of markers on initialize.
     * And add event listener to marker on click, mouseover and mouseout.
     * It extends the boundaries of the map for each marker,
     * and make the map responsive.
     * @param {string} markerColor - COLOR 
     */
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'
            + markerColor
            + '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }

    var defaultIcon = makeMarkerIcon('f75850');
    var highlightedIcon = makeMarkerIcon('FFFF24');
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();
    var markers = [];

    for (var i = 0; i < locations.length; i++) {
        var title = locations[i].title;
        var marker = new google.maps.Marker({
            map: map,
            position: {
                lat: locations[i].lat,
                lng: locations[i].lng
            },
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });
        markers.push(marker);
        viewModel.locationList()[i].marker = marker;
        marker.addListener('click', (function(marker) {
            return function() {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 750);
                populateInfoWindow(marker, largeInfowindow);
            };
        })(marker));
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });
        bounds.extend(markers[i].position);
    }
    google.maps.event.addDomListener(window, 'resize', function() {
        map.fitBounds(bounds);
    });
}



/**
 * @description This function populates the infowindow
 * when corresponding marker is clicked.
 * Only one infowindow which will open at the marker that is clicked,
 * and populate based on that markers position.
 * The default content for infowindow is mark title plus error message.
 * But when the marker is clicked, ajax request will be fired to update content.
 * A closeclick event listener is add to infowindow as well.
 */
function populateInfoWindow(marker, infowindow) {
    if (infowindow.marker != marker) {
        var content = '';
        content += '<h1 class="marker-title">'
                + marker.title
                + '</h1><p class="marker-summary">Oops! Something went wrong</p>';
        
        var wikiURL = 'https://en.wikipedia.org/w/api.php'
                    + '?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='
                    + marker.title;
        infowindow.setContent('');
        $.ajax({
            url: wikiURL,
            method: "GET",
            dataType: "jsonp",
        }).done(function(data) {
            $.each(data.query.pages, function(i, item) {
                content = '';
                var wikiPage = "https://en.wikipedia.org/?curid=" + i;
                var wikiSummary = item.extract.substring(0, 250);
                content += '<h1 class="marker-title">'
                        + marker.title
                        + '</h1><p class="marker-summary">'
                        + wikiSummary
                        + ' ...<a target="_blank" href="'
                        + wikiPage
                        + '">Wikipedia</a> </p>';
                infowindow.setContent(content);
            });

        }).fail(function() {
            content = '';
            content += '<h1 class="marker-title">'
                    + marker.title
                    + '</h1><p class="marker-summary">Oops! Something went wrong</p>';
            infowindow.setContent(content);
        });

        infowindow.marker = marker;
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        infowindow.open(map, marker);
    }
}

/**
 * @description Location Model
 */
var Location = function(data) {
    this.title = data.title;
    this.lag = data.lag;
    this.lng = data.lng;
};

/**
 * @description It will filter user's input and return matched results.
 * When the menu button is clicked,
 * it will add toggle class to the element to show the search bar.
 */
var ViewModel = function() {
    var self = this;

    this.locationList = ko.observableArray([]);

    locations.forEach(function(locationAttribute) {
        self.locationList.push(new Location(locationAttribute));
    });

    this.activeInfoWindow = function(location) {
        google.maps.event.trigger(location.marker, 'click');
    };

    this.query = ko.observable('');

    this.queryResults = ko.computed(function() {

        return ko.utils.arrayFilter(self.locationList(), function(singleLocation) {
            if (singleLocation.marker) {
                singleLocation.marker.setVisible(false);
            }

            if (!self.query() && singleLocation.marker) {
                singleLocation.marker.setVisible(true);
            }

            if (singleLocation.title.toLowerCase().indexOf(self.query().toLowerCase()) !== -1
                && singleLocation.marker) {
                singleLocation.marker.setVisible(true);
            }

            return singleLocation.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
        });
    });

    this.toggledNav = ko.observable(false);
    
    this.triggerToggle = function() {
        this.toggledNav(!this.toggledNav());
    };
};


viewModel = new ViewModel();


ko.applyBindings(viewModel);
