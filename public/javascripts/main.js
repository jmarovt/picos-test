$(function(){

	updateCountdown();
	$('#title').change(updateCountdown);
	$('#title').keyup(updateCountdown);

	$('#search').on('input', function(e){
   	
	   	var input = $(this);
	    var parameters = { search: $(this).val() };
	    
	       $.get( '/searching',parameters, function(data) {
       	
	       	if (data == "true"){
	       		input.removeClass("invalid").addClass("valid");
	       	}
	       	else{
	       		input.removeClass("valid").addClass("invalid");
	       	}

	     });
   
	});

	$('#image').on('change', function(e){
   	
	   	var input = $(this);
	    var value = input.val();
	    console.log(value);

	    if ( value.indexOf(".png") > -1 || value.indexOf(".jpg") > -1 ){
       		input.removeClass("invalid").addClass("valid");
       	}
       	else{
       		input.removeClass("valid").addClass("invalid");
       	};

	});

	$('#submit').on('click', function(e){

    	var error_free = false;

    	if ( $('#search').hasClass("valid") ){
    		if( $('#title').val().length <= 60 ){
    			if ( $('#file').val().indexOf(".png") > -1 || $('#file').val().indexOf(".jpg") > -1 ){
    				error_free = true;
    			}
    		}
    	}
    	
    	if (error_free == false){
    	    e.preventDefault();	
    	};

	});
   	
	function updateCountdown() {

		var input = $('#title');

	    // 60 is the max message length
	    var remaining = 60 - input.val().length;
	    $('#countdown').text(remaining + ' characters remaining.');


	    if (remaining >= 0){
	    	input.removeClass("invalid").addClass("valid");
	    } 
	    else {
	    	input.removeClass("valid").addClass("invalid");
	    }

	};


});