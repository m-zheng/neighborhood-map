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
* @description load google map via google map api
*/
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 51.500729,
            lng: -0.124603
        },
        zoom: 13
    });

    // This function takes in a COLOR, and then creates a new marker
    // icon of that color. The icon will be 21 px wide by 34 high,
    // have an origin of 0, 0 and be anchored at 10, 34).
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }

    // Style the markers a bit. This will be listing marker icon.
    var defaultIcon = makeMarkerIcon('f75850');

    // Create a 'highlighted location' marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    var largeInfowindow = new google.maps.InfoWindow();

    var bounds = new google.maps.LatLngBounds();

    // Create a new blank array for all the listing markers.
    var markers = [];

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
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
        // Push the marker to our array of markers.
        markers.push(marker);

        viewModel.locationList()[i].marker = marker;

        // Create an onclick event to open an infowindow at each marker.
        // Animate the click event
        marker.addListener('click', (function(marker) {
            return function() {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null)
                }, 750);
                populateInfoWindow(marker, largeInfowindow);
            };
        })(marker));

        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });

        bounds.extend(markers[i].position);
    }

    // Extend the boundaries of the map for each marker
    // And make the map responsive
    google.maps.event.addDomListener(window, 'resize', function() {
        map.fitBounds(bounds);
    });
}



/**
* @description This function populates the infowindow when the marker is clicked.
* Only one infowindow which will open at the marker that is clicked,
* and populate based on that markers position.
*/
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Update marker title and wiki summary to infowindow
        var wikiURL = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + marker.title
        $.ajax({
            url: wikiURL,
            method: "GET",
            dataType: "jsonp",
        }).done(function(data) {
            $.each(data.query.pages, function(i, item) {
                var content = '';
                var wikiPage = "https://en.wikipedia.org/?curid=" + i;
                var wikiSummary = item.extract.substring(0, 250);
                content += '<h3>' + marker.title + '</h3><p>' + wikiSummary + ' ...<a target="_blank" href="' + wikiPage + '">Read More</a> </p>';
                infowindow.setContent(content);
            });

        }).fail(function() {
            var content = '';
            content += ' <h3> ' + marker.title + ' </h3> <p>Oops! Something went wrong</p>';
            infowindow.setContent(content);
        });

        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        // Open the infowindow on the correct marker.
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
* @description ViewModel
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

            if (singleLocation.title.toLowerCase().indexOf(self.query().toLowerCase()) !== -1 && singleLocation.marker) {
                singleLocation.marker.setVisible(true);
            }

            return singleLocation.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
        });
    });

    // The default value for toggledNav is false
    this.toggledNav = ko.observable(false);

    // When the menu button is clicked, it will add toggle class to the element.
    this.triggerToggle = function() {
        this.toggledNav(!this.toggledNav());
    };
};


viewModel = new ViewModel();


ko.applyBindings(viewModel);