function qs(selector) { return document.querySelector(selector);}

function qsa(selector) {return document.querySelectorAll(selector);}

$(document).ready(function(){
	gerUrlHash();
	$(window).bind('hashchange', function(e) {
        e.preventDefault();
        gerUrlHash();
    });
});

function initPage(){
	UTILS.ajax("data/config.json", {done: updatePageData});
	formRequiredInputs('.SettingsForm');
    $('.SettingsForm').submit(saveForm);
    for(var i = 0; i < 2; i++){
        $('.report-names-ddl').eq(i).change(selectOptionChange);
    }
    localStorageForPageRefresh();
}

window.onLoad = initPage();
function updateNote(notification){
	var notificationsDiv = document.querySelector('.notifications');
	if (!notification) {
		notificationsDiv.textContent = '';
		notificationsDiv.classList.add('hidden');
	}
	else {
		notificationsDiv.textContent = notification;
		notificationsDiv.classList.remove('hidden');
	}
}
function updateQuickAction(quickActions){
	if(quickActions !== undefined){

		var navSectionsContent = qsa(".nav-section");
		var menucaptionContent = qsa(".menu-caption");
		var actionLists = qsa(".action-list");
		for(var i=0; i < quickActions.length; i++){
		   
		    menucaptionContent[i].innerHTML = "<p>" + quickActions[i].actionsLabel + "</p>" + menucaptionContent[i].innerHTML;		

		    for(var j=0; j < quickActions[i].actions.length; j++){
				actionLists[i].innerHTML += "<li><a href=\"" + quickActions[i].actions[j].url + "\">" + quickActions[i].actions[j].label + "</a></li>"
    		}
			navSectionsContent[i].innerHTML = "<p>" + quickActions[i].label + "</p>" + navSectionsContent[i].innerHTML;
			navSectionsContent[i].style.background = "url(./img/"+ quickActions[i].icon +".png) left 50% top 75px no-repeat black";
	
		}
	}
}
function updatePageData(data){
	updateNote(data.notification);
	updateQuickAction(data.quickActions);
}


function manageTabs(tab_id){
	// remove class "active" from current tab
	$('#tabs-list li a').removeClass('active');

	// add class "active" to the selected tab
	 $('#tabs-list a[rel="'+tab_id+'"]').addClass("active");

	 // hide all tabs content
    $('.tabs .tab-content').addClass('hidden');
 
    // Show the selected tab content
    $('.tabs #' +tab_id).removeClass('hidden');
}

// manage tabs when one of them clicked
$('#tabs-list li').click(function(){
	var tab_id = $(this).children('a').attr('rel');
	//  Update the url hash
	window.location.hash = tab_id;
	manageTabs(tab_id);
	return;
});

function gerUrlHash(){
	if (window.location.hash) {
        //  Get the hash from URL
        var url = window.location.hash;
        //  Remove the #
        var currentHash = url.substring(1);
        //  activate tab
        manageTabs(currentHash);
    }
}

function getActiveTabIndex(Tabs){
	for (var i = 0; i < Tabs.length; i++) {
        if(Tabs[i].getAttribute('class') == 'active'){
            return i;
        }
    }
}

// Support tabs navigation using the keyboard
var keyboardTabNavigation = function (e){
 	var tabs = document.getElementById("tabs-list").getElementsByTagName("a");
    var activeTabIndex = getActiveTabIndex(tabs);
    switch (e.keyCode) {
        case 37:{
                if(activeTabIndex !== 0 ){
                window.location.hash = tabs[parseInt(activeTabIndex) - 1].getAttribute('rel');
                }
            break;
        }
        case 39:{
                if(activeTabIndex !== tabs.length - 1 ){
                window.location.hash = tabs[parseInt(activeTabIndex) + 1].getAttribute('rel');
                }
            break;
        }
    }
}

// hide quick report form when click on "cancel"
$('#quick-reports-cancel').click(function(){
	$('.quick-reports-form').addClass('hidden');
	$('#settingsBtn-quick-reports').addClass('transperntBG');
});

// hide my team folders form when click on "cancel"
$('#my-team-folders-cancel').click(function(){
	$('.form-my-team-form').addClass('hidden');
	$('#settingsBtn-my-team-folders').addClass('transperntBG');
});

// show quick report form when click on settings button
$('#settingsBtn-quick-reports').click(function(){
	if($('.quick-reports-form').hasClass('hidden')){
		$('.quick-reports-form').removeClass('hidden');
		$('#settingsBtn-quick-reports').removeClass('transperntBG');
	}
	else {
		$('.quick-reports-form').addClass('hidden');
		$('#settingsBtn-quick-reports').addClass('transperntBG');	
	}
	return;
});

// show  my team folders form when click on settings button
$('#settingsBtn-my-team-folders').click(function(){
	if($('.form-my-team-form').hasClass('hidden')){
		$('.form-my-team-form').removeClass('hidden');
		$('#settingsBtn-my-team-folders').removeClass('transperntBG');
	}
	else {
		$('.form-my-team-form').addClass('hidden');
		$('#settingsBtn-my-team-folders').addClass('transperntBG');	
	}
	return;
});

function addSelectToDDL($selectElement ,name,url){
	var $option = $( '<option></option>' );
        $option.attr( 'value',url );
        $option.text(name);
        $selectElement.append($option);
}

// show and update the iframe according to the selected site
function updateIframe(val,id){
    $('.iframe-'+id).attr( 'src' , val );
    $('#expand-'+id).attr( 'href', val );
    $( '#iframe-' + id).removeClass('hidden');
    $( '#iframe-' + id).addClass('adjust-to-iframe');
}

