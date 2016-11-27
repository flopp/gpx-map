Storage = function(app) {
    this.app = app;
    this.storage = null;
    this.writeEnable = false;

    if (window.localStorage) {
        this.storage = window.localStorage;
    }
};

Storage.prototype = {
    available: function() {
        return !!this.storage;
    },

    enableWrite: function() {
        this.writeEnable = true;
    },

    write: function(key, value) {
        if (this.writeEnable) {
            this.storage[key] = JSON.stringify(value);
        }
    },

    read: function(key, default_value) {
        try {
            var value = JSON.parse(this.storage[key] || '');
            return value;
        } catch (err) {
            return default_value;
        }
    },

    remove: function(key) {
        if (this.writeEnable) {
            try {
                this.storage.removeItem(key);
            } catch (err) {}
        }
    }
};
