Sidebar = function(app) {
    this.app = app;

    var self = this;
    $('#sidebar-toggle > a').click(function() { self.flip(); });
};

Sidebar.prototype = {
    store: function() {
        this.app.storage.write('sidebar.open', $('#sidebar').is(":visible"));
    },

    restore: function() {
        this.toggle(this.app.storage.read('sidebar.open', true));
    },

    toggle: function(open) {
        var sidebar = $('#sidebar');

        if (open != sidebar.is(":visible")) {
            if (open) {
                sidebar.show();
                $('#map').css({'right': '400px'});
                $('#sidebar-toggle').css({'right': '398px'});
                $('#sidebar-toggle > a').html("&#9205;");
            } else {
                sidebar.hide();
                $('#map').css({'right': '0'});
                $('#sidebar-toggle').css({'right': '0'});
                $('#sidebar-toggle > a').html("&#9204;");
            }
            this.app.map.map.invalidateSize();
            this.store();
            return true;
        }
        return false;
    },

    flip: function() {
        this.toggle(true) || this.toggle(false);
    }
};