function showDDLAndIframe(id){
    $('#report-names-' + id + ', .content-' + id + ', #expand-' + id).removeClass('hidden');
}

function hideDDLAndIframe(id){
    $('#report-names-' + id + ', .content-' + id + ', #expand-' + id).addClass('hidden');
}

function formRequiredInputs(form){
	var $form = $(form),
    $inputsName = $form.find('input[type="text"]'),
    $inputsUrl = $form.find('input[type="url"]');

    for (var i = 0; i < $inputsName.length; i++) {

	    $inputsUrl.eq(i).bind('input', { inputsName: $inputsName, i: i } ,function(e) {
	        if( $(this).val() !== '') 
	            e.data.inputsName.eq(e.data.i).prop('required',true);
	        else
	            e.data.inputsName.eq(e.data.i).prop('required',false);
	    });

	    $inputsName.eq(i).bind('input', { inputsUrl: $inputsUrl, i: i } ,function(e) { 
	        if( $(this).val() !== '')
	            e.data.inputsUrl.eq(e.data.i).prop('required',true);
	        else
	            e.data.inputsUrl.eq(e.data.i).prop('required',false);
	    });
	}
}
var selectOptionChange = function(e){
    e.preventDefault();
    var target = e.target;
    var optionValue = target.options[target.selectedIndex].value;
    var id = $('#'+target.id).parent().children(':nth-child(3)').find("form").attr('id');
    updateIframe(optionValue,id);    
}

function saveToLocalStorage(){
	if (Modernizr.localstorage) {
	    var arr = [];
	    $('.SettingsForm').each( function(index, element){
	        
	        $inputsName = $(this).find('input[type="text"]'),
	        $inputsUrl = $(this).find('input[type="url"]');
	        var formId = $(this).attr('id');
	        for (var i = 0; i < $inputsName.length; i++) {

		        url = $inputsUrl.eq(i).val();
		        name = $inputsName.eq(i).val();
		        nameElemId = $inputsName.eq(i).attr('id');
		        urlElemId = $inputsUrl.eq(i).attr('id');

		        arr.push({
		            formId: formId,
		            name: name,
		            url: url,
		            nameElemId: nameElemId,
		            urlElemId : urlElemId
		        });
	        }
	    });

	    localStorage.setItem('storage', JSON.stringify(arr));
	}
	else{
	    console.log("local storage is not supported by the browser")
	}
}

function localStorageForPageRefresh(){
    if (Modernizr.localstorage) {
        var storageData = JSON.parse(localStorage.getItem('storage'));

        if(storageData !== null){
            for(var i=0; i<storageData.length; i++){
                $('#'+storageData[i].nameElemId).val(storageData[i].name);
                $('#'+storageData[i].urlElemId).val(storageData[i].url);
            }
        }
    }
    else{
        console.log("local storage is not supported by the browser")
    }
}

var saveForm = function(e){
	e.preventDefault();
	var $form = $(e.target),
            $reportNameDdl = $( '#report-names-' + $form.attr('id') ).eq(0),
            $inputsName = $form.find('input[type="text"]'),
            $inputsUrl = $form.find('input[type="url"]');

            var nameVal , urlVal, emptyCounter = 0;
            
            //reset ddl
            $reportNameDdl.find('option').remove();

            for (var i = 0; i < $inputsName.length; i++) {
	            url = $inputsUrl.eq(i).val();
	            name = $inputsName.eq(i).val();

	            // check if not empty and add to reportNameDdl
	            if(name !== '' && url !== '' ){
	                addSelectToDDL($reportNameDdl,name,url);
	            }
	            else{
	                emptyCounter++;
	            }

            }// end for
            // show ddl - iframe - expand in case emptyCounter is not zero
            if(emptyCounter != 3){

                $reportNameDdl.focus();
                updateIframe($reportNameDdl.children(0).attr('value'), $form.attr('id'));
                $('#settingsBtn-'+ $form.attr('id')).click();
                showDDLAndIframe($form.attr('id'));
                // hide the form
	            $( '#form-' + $form.attr('id')).addClass('hidden');
	            $('#settingsBtn-'+ $form.attr('id')).addClass('transperntBG');
            }
            else{
                $reportNameDdl.find('option').remove();
                hideDDLAndIframe($form.attr('id'));
            }

            saveToLocalStorage();
            return true;
}

// submit form
$('.SettingsForm').submit(saveForm);

document.onkeydown = keyboardTabNavigation;

// esc inside any input in the form should act like cancel
$("form").keyup(function(e) {
    var id = $(this).attr('id');
     if (e.keyCode == 27) { // escape key maps to keycode `27`
    	$('#form-'+ id).addClass('hidden');
		$('#settingsBtn-'+id).addClass('transperntBG');
    }
});

// searching a report
$(".search-box").keyup(function(e){
	if(e.keyCode == 13){
		var currentTab = $('#tabs-list li .active').attr("rel");
		if(currentTab == "quickReports"){
    		var id = "quick-reports";
		}
		else if(currentTab == "myTeamFolders"){
			var id = "my-team-folders";
		}
		var reportsNames = $("form").find('input[type="text"]');
		var reportsUrl = $("form").find('input[type="url"]');
		for(var i=0; i < reportsNames.length; i++){
			if(reportsNames[i].value.indexOf(this.value) > -1){
				updateIframe(reportsUrl[i].value, id);
				i=reportsNames.length +1;
				// hide the form
			 	$( '#form-' + id).addClass('hidden');
	            $('#settingsBtn-'+ id).addClass('transperntBG');
			}
		}
		if (i ==reportsNames.length) {
            $(".notifications").html("The searched report " + this.value +" was not found.");
        }
	}
});



