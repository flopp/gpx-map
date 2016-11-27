Map = function(app) {
    this.app = app;

    this.stamen_terrain_tiles = L.tileLayer('http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png', {
        attribution: [
            'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ',
            'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ',
            'Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, ',
            'under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
        ].join(""),
        maxZoom: 18
    });
    this.stamen_toner_tiles = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {
        attribution: [
            'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ',
            'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ',
            'Data by <a href="http://openstreetmap.org/">OpenStreetMap</a>, ',
            'under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
        ].join(""),
        maxZoom: 18
    });
    var baseMaps = {
        "Stamen/Terrain": this.stamen_terrain_tiles,
        "Stamen/Toner": this.stamen_toner_tiles
    };
    this.map = L.map('map', {layers: [this.stamen_terrain_tiles]});
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
