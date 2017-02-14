function setup(plugin, imports, register) {
    console.log("init test2");
    register(null, {
        "test2": {
            value: 1
        }
    });
}

// Exports
module.exports = setup;
