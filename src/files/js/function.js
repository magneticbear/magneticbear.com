// JavaScript Document

$(document).ready(function() {
	$(".menu").toggle(function(){$("html").css("margin-left","8em");}, function(){$("html").css("margin-left","0");})	
	$(".menu").toggle(function(){$(".menu").css("background","#999 url(images/menu-icon-back.png) no-repeat center center");}, function(){$(".menu").css("background","#999 url(images/menu-icon.png) no-repeat center center");})	
	$(".menu").click(function() {$('.menu').css('background-size','60%')});
	
	$('.icon').mouseenter(function() {
  		$(this).children('.progress').css('height','140px');
	});
		
	$('.icon').mouseleave(function() {
  		$(this).children('.progress').css('height','10px');
	});	
	
	setTimeout(function (){	
	$(".home li:nth-child(1)").css('right','4%')}, 1600);
	setTimeout(function (){	
	$(".home li:nth-child(2)").css('right','4%')}, 1600);
	setTimeout(function (){	
	$(".home li:nth-child(3)").css('right','14.5%')}, 1600);
	setTimeout(function (){	
	$(".home li:nth-child(4)").css('right','30.5%')}, 1600);
	setTimeout(function (){	
	$(".home li:nth-child(5)").css('right','47%')}, 1600);
	setTimeout(function (){	
	$(".home li:nth-child(6)").css('right','63%')}, 1600);


	$(".home li").css('opacity','0');
	$(".home li:first-child").css('opacity','1');
	$(".home li:last-child").css('opacity','1');

	setTimeout(function (){	
	$(".home li").css('opacity','1')}, 1600);
});