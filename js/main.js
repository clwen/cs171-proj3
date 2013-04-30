function scrolling() {
    $('ul.nav a').bind('click',function(event){
    var anchor = $(this);

    $('html, body').stop().animate({
        scrollTop: $(anchor.attr('href')).offset().top
    }, 1000);
    
    event.preventDefault();
    });
}

$(document).ready( function() {
    scrolling();
    renderBarchart("count");
});
