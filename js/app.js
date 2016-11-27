App = function() {
    this.track_hash = {};
    this.track_list = [];
    this.marker_hash = {};
    this.marker_list = [];

    this.storage = new Storage(this);
    if (!this.storage.available()) {
        alert("Your browser doesn't support 'localStorage' :(");
        return;
    }

    this.style = new Style(this);
    this.map = new Map(this);
    this.sidebar = new Sidebar(this);
    this.initEventHandlers();

    this.restore();
};

App.prototype = {
    initEventHandlers : function() {
        var self = this;
        $("#buttonImportGPX").click(function (e) { $("#buttonImportGPXinput").click(); e.preventDefault(); });
        $("#buttonAddMarker").click(function() { self.addMarker(); });
    },

    restore : function() {
        this.sidebar.restore();
        this.map.restore();

        var markers = this.storage.read('markers', []);
        for (var i = 0, len = markers.length; i < len; i++) {
            var id = markers[i];
            var json = this.storage.read('marker.' + id, null);
            if (json) {
                this.marker_hash[id] = new Marker(this, id, new L.LatLng(json.lat, json.lng), json.name || 'my marker', json.color || this.style.default_color);
                this.marker_list.push(id);
            }
        }

        var tracks = this.storage.read('tracks', []);
        for (var i = 0, len = tracks.length; i < len; i++) {
            var id = tracks[i];
            var json = this.storage.read('track.' + id, null);
            if (json) {
                var latlngs = Utils.coords2latlngs(json.coords, json.flat ? 0 : 1);
                this.track_hash[id] = new Track(this, id, latlngs, json.name || 'my track', json.color || this.style.default_color);
                this.track_list.push(id);
            }
        }

        this.storage.enableWrite();
    },

    addMarker : function() {
        var id = Utils.guid();
        this.marker_hash[id] = new Marker(this, id, this.map.map.getCenter(), 'my marker', this.style.default_color);
        this.marker_list.push(id);
        this.storage.write('markers', this.marker_list);
    },

    addTrack : function(name, latlngs) {
        var id = Utils.guid();
        var track = new Track(this, id, latlngs, name, this.style.default_color);
        this.track_hash[id] = track;
        this.track_list.push(id);
        this.storage.write('tracks', this.track_list);

        track.view();
    },

    importGpxFiles : function(files) {
        if (files && files.length > 0) {
            new GpxImporter(this).importGpxFile(files[0]);
        }

        // reset file input
        $('#buttonImportGPXinput').wrap('<form>').closest('form').get(0).reset();
        $('#buttonImportGPXinput').unwrap();
    }
};
