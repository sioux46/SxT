// index.js

var pendingConnection = false;

$(document).ready(function() {

//******************************************************************************
	$("#login-button").on("click", function() {
		this.blur();
		pendingConnection = false;
		
        var username = $.trim($("#username").val());
        var password = $.trim($("#password").val());
		if (!password || (password.match(/^.{8,15}$/) && !password.match(/\s/))) {
			$.ajax({
				url: 'replay_Login.php',
				data: {username: username, password: password},
				complete: function(xhr, result) {
					if (result != 'success') {
						alert('Pas de reseau!');
					}
					else {
						var reponse = xhr.responseText;
						if (reponse != 'OK') {
							alert('Identifiant ou mot de passe incorrect!');
							$("#username, #password").val("");
						}
						else {
							$("#password").val("");							
							$.ajax({
								url: 'verifSuperu.php',
								complete: function(xhr, result) {
									if (result == 'success') {
										if (xhr.responseText == "OK") $("#admin-info").show(400);
										else {
											$("#admin-info").hide();
											window.location.href =  'query.php';
										}
									}
									else alert('Pas de réseau!');
								}
							});							
						}
					}
				}
			});
		}				
	});
	
//******************************************************************************
	$("#username").on("blur", function() {
		pendingConnection = true;
	});
	
//******************************************************************************
	$("#query").on("click", function() {
		if (pendingConnection) $("#username, #password").val("");
	});
	
//******************************************************************************
	$("#sup-sessions-vide").on("click", function() {
			this.blur();
			$.ajax({
			url: 'doDeleteSessionsVides.php',
			complete: function(xhr, result) {
				if (result == 'success') {
					alert('Nombre de sessions supprimées: ' + xhr.responseText);
					localStorage.reloadSessions = 'true';
				}
				else {
					alert('Pas de réseau!');
				}
			}
		});
	});
	
//******************************************************************************
	$("#sup-events-vide").on("click", function() {
		this.blur();
		$.ajax({
			url: 'doDeleteEventVide.php',
			complete: function(xhr, result) {
				if (result == 'success') {
					alert('Nombre de [Event,DocSuite,DocBlob] supprimées: ' + xhr.responseText);
					localStorage.reloadSessions = 'true';
				}
				else {
					alert('Pas de réseau!');
				}
			}
		});
	});
//******************************************************************************
	
});  // fin READY