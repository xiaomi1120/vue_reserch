define(['jquery'], function ($) {
    return function (require, exports, module) {
        console.log('admin');
       var foo=require('./staff');
        return function (){
            console.log('foo')
        }
    }
});

define(function (require) {
    var foo = require('./index');
    //Define this module as exporting a function
    return function () {
        console.log('foo')
    };
});
define(['jquery'], function() {
    return function () {
        console.log('foo')
    };
} );