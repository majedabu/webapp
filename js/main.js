function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}

function updateNote(notification){
	if(notification !== undefined){
		$('.notifications').html(notification);
	}
}
