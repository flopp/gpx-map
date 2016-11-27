Utils = {
    guid: function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },

    coord2latlng: function (coords) {
	    return new L.LatLng(coords[1], coords[0]);
    },

    coords2latlngs: function (coords, levelsDeep) {
	    var latlngs = [];
	    for (var i = 0, len = coords.length, latlng; i < len; i++) {
		    latlng = levelsDeep ?
                this.coords2latlngs(coords[i], levelsDeep - 1) :
		        this.coord2latlng(coords[i]);
		    latlngs.push(latlng);
	    }
	    return latlngs;
	},

    latlng2coord: function (latlng) {
		return [latlng.lng, latlng.lat];
    },

    latlngs2coords: function (latlngs, levelsDeep) {
	    var coords = [];
	    for (var i = 0, len = latlngs.length, coord; i < len; i++) {
		    coord = levelsDeep ?
                this.latlngs2coords(latlngs[i], levelsDeep - 1) :
		        this.latlng2coord(latlngs[i]);
		    coords.push(coord);
	    }
	    return coords;
	},
};
