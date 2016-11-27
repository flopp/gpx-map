Track = function(app, id, latlngs, name, color) {
    this.app = app;
    this.id = id;
    this.name = name;
    this.color = app.style.normalize_color(color);
    this.flat = L.Polyline._flat(latlngs);

    this.obj = L.polyline(latlngs, {color: this.app.style.hex[color]}).addTo(app.map.map);

    var it = $('<a class="collection-item waves-effect waves-light view-action" href="#!">').attr({id: id});

    var display = $('<div class="display">');
    var display_title = $('<span class="title">').append(name);
    var display_buttons = $('<div class="secondary-content">')
    var edit_button = $('<a class="waves-effect waves-teal btn-flat edit-action" href="#!">Edit</a>');
    var delete_button = $('<a class="waves-effect waves-red btn-flat delete-action" href="#!">Delete</a>');
    display_buttons.append(edit_button);
    display_buttons.append(delete_button);
    display.append(display_title).append(display_buttons);

    var edit = $('<div class="edit hidden">');
    var edit_title = $('<input type="text" class="title" placeholder="Track Title">');
    var edit_color = $('<select class="color">');
    for (var i = 0, len = this.app.style.colors.length; i < len; i++) {
        var color = this.app.style.colors[i];
        var option = $('<option>').attr({value: color}).append(color);
        edit_color.append(option);
    }
    var edit_buttons = $('<div class="secondary-content">');
    var ok_button = $('<a class="waves-effect waves-teal btn-flat ok-action" href="#!">Ok</a>');
    var cancel_button = $('<a class="waves-effect waves-red btn-flat cancel-action" href="#!">Cancel</a>');
    edit_buttons.append(ok_button);
    edit_buttons.append(cancel_button);
    edit.append(edit_title);
    edit.append(edit_color);
    edit.append(edit_buttons);

    it.append(display).append(edit);
    $('#track-list').append(it);

    this.store();

    var self = this;
    $('#' + id).click(function() { self.view(); });
    $('#' + id + ' .delete-action').click(function() { self.remove(); });
    $('#' + id + ' .edit-action').click(function() { self.show_edit(); });
    $('#' + id + ' .ok-action').click(function() { self.accept_edit(); });
    $('#' + id + ' .cancel-action').click(function() { self.cancel_edit(); });
};

Track.prototype = {
    store: function() {
        var latlngs = this.obj.getLatLngs();
        var coords = Utils.latlngs2coords(latlngs, this.flat ? 0 : 1);
        this.app.storage.write('track.' + this.id, {
            name: this.name || 'My Track',
            color: this.color || 'red',
            flat: this.flat,
            coords: coords
        });
    },

    view: function() {
        this.app.map.map.fitBounds(this.obj.getBounds(), {animate: true});
    },

    remove: function() {
        $('#' + this.id).remove();
        this.app.map.map.removeLayer(this.obj);

        for (var i = this.app.track_list.length - 1; i >= 0; i--) {
            if (this.app.track_list[i] === this.id) {
                this.app.track_list.splice(i, 1);
            }
        }
        this.app.storage.write('tracks', this.app.track_list);

        delete this.app.track_hash[this.id];
    },

    show_edit: function() {
        var title = $('#' + this.id + ' .edit .title');
        title.val(this.name);
        var color = $('#' + this.id + ' .edit .color');
        color.show();
        color.val(this.color);
        $('#' + this.id + ' .display').addClass('hidden');
        $('#' + this.id + ' .edit').removeClass('hidden');
        title.focus();
    },

    accept_edit: function() {
        this.name = $('#' + this.id + ' .edit .title').val();
        this.color = $('#' + this.id + ' .edit .color').val();
        this.obj.setStyle({color: this.app.style.hex[this.color]});
        this.store();

        $('#' + this.id + ' .display .title').text(this.name);

        $('#' + this.id + ' .display').removeClass('hidden');
        $('#' + this.id + ' .edit').addClass('hidden');
    },

    cancel_edit: function() {
        $('#' + this.id + ' .display').removeClass('hidden');
        $('#' + this.id + ' .edit').addClass('hidden');
    },
};
