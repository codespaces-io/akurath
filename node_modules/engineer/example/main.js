var engineer = require("../engineer");

var app = new engineer.Application({
    'paths': __dirname
})

app.load([
    './test1',
    {
        packagePath: "./test2", port: 8080
    }
]).then(function() {
    console.log("test chargement of test3:");
    return app.load([
        './test3'
    ]);
}).fail(function(err) {
    console.log("Error with example",err);
});

