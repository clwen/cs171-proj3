// GLOBAL VARIABLES //

var afflayer, commutelayer, transitLayer, bikeLayer, housingLayer, filteredLayer, map, legend, hpLegend;
var filtered = false;
var selectedmode = "all";

var styles = [[{
        where: "Affiliation IN ('AS','SS')",
        markerOptions:{
            iconName: "small_yellow",
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
    }], [{
        where: "Mode = 'T'",
        markerOptions:{
            iconName: "small_yellow",
        }
    },{
        where: "Mode = 'DRV'",
        markerOptions:{
            iconName: "small_red"
        }
    },{
        where: "Mode = 'CARPOOL'",
        markerOptions:{
            iconName: "small_blue"
        }
    },{
        where: "Mode = 'WLK'",
        markerOptions:{
            iconName: "small_green"
        }
    },{
        where: "Mode = 'BIC'",
        markerOptions:{
            iconName: "small_purple"
        }
    }]
    ];
var afficons = {
    U:{
        name:'Undergrads',
        icon: 'img/small_red.png'
    },
    G:{
        name:'Grads',
        icon: 'img/small_blue.png'
    },
    F:{
        name:'Faculty',
        icon: 'img/small_green.png'
    },
    A:{
        name:'Admin',
        icon: 'img/small_purple.png'
    },
    S:{
        name:'Staff',
        icon: 'img/small_yellow.png'
    }
}
var comicons = {
    DRV:{
        name:'Drive',
        icon: 'img/small_red.png'
    },
    CARPOOL:{
        name:'Carpool',
        icon: 'img/small_blue.png'
    },
    WLK:{
        name:'Walk',
        icon: 'img/small_green.png'
    },
    BIC:{
        name:'Bike',
        icon: 'img/small_purple.png'
    },
    T:{
        name:'MBTA',
        icon: 'img/small_yellow.png'
    }
}
var hpColors = [
    ["1000-", "rgb(255, 247, 243)"],
    ["1100", "rgb(253, 224, 221)"],
    ["1200", "rgb(252, 197, 192)"],
    ["1300", "rgb(250, 159, 181)"],
    ["1400", "rgb(247, 104, 61)"],
    ["1500", "rgb(221, 52, 151)"],
    ["1600", "rgb(174, 1, 126)"],
    ["1700", "rgb(122, 1, 119)"],
    ["1800+", "rgb(73, 0, 106)"],
];

HPOverlay.prototype = new google.maps.OverlayView();

function initGMap() {
    var boston_latlng = new google.maps.LatLng(42.3453938, -71.07931155);
    var mapProp = {
        center: boston_latlng,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    map = new google.maps.Map(document.getElementById("gmap") ,mapProp);

    // Define the data layers
    // COMMUTE TYPE
    commutelayer = new google.maps.FusionTablesLayer({
        query: {
            select: "Latitude",
            from: "1KaFa7-nBJaPpN-65H63ru2L1pWLfzwOu4XeuqbM",
        }, 
        styles: styles[1]
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
    var srcImage = 'img/apts_large_lumi.png';
    housingLayer = new HPOverlay(bounds, srcImage, map);

    // add event listeners
    // google map event listener (i.e. click anywhere on the map to refresh and reset the selection)
    google.maps.event.addListener(map, 'click', function(event) { // is mousemove or click better here??
        if(filtered){
            highlightCommuteMode("CLEAR");
            highlightAffiliation("CLEAR");
        }
        clearFilter();
        showOverlays();
    });
    // google fusion table layers event listeners
    google.maps.event.addListener(afflayer, 'click', function(event) {
        var affiliation = event.row.Affiliation.value;
        filterMap(affiliation, "Affiliation");
        highlightAffiliation(affiliation);
    });

    google.maps.event.addListener(commutelayer, 'click', function(event) {
        console.log(event);
        var mode = event.row.Mode.value;
        filterMap(mode, "Mode");
        highlightCommuteMode(mode);
    });

    // push the legend div to the map
    legend = document.getElementById('legend');
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend); 
    // push the housing price legend div to the map
    hpLegend = document.getElementById('hpLegend');
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(hpLegend); 
}

function filterMap(selection, column){
    filtered = true;
    afflayer.setMap(null);
    var query = column + " = '" + selection + "'";
    if(selection == 'AS' || selection == 'SS'){
        query = "Affiliation IN ('AS','SS')";
    }
    console.log(query);
    var filteredStyle = {};
    var stylearray = [];
    var tablekey = "";
    if (column == 'Mode'){
        stylearray = styles[1];
        tablekey = "1KaFa7-nBJaPpN-65H63ru2L1pWLfzwOu4XeuqbM";
        selectedmode = selection;
    }
    else if (column == 'Affiliation'){
        stylearray = styles[0];
        tablekey = "1eQqFnqJ2QvYRWPNgqrD-ou06vEXHNCZ7YCAD6-4";
    }
    // TODO: select an affiliation or commute mode on the map - filter the map view to only the group of points and interact with other viz
    for (var s in stylearray){
        if(stylearray[s].where == query){
            filteredStyle.markerOptions = stylearray[s].markerOptions; 
        }
    }
    console.log(filteredStyle);
    filteredLayer = new google.maps.FusionTablesLayer({
        query: {
            select: "Latitude",
            from: tablekey,
            where: query
        }, 
        styles: [filteredStyle]
    });
    showOverlays();
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
    panes.mapPane.appendChild(this.div_);
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
    afflayer.setMap(null);
    commutelayer.setMap(null);
    transitLayer.setMap(null);
    bikeLayer.setMap(null);
    housingLayer.setMap(null);
    if(filteredLayer){
        filteredLayer.setMap(null);
    }
    var cat = $('input[name=category]:checked').val();
    if (cat == "AFFILIATION" && filtered){
        filteredLayer.setMap(map);   
        renderLegend(afficons);
    }
    else if (cat == "AFFILIATION"){
        afflayer.setMap(map);   
        renderLegend(afficons);
    }
    if(cat == "COMMUTE" && filtered){
        filteredLayer.setMap(map);
        renderLegend(comicons);
    } else if(cat == "COMMUTE"){
        commutelayer.setMap(map);
        renderLegend(comicons);
    }
}

function clearFilter(){
    filtered = false;
}

// Add a legend for the data points
function renderLegend(icons){
    legend.innerHTML = '<b>Data<br>Legend</b><br>';
    for (var key in icons) {
      var type = icons[key];
      var name = type.name;
      var icon = type.icon;
      var div = document.createElement('div');
      div.innerHTML = '<img src="' + icon + '"> ' + name;
      legend.appendChild(div);
    }
    legend.className = "visible";
}

// Add a legend for the housing price overlay
function renderHpLegend(){
    hpLegend.innerHTML = '<b>Rental<br/>Price<br/>Legend</b>';
    hpColors.forEach( function(d) {
        var price = d[0];
        var color = d[1];
        var div = document.createElement('div');
        div.innerHTML = "<span class='hp-price-card' width='20px' height='20px' style='background-color: " + color + "'></span>" + price;
        hpLegend.appendChild(div);
    });
    hpLegend.className = "visible";
}

function hideLegend(){
    document.getElementById('legend').className="invisible";
    document.getElementById('hpLegend').className="invisible";
}

// Show the selected data overlays
function showOverlays() {
    clearOverlays();
    var mode = $('input[name="mode"]:checked').val();
    if(mode == "transit"){
        transitLayer.setMap(map);
    }
    else if(mode == "bike"){
        bikeLayer.setMap(map);
    }
    else if(mode == "housing"){
        housingLayer.setMap(map);
        renderHpLegend();
    }
}

$(document).ready(function() {
    initGMap();
    showOverlays();
});
