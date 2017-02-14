function setup(plugin, imports, register) {
    console.log("init test1, test 2 is ", imports.test2);
    register(null, {
        "test1": {
            value: 1
        }
    });
}

// Exports
module.exports = setup;
