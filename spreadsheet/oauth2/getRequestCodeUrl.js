var loginUrl = require ("./loginUrl.js");

try {
  	return loginUrl.getUrl();
} catch (exception) {
  	return {
      	"status" : "failure",
      	"errorCode" : exception.errorCode ? exception.errorCode : "Internal_Error",
      	"errorDetail" : exception.errorDetail ? exception.errorDetail : exception
    };
}