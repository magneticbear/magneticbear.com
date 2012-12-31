// JavaScript Document

$(document).ready(function() {
	$(".stage").toggle(function(){$(this).siblings(".extra").css("height","auto");}, function(){$(this).siblings(".extra").css("height","0");})
	$(".stage").toggle(function(){$(this).siblings(".extra").css("border-top","1px solid #CCC");}, function(){$(this).siblings(".extra").css("border","none");})	
	
	$('.icon').mouseenter(function() {
		$(this).children('.progress').css('height','140px');
	});
		
	$('.icon').mouseleave(function() {
		$(this).children('.progress').css('height','10px');
	});
});