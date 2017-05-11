$(document).ready(function(){

  $("#instructions").click(function(){
    $(".inst").toggle();
  });

  $("#shortcuts").click(function(){
    $(".short").toggle();
  });

  $('h1').mousemove(function(e){
     $('#startHeader').hide();
     $('.hint').hide();
     var rXP = (e.pageX - this.offsetLeft-$(this).width()/2);
     var rYP = (e.pageY - this.offsetTop-$(this).height()/2);
     $('#effectHeader').show().css('text-shadow', +rYP/14+'px '+rXP/90+'px rgba(239,126,40,.8), '+rYP/12+'px '+rXP/70+'px rgba(180,242,79,1), '+rXP/80+'px '+rYP/16+'px rgba(0,90,175,.7)');
   }).mouseout(function(){
     $('#effectHeader').hide();
     $('#startHeader').show();
   });

   var hintShow = function(){

     $('#hint-effect').show().animate({
       'margin-left': '30px'
     },800).animate({
       'margin-left': '0px'
     },800).fadeOut('slow');

   }

   window.setTimeout(hintShow, 3000);
   window.setTimeout(hintShow, 9000);
   window.setTimeout(hintShow, 27000);

});
