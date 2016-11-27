GpxImporter = function(app) {
    this.app = app;
};

GpxImporter.prototype = {
    importGpxFile: function(file) {
        var reader = new FileReader();
        var self = this;
        reader.onloadend = function() {
            if (reader.result) {
                var dom = (new DOMParser()).parseFromString(reader.result, 'text/xml');
                var json = toGeoJSON.gpx(dom);
                self.importGeoJson(json);
            }
        };
        reader.readAsText(file);
    },

    importGeoJson: function(json) {
        if (json.type == "FeatureCollection") {
            var self = this;
            $.each(json.features, function(index, feature) {
                self.importGeoJson(feature);
            });
        } else if (json.type == "Feature") {
            if (json.geometry.type == "LineString") {
              this.app.addTrack(
                  json.properties.name || 'my track',
                  Utils.coords2latlngs(json.geometry.coordinates, 0)
              );
          } else if (json.geometry.type == "MultiLineString") {
              this.app.addTrack(
                  json.properties.name || 'my track',
                  Utils.coords2latlngs(json.geometry.coordinates, 1)
              );
            } else {
                console.log("skipping feature with unsupported geometry type:", json);
            }
        } else {
            console.log("unknown geojson node:", json);
        }
    }
};
