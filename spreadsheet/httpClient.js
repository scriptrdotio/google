var http = require("http");
var config = require ("./oauth2/config.js");
var tokenMgr = require("./oauth2/TokenManager.js");

/*
	A generic http client that handles the communication with remote APIs
	All subsequent operations made using the current instance are done on behalf of the user
*/ 
	var accessToken = tokenMgr.getPersistedTokens().accessToken;
/*
	Invoke a given API. If response status is 401, the method will try to obtain a new access token using the refresh token 
	and retry the invocation of the target API.
*/


this.callApi = function(params) {
	var paramsClone = JSON.parse(JSON.stringify(params));
  	try {
		return this._callApi(params);
    }
  	catch(response) {
		if (response.status === "401") {
          	this._refreshToken();
          	try {
              return this._callApi(paramsClone);
            }
          	catch(response) {
				this._handleError(response);
            }
        }
      	
      	else {
        	this._handleError(response);
        }
    }
};

this._callApi = function (params) {
	params["headers"] = params["headers"] ? params["headers"] : {};
  	params["headers"]["Authorization"] = "Bearer " + tokenMgr.getPersistedTokens().accessToken;
  	var response = http.request(params);
  	if (response.status >= "200" && response.status < "300") {
      	if (response.body && response.status != null) {
			var responseBody = JSON.parse(response.body);
          	if (responseBody.message) {
            	throw response;
            }
          	else {
            	return responseBody;
            }
        }
        else {
        	return response;
        }
    }
    else {
		throw response;
    }
};


this._handleError = function (response) {
	var errorObj = "";
  	try {
    	errorObj = JSON.parse(response.body);
    }
  	catch(e) {
    	try {
        	errorObj = JSON.parse(response);
        }
      	catch(e) {
        	errorObj = response;
        }
    };
  
  	throw {
    	"errorCode" : "Invocation_Error",
      	"errorDetail" : errorObj
    };
};

this._refreshToken = function () {
	console.log("Refreshing token");
  	tokenMgr.refreshAccessToken();
  	//this.accessToken = tokenMgr.getPersistedTokens().accessToken;
};
  
this._paramsToString = function(params) {
	var newParams = {};
  	for (var p in params) {
    	if (typeof(params[p]) != "object") {
        	newParams[p] = "" + params[p];
        }
      
      	else {
        	newParams[p] = JSON.stringify(params[p]);
        }
    }
  
  	return newParams;
};