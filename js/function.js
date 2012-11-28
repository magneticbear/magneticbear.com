// JavaScript Document

$(document).ready(function() {
	
	$(".expand").toggle(function(){$(this).parent(".lab article").css("height","auto");}, function(){$(this).parent(".lab article").css("height","20.5em");})
	
	$("article").toggle(function(){$(this).children(".extra").css("height","auto");}, function(){$(this).children(".extra").css("height","0");})
	$("article").toggle(function(){$(this).children(".extra").css("border-top","1px solid #CCC");}, function(){$(this).children(".extra").css("border","none");})

	$(".expand").toggle(function(){$(this).css("background-image","url(images/minus-btn.png)");}, function(){$(this).css("background-image","url(images/plus-btn.png)");})
	
	
	$(".menu").toggle(function(){$("html").css("margin-left","8em");}, function(){$("html").css("margin-left","0");})	
	$(".menu").toggle(function(){$(".menu").css("background","#999 url(images/menu-icon-back.png) no-repeat center center");}, function(){$(".menu").css("background","#999 url(images/menu-icon.png) no-repeat center center");})	
	$(".menu").click(function() {$('.menu').css('background-size','60%')});
	
	$('.avatar').mouseenter(function() {
		$(this).children('.avatar a').css('display','block');
		$(this).children('.avatar img').css('opacity','0.5');
	});
	
	$('.avatar').mouseleave(function() {
		$('.avatar a').css('display','none');
		$('.avatar img').css('opacity','1');	
	});
	
	$('.icon').mouseenter(function() {
  		$(this).children('.progress').css('height','140px');
	});
		
		$('.icon').mouseleave(function() {
  		$(this).children('.progress').css('height','10px');
	});	
	
	setTimeout(function (){	
	$(".home li:nth-child(1)").css('right','-3%')}, 1600);
	setTimeout(function (){	
	$(".home li:nth-child(2)").css('right','-3%')}, 1600);
	setTimeout(function (){	
	$(".home li:nth-child(3)").css('right','10.5%')}, 1600);
	setTimeout(function (){	
	$(".home li:nth-child(4)").css('right','27.5%')}, 1600);
	setTimeout(function (){	
	$(".home li:nth-child(5)").css('right','44%')}, 1600);
	setTimeout(function (){	
	$(".home li:nth-child(6)").css('right','60%')}, 1600);		
});	
	

		
	