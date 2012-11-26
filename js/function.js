// JavaScript Document

$(document).ready(function() {
	
	$("article").toggle(function(){$(this).children(".extra").css("height","auto");}, function(){$(this).children(".extra").css("height","0");})
	$("article").toggle(function(){$(this).children(".extra").css("border-top","1px solid #CCC");}, function(){$(this).children(".extra").css("border","none");})

	$(".expand").toggle(function(){$(this).css("background-image","url(images/minus-btn.png)");}, function(){$(this).css("background-image","url(images/plus-btn.png)");})
	
	$('.icon').mouseenter(function() {
  		$(this).children('.progress').css('height','140px');
		});
		
		$('.icon').mouseleave(function() {
  		$(this).children('.progress').css('height','10px');
	});		
});	
	

		
	