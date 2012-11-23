// JavaScript Document

$(document).ready(function() {
	
	$(".expand").toggle(function(){$(this).parent(".lab article").css("height","auto");}, function(){$(this).parent(".lab article").css("height","20.5em");})
	$(".expand").toggle(function(){$(this).css("background-image","url(images/minus-btn.png)");}, function(){$(this).css("background-image","url(images/plus-btn.png)");})
	
	$('.avatar').mouseenter(function() {
  		$(this).children('.avatar a').css('display','block');
		$(this).children('.avatar img').css('opacity','0.5');	
		});
		
		$('.avatar').mouseleave(function() {
  		$('.avatar a').css('display','none');
		$('.avatar img').css('opacity','1');	
	});		
});	
	

		
	