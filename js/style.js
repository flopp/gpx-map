Style = function(app) {
    this.colors = [
        'blue', 'red', 'green', 'orange', 'yellow', 'violet', 'grey', 'black'
    ];
    this.default_color = this.colors[0];

    this.hex = {
        'blue': '#2981ca',
        'red': '#ca273b',
        'green': '#24ab21',
        'orange': '#cb8429',
        'yellow': '#cbc52a',
        'violet': '#9a28ca',
        'grey': '#7b7b7b',
        'black': '#3c3c3c'
    };

    this.icon = {};
    for (var i = 0, len = this.colors.length, color; i < len; i++) {
        color = this.colors[i];
        this.icon[color] =  new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-' + color + '.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.2/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }
};

Style.prototype = {
    normalize_color: function(color) {
        if (!color) {
            return this.default_color;
        }
        color = color.toLowerCase();

        for (var i = 0, len = this.colors.length; i < len; i++) {
            if (this.colors[i].toLowerCase() == color) {
                return this.colors[i];
            }
        }

        return this.default_color;
    }
};
