/* This module is in charge of obtaining an OAuth 2.0 access token, either from
a provided code or from a provided refresh token, for a given user.
The module stores the access and refresh token in the global storage
storage.global.[app]_accessToken
storage.global.[app]_refreshToken */

var config = require("./config.js")
var util = require("./util.js");
var http = require("http");

//return storage.global [config.app+"_accessToken"];
var getPersistedTokens = function() {
  	var accessToken = storage.global[config.app + "_accessToken"];
  	var refreshToken = storage.global[config.app + "_refreshToken"];
  	
  	if (!accessToken) {
      	throw {
          	"errorCode" : "Missing_Access_Token",
          	"errorDetail" : "Could not find an access token or a refresh token for this user "
        };
    }
  
  	return {
      	"accessToken" : accessToken,
      	"refreshToken" : refreshToken
    };
};

var saveTokens = function (dto) {
  	//clean up the state
  	storage.global[config.app + "_state_" + dto.state] = null;
  
  	//save the new token
  	storage.global[config.app + "_accessToken"] = dto.access_token;
  
  	if (dto.refresh_token) {
    storage.global[config.app + "_refreshToken"] = dto.refresh_token;
	}

  	return {
      	"access_token" : dto.access_token,
      	"refresh_token" : dto.refresh_token
    };
};

var getAccessToken = function (params) {
  	if (!params) {
      	throw {
          	"errorCode" : "Invalid_Parameter",
          	"errorDetail" : "getAccessToken - params cannot be null of empty"
        };
    }
  
  	var sendParams = {};
  	if (params.state) { //usually not
      	sendParams["state"] = params.state;
    }
  
  	if (params.code) {
      	sendParams["code"] = params.code;
    }
  
  	sendParams["redirect_uri"] = config.redirect_uri;
  
  	sendParams["grant_type"] = "authorization_code";
  
  	sendParams["access_type"] = config.access_type;

  	if (config.grantType) {
      	sendParams["grant_type"] = config.grantType;
    }
  
  	return this._getToken(sendParams);
}

var refreshAccessToken = function() {
	console.log("Refreshing token...");
  	var refreshToken = getPersistedTokens().refreshToken;
  	var refreshParams = {
      	"grant_type" : "refresh_token",
      	"refresh_token" : refreshToken
    };
  
  	return this._getToken(refreshParams);
};


var _getToken = function (params) {
  	var state = params.state;
  	params.client_id = config.client_id;
  	params.client_secret = config.client_secret;
  
  	var requestObject = {
      	"url" : config.accessTokenUrl,
      	"method" : "POST",
      	"params" : params,
      	"headers" : {
          	"Authorization" : "Basic " + util.Base64.encode(config.client_id + ":" + config.client_secret),
          	"Content-Type" : "application/x-www-form-urlencoded"
        }
    }
    
    var response = http.request(requestObject);
  	var responseBodyStr = response.body;
  	var responseObj = null;
  
  	if (response.status === "200") {
      	if (response.headers["Content-Type"].indexOf("application/json") > -1) {
        	responseObj = JSON.parse(responseBodyStr);
        
        	var dto = {
              	state:state,
              	access_token : responseObj[config.accessTokenFieldName],
              	refresh_token : responseObj[config.refreshTokenFieldName]
            };
        
        	saveTokens(dto);
        	return responseObj;
      }
      
		else {
			throw {
              	"errorCode" : "Unexpected_Response",
              	"errorDetail" : responseBodyStr
            }
      	}
    }
  
  	else {
      var errorObj = "";
    try {
      
      errorObj = JSON.parse(response.body);
      errorObj = errorObj.error;
    }catch(e) {
      
      try {
        errorObj = JSON.parse(response);
      }catch(e) {
         
        throw {
      
          "errorCode": "Authorization_Failed",
          "errorDetail": response
        };
      }
    };
    
    throw {
      "errorCode": "Authorization_Failed",
      "errorDetail": errorObj
    };
    }
};