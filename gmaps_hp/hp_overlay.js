var overlay;

HPOverlay.prototype = new google.maps.OverlayView();

function initialize() {
    var bostonCenter = new google.maps.LatLng(42.3453938, -71.07931155);
    var mapOptions = {
        zoom: 11,
        center: bostonCenter,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var swBound = new google.maps.LatLng(42.005594, -71.4328231);
    var neBound = new google.maps.LatLng(42.6851936, -70.72580);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);
    var srcImage = 'apts_large_rainbow.png';
    overlay = new HPOverlay(bounds, srcImage, map);
}

/** @constructor */
function HPOverlay(bounds, image, map) {

    // Now initialize all properties.
    this.bounds_ = bounds;
    this.image_ = image;
    this.map_ = map;

    // We define a property to hold the image's
    // div. We'll actually create this div
    // upon receipt of the add() method so we'll
    // leave it null for now.
    this.div_ = null;

    // Explicitly call setMap on this overlay
    this.setMap(map);
}

HPOverlay.prototype.onAdd = function() {

    // Note: an overlay's receipt of add() indicates that
    // the map's panes are now available for attaching
    // the overlay to the map via the DOM.

    // Create the DIV and set some basic attributes.
    var div = document.createElement('div');
    div.style.border = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';

    // Create an IMG element and attach it to the DIV.
    var img = document.createElement('img');
    img.src = this.image_;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.opacity = '0.5';
    div.appendChild(img);

    // Set the overlay's div_ property to this DIV
    this.div_ = div;

    // We add an overlay to a map via one of the map's panes.
    // We'll add this overlay to the overlayImage pane.
    var panes = this.getPanes();
    panes.overlayImage.appendChild(this.div_);
}

HPOverlay.prototype.draw = function() {

    // Size and position the overlay. We use a southwest and northeast
    // position of the overlay to peg it to the correct position and size.
    // We need to retrieve the projection from this overlay to do this.
    var overlayProjection = this.getProjection();

    // Retrieve the southwest and northeast coordinates of this overlay
    // in latlngs and convert them to pixels coordinates.
    // We'll use these coordinates to resize the DIV.
    var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    // Resize the image's DIV to fit the indicated dimensions.
    var div = this.div_;
    div.style.left = sw.x + 'px';
    div.style.top = ne.y + 'px';
    div.style.width = (ne.x - sw.x) + 'px';
    div.style.height = (sw.y - ne.y) + 'px';
}

HPOverlay.prototype.onRemove = function() {
    this.div_.parentNode.removeChild(this.div_);
}

// Note that the visibility property must be a string enclosed in quotes
HPOverlay.prototype.hide = function() {
    if (this.div_) {
        this.div_.style.visibility = 'hidden';
    }
}

HPOverlay.prototype.show = function() {
    if (this.div_) {
        this.div_.style.visibility = 'visible';
    }
}

HPOverlay.prototype.toggle = function() {
    if (this.div_) {
        if (this.div_.style.visibility == 'hidden') {
            this.show();
        } else {
            this.hide();
        }
    }
}

$(document).ready(function() {
    initialize();
}); // end of document.ready
