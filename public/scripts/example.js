/****************************************************
 * You can use client side scripts by placing them in 
 * the public/scripts folder. They can then be linked
 * to your EJS files and used there.
 ****************************************************/
 $(document).ready(function() {
  // executes when HTML-Document is loaded and DOM is ready
 console.log("document is ready");
   
 
   $( "a.box-shadow" ).hover(
   function() {
     $(this).addClass('shadow-lg').css('cursor', 'pointer'); 
   }, function() {
     $(this).removeClass('shadow-lg');
   }
 );
 


 
   
 // document ready  
 });