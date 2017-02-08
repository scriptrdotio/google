var config = require("./config.js");

var getUrl = function () {
	var urlConfig = config.getAuthUrl();
  	var state = urlConfig.state;
  	var redirectUrl = config.redirect_uri ? config.redirect_uri : "";
	var queryStr = "client_id=" + config.client_id;
  	queryStr += "&response_type=" + config.response_type;
  	queryStr += config.scope ? "&scope=" + encodeURIComponent(config.scope) : "";
  	queryStr += config.access_type ? "&access_type=" + config.access_type : "";
  	queryStr += "&redirect_uri=" + encodeURIComponent(redirectUrl);
  
  	return urlConfig.url + "?" + queryStr;
};