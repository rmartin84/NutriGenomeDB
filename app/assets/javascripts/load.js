function showSpinner() {
       document.getElementsByClassName('spinner').style.display = 'block';
       document.getElementById('loadingover').style.display = 'block';
}

function validateForm() {
	var x = document.forms["iForm"]["ids_up"].value;
	if (x == ""){
          alert("Please enter data to be analyzed");
          return false;
}
        else if (x.patternMismatch){
          alert("Please enter data in the correct format");
          return false;
}
}


$(document).ready(function(){

 $(".spinner").hide();

$(document).submit(function(){

var x = document.forms["iForm"]["ids_up"].value;
	if (x == ""){
        $(".spinner").hide();
        }
        else {
 $(".spinner").show();
}
});

$(document).ajaxStop(function(){
 $(".spinner").hide();
});
});

