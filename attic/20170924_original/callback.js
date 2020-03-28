var callbacks = {};

function ocaml_register(name, f) {
    callbacks[name] = f;
}

function ocaml_get(name) {
    return callbacks[name];
}