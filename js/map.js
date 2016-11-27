Map = function(app) {
    this.app = app;

    this.osm_tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: [
        '© ',
        '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
        ' ♥ ',
        '<a href="https://donate.openstreetmap.org" target="_blank">Donate!</a>'].join(''),
        maxZoom: 18
    });
    this.carto_light_tiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        attribution: [
        '© ',
        '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors,',
        ' © ',
        '<a href="https://carto.com/attributions" target="_blank">CARTO</a>'].join(""),
        maxZoom: 18
    });
    this.carto_dark_tiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
        attribution: [
        '© ',
        '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors,',
        ' © ',
        '<a href="https://carto.com/attributions" target="_blank">CARTO</a>'].join(""),
        maxZoom: 18
    });
    
    var baseMaps = {
        "OpenStreetMap": this.osm_tiles,
        "Carto Light": this.carto_light_tiles,
        "Carto Dark": this.carto_dark_tiles
    };
    this.map = L.map('map', {layers: [this.osm_tiles]});
    L.control.layers(baseMaps, null).addTo(this.map);

    L.control.locate({icon: 'fa fa-crosshairs'}).addTo(this.map);

    var self = this;
    this.map.on('moveend', function (e) { self.store(); });
};


Map.prototype = {
    store: function() {
        this.app.storage.write('map.view', {
            lat: this.map.getCenter().lat,
            lng: this.map.getCenter().lng,
            zoom: this.map.getZoom()
        });
    },

    restore: function() {
        var view = this.app.storage.read('map.view', {lat: 48, lng: 7.8, zoom: 13});
        this.map.setView(L.latLng(view.lat, view.lng), view.zoom, true);
    }
};
