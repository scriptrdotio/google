//The name of the app you need to connect to
var app = "scriptrio";

//OAuth 2.0: Authorization URI - step1 of OAuth process
var authorizationUrl = "https://accounts.google.com/o/oauth2/v2/auth"; 

//OAuth 2.0: Authorization URI - step2 of OAuth process (if response_type is "code" usually)
var accessTokenUrl = "https://www.googleapis.com/oauth2/v4/token";

//OAuth 2.0 Client ID
var client_id = "613261398697-0kelp222jh3tmfbjti2302qkbp00ip9d.apps.googleusercontent.com"; //sample

//OAuth 2.0 Client Secret
var client_secret = "4aKiWKfrfC60HfJrtJb-F1p2"; // sample

//OAuth 2.0 grant type, can be left empty
var grantType = "authorization_code";

//The OAuth 2.0 type of the returned credential (can be 'code' or 'token')
var response_type = "code";

//Possible values for 'scope', i.e. authorizations requested from users. can be empty
var scope = "https://www.googleapis.com/auth/spreadsheets";

//Where the 3rd party app should send the user after the user grants or denies consent.
var redirect_uri = "https://iotmansion.scriptrapps.io/SpreadSheet/oauth2/getAccessToken.js";

//optional
var access_type = "offline";

//the name of the field used by the oauth api to return the access token
var accessTokenFieldName = "access_token";

//the name of the field used by the OAuth API to return the refresh token, if any
var refreshTokenFieldName = "refresh_token";

//generate a random state to be used in the oauth 2 process' steps
var state = (function () {
	return ('xxxxxx'.replace(/[xy]/g, function(c) {
    	var r = Math.random()*16|0, v = c =='x' ? r : (r&0x3|0x8);
      	return v.toString(16);
    }));
})();

var getAuthUrl = function () {
  	return {
  		"url": authorizationUrl,
		"state" : state
    }
}
