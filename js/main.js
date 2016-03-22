function qs(selector) { return document.querySelector(selector);}

function qsa(selector) {return document.querySelectorAll(selector);}

function updateNote(notification){
	if(notification !== undefined){$('.notifications').html(notification);}
}
function updateQuickAction(quickActions){
	if(quickActions !== undefined){

		var navSectionsContent = qsa(".nav-section");
		for(var i=0; i < quickActions.length; i++){
			navSectionsContent[i].innerHTML = "<p>" + quickActions[i].label + "</p>" + navSectionsContent[i].innerHTML;
			navSectionsContent[i].style.background = "url(./img/"+ quickActions[i].icon +".png) left 50% top 75px no-repeat black";
		}
		var menuHintContent = qsa(".menu-hint");
		for(var i=0; i < quickActions.length; i++){
			menuHintContent[i].innerHTML = "<p>" + quickActions[i].actionsLabel + "</p>" + menuHintContent[i].innerHTML;
		}
		var actionLists = qsa(".action-list");
		for(var i=0; i < quickActions.length; i++){
			for(var j=0; j < quickActions[i].actions.length; j++){
				actionLists[i].innerHTML += "<li><a href=\"" + quickActions[i].actions[j].url + "\">" + quickActions[i].actions[j].label + "</a></li>"
    		}
		}
	}
}
function updatePageData(data){
	updateNote(data.notification);
	updateQuickAction(data.quickActions);
}