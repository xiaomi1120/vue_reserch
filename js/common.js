define(['jquery'], function ($) {
    return function () {
        console.log("common");
        var URL=location.href;
        var urlstate=URL.substring(21);
        $('.menu-list li').each(function(){
            if($(this).children('a').attr('href')==urlstate){
                $(this).children('a').addClass("is-active")
            }
        });
    }
});