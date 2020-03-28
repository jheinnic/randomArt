(function() {
  var callbacks = {};
  module.exports = {
    ocaml_register: function ocaml_register(name, f) {
      callbacks[name] = f;
    },
  
    ocaml_get: function ocaml_get(name) {
      return callbacks[name];
    }
  }
}());
