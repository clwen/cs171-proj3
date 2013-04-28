var arealayer, afflayer, commutelayer, transitLayer, bikeLayer, housingLayer, map;
var areaicons = {
    U:{
        name:'Undergraduate Students',
        icon: 'http://storage.googleapis.com/support-kms-prod/SNP_2752125_en_v0'
    },
    G:{
        name:'Graduate Students',
        icon: 'http://storage.googleapis.com/support-kms-prod/SNP_2752068_en_v0'
    },
    F:{
        name:'Faculty',
        icon: 'http://storage.googleapis.com/support-kms-prod/SNP_2752129_en_v0'
    },
    A:{
        name:'Administration',
        icon: 'http://storage.googleapis.com/support-kms-prod/SNP_2752264_en_v0'
    },
    S:{
        name:'Staff',
        icon: 'http://storage.googleapis.com/support-kms-prod/SNP_2752063_en_v0'
    }
}

HPOverlay.prototype = new google.maps.OverlayView();

function initGMap() {
    var boston_latlng = new google.maps.LatLng(42.3453938, -71.07931155);
    var mapProp = {
        center: boston_latlng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    map = new google.maps.Map(document.getElementById("gmap") ,mapProp);

    var styles = [[{
            markerOptions:{
                iconName: "small_yellow",
                animation: google.maps.Animation.DROP
            }
        },{
            where: "Affiliation = 'U'",
            markerOptions:{
                iconName: "small_red"
            }
        },{
            where: "Affiliation = 'G'",
            markerOptions:{
                iconName: "small_blue"
            }
        },{
            where: "Affiliation = 'FAC'",
            markerOptions:{
                iconName: "small_green"
            }
        },{
            where: "Affiliation = 'ADM'",
            markerOptions:{
                iconName: "small_purple"
            }
        },{
            where: "Affiliation = 'AS'",
            markerOptions:{
                iconName: "measle_grey"
            }
        },{ // TODO: for some reason the affiliation styles for SS and AS are messed up (defaulting to yellow)
            where: "Affiliation = 'SS'",
            markerOptions:{
                iconName: "measle_brown"
            }
        }]];

    // Define the data layers
    // AREA
    arealayer = new google.maps.FusionTablesLayer({
        query: {
            select: "Latitude",
            from: "1Qo9SLRIPdSb0EQ3hZkmhZ3zwFliDZFJBlq-Lr7I",
        }, 
        styles:[{
            markerOptions:{
                iconName: "small_green",
                animation: google.maps.Animation.DROP
            }
        },{
            where: "Area = 'HAS'",
            markerOptions:{
                iconName: "small_yellow"
            }
        }]
    });
    // COMMUTE TYPE
    commutelayer = new google.maps.FusionTablesLayer({
        query: {
            select: "Latitude",
            from: "1KaFa7-nBJaPpN-65H63ru2L1pWLfzwOu4XeuqbM",
        }, 
        styles:[{
            markerOptions:{
                iconName: "small_blue",
                animation: google.maps.Animation.DROP
            }
        },{
            where: "Mode = 'T'",
            markerOptions:{
                iconName: "small_red"
            }
        }]
    });

    // AFFILIATION
    afflayer = new google.maps.FusionTablesLayer({
        query: {
            select: "Latitude",
            from: "1eQqFnqJ2QvYRWPNgqrD-ou06vEXHNCZ7YCAD6-4",
        }, 
        styles: styles[0]
    });

    transitLayer = new google.maps.TransitLayer();
    bikeLayer = new google.maps.BicyclingLayer();

    // construct housing price overlay
    var swBound = new google.maps.LatLng(42.005594, -71.4328231);
    var neBound = new google.maps.LatLng(42.6851936, -70.72580);
    var bounds = new google.maps.LatLngBounds(swBound, neBound);
    var srcImage = 'apts_large_rainbow.png';
    housingLayer = new HPOverlay(bounds, srcImage, map);
}

// housing price overlay constructor
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
    // this.setMap(map);
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

// Hide the current data overlays
function clearOverlays() {
    hideLegend();
    arealayer.setMap(null);
    afflayer.setMap(null);
    commutelayer.setMap(null);
    transitLayer.setMap(null);
    bikeLayer.setMap(null);
    housingLayer.setMap(null);
}

// Add a legend
function renderLegend(icons){ // TODO: make legend flexible for area, affiliation and commute type color encodings
    var legend = document.getElementById('legend');
    legend.innerHTML = '';
    for (var key in icons) {
      var type = icons[key];
      var name = type.name;
      var icon = type.icon;
      var div = document.createElement('div');
      div.innerHTML = '<img src="' + icon + '"> ' + name;
      legend.appendChild(div);
    }
    legend.className = "visible";
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend); // TODO: weirdness of the position when it re-renders, maybe use absolute positioning
}

function hideLegend(){
    document.getElementById('legend').className="invisible";
}

// Show the selected data overlays
function showOverlays() {
    clearOverlays();
    var cat = $('input[name=category]:checked').val();
    var mode = $('input[name="mode"]:checked').val();
    if(cat == "AREA"){
        arealayer.setMap(map);
    }
    else if (cat == "AFFILIATION"){
        afflayer.setMap(map);   
        renderLegend(areaicons);
    }
    else if(cat == "COMMUTE"){
        commutelayer.setMap(map);
    }
    if(mode == "transit"){
        transitLayer.setMap(map);
    }
    else if(mode == "bike"){
        bikeLayer.setMap(map);
    }
    else if(mode == "housing"){
        housingLayer.setMap(map);
    }
}

$(document).ready(function() {
    initGMap();
    showOverlays();
});
