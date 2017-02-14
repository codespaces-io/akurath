function setup(plugin, imports, register) {
    console.log("init test3, test2 is ", imports.test2);
    register(null, {
        "test3": {
            value: 1
        }
    });
}

// Exports
module.exports = setup;
