extend = function (target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}
var tests = ['login', 'events'];
module.exports ={
    'Prepare Browser Window' : function (browser) {
        browser
            .resizeWindow(375, 700)
            .pause(100)
            .resizeWindow(375, 700)
            .pause(100)
            .setWindowPosition(700, 200)
            .pause(100);
    }
}
tests.forEach(element => 
{
    require("./tests/"+element+"_page.js");
    module.exports = extend(module.exports, test);
});


