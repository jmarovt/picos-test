$(function(){

	var MAX_CHAR = 60;

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
   	
	   	var validation = imageValid($(this));

       	if (validation[0] == true){
       		$('#validation-image').text("");
	       	$(this).removeClass("invalid").addClass("valid");
       	}
       	else{
       		$('#validation-image').text(validation[1]);
       		$(this).removeClass("valid").addClass("invalid");
       	}

	});

	$('#submit').on('click', function(e){

    	var error_free = false;

    	if ( $('#search').hasClass("valid") ){
    		if( $('#title').val().length <= MAX_CHAR ){
    			if ( imageValid($('#image'))[0] ){
    				error_free = true;
    			}
    		}
    	}
    	
    	if (error_free == false){
    	    e.preventDefault();	
    	};

	});

	function imageValid(image) {

		var input = image;
	    var value = input.val();

		if ( value.indexOf(".png") > -1 || value.indexOf(".jpg") > -1 || value.indexOf(".jpeg") > -1 ){

       		//check file size
       		if (input[0].files[0].size > 2000000){
       			
       			return ([false, "Your image is too big. Images should be less than 2M."]);
	       	}
	       	else {

	       		return ([true,""]);
	       	}

       	}
       	else{

       		return ([false, "Please only upload images in .png and .jpg formats."]);
       	};


	}
   	
	function updateCountdown() {

		var input = $('#title');

	    // 60 is the max message length
	    var remaining = MAX_CHAR - input.val().length;
	    $('#countdown').text(remaining + ' characters remaining.');


	    if (remaining >= 0){
	    	input.removeClass("invalid").addClass("valid");
	    } 
	    else {
	    	input.removeClass("valid").addClass("invalid");
	    }

	};


});