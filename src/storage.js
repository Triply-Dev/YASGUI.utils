var store = require("store");
var times = {
  day: function() {
    return 1000 * 3600 * 24; //millis to day
  },
  month: function() {
    times.day() * 30;
  },
  year: function() {
    times.month() * 12;
  }
};

var root = (module.exports = {
  set: function(key, val, exp) {
    if (!store.enabled) return; //this is probably in private mode. Don't run, as we might get Js errors
    console.log(store);
    if (key && val !== undefined) {
      if (typeof exp == "string") {
        exp = times[exp]();
      }
      //try to store string for dom objects (e.g. XML result). Otherwise, we might get a circular reference error when stringifying this
      if (val.documentElement) val = new XMLSerializer().serializeToString(val.documentElement);
      store.set(key, {
        val: val,
        exp: exp,
        time: new Date().getTime()
      });
    }
  },
  remove: function(key) {
    if (!store.enabled) return; //this is probably in private mode. Don't run, as we might get Js errors
    if (key) store.remove(key);
  },
  removeAll: function(filter) {
    if (!store.enabled) return; //this is probably in private mode. Don't run, as we might get Js errors
    if (!filter) {
      store.clearAll();
    } else if (typeof filter === "function") {
      for (var key in store.getAll()) {
        if (filter(key, root.get(key))) root.remove(key);
      }
    }
  },
  get: function(key) {
    if (!store.enabled) return null; //this is probably in private mode. Don't run, as we might get Js errors
    if (key) {
      var info = store.get(key);
      if (!info) {
        return null;
      }
      if (info.exp && new Date().getTime() - info.time > info.exp) {
        return null;
      }
      return info.val;
    } else {
      return null;
    }
  }
});
