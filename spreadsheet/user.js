var http = require("http");
var config = require("./oauth2/config.js");
var httpClient = require("./httpClient.js");

function Sheet (sheetTitle, spreadSheetId, rowCount, columnCount, tabColour) {
	var title = sheetTitle;
  	var initialRowCount = rowCount;
  	var initialColumnCount = columnCount;
  	var tabColour = tabColour;
  	var id;
  	var spreadSheetId = spreadSheetId;
  
  	this.setId = function(_id) {
    	id = _id;
    };

  	//get the title of this sheet
	this.getTitle = function () {
      	return title;
    };
  
  	//get the ID of this sheet
  	this.getId = function () {
    	return id;
    };
  
 	this.getSpreadSheetId = function () {
    	return spreadSheetId;
    }
  
  	//To read a single value
  	this.readSingleValue = function (position, valueRenderOption) {
		var url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadSheetId + "/values/" + title + "!" + position + ":" + position;
  
  		if (valueRenderOption !== undefined) {
          	if (valueRenderOption !== "UNFORMATTED_VALUE" && valueRenderOption !== "FORMULA") {
            	return {
      			"status" : "failure",
      			"errorDetail" : "The value render option can either be 'UNFORMATTED_VALUE' or 'FORMULA'"
	    		};
            }
    		url += "?" + "valueRenderOption=" + valueRenderOption;
        }
      	
      	var params = {
          	method : "GET",
          	url : url,
        };
      	
      	var answer = httpClient.callApi(params);
      	//returns the values as a string
      	return answer.values[0][0];
	};
 
  //To read data range from a sheet

	this.readDataRange = function (startPoint, endPoint, valueRenderOption, majorDimension) {
		var url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadSheetId + "/values/" + title + "!" + startPoint + ":" + endPoint;
		if (valueRenderOption !== undefined || majorDimension !== undefined) {
      		url += "?";
  			if (valueRenderOption !== undefined) {
              
    			if (valueRenderOption === "ROWS" || valueRenderOption === "COLUMNS") {
       		   		url += ("majorDimension=" + valueRenderOption);
       		 	}
      
				else {
                  	if (valueRenderOption !== "UNFORMATTED_VALUE" && valueRenderOption !== "FORMULA") {
            			return {
      						"status" : "failure",
      						"errorDetail" : "The value render option can either be 'UNFORMATTED_VALUE' or 'FORMULA' and major dimension can be either 'ROWS' or 'COLUMNS'"
	    				};
            		}
       				url += ("valueRenderOption=" + valueRenderOption);
				}
		}
  
  		if (majorDimension != undefined) {
          	if (majorDimension !== "ROWS" && valueRenderOption !== "COLUMNS") {
            		return {
      				"status" : "failure",
      				"errorDetail" : "The major dimension option can either be 'ROWS' or 'COLUMNS'"
	    			};
            }
          
      		url+= "&" + "majorDimension=" + majorDimension;
        }
 
    	}
  
		var params ={
  			method: "GET",
      		url: url
		};
      
      	var answer = httpClient.callApi(params);
  	
 	 	return answer.values;
	};
  
	//To write a single Data
	this.writeSingleValue = function (position, value) {
		var url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadSheetId + "/values/" + title + "!" + position + ":" + position + "?valueInputOption=USER_ENTERED";
		var body = {
			range : title + "!" + position + ":" + position,
      		values : [[value]]
    	};
      
  		var params = {
      		url : url,
			method : "PUT",
      		bodyString : JSON.stringify(body)
		};
      
  		var answer = httpClient.callApi(params);
  		return answer;
	};
  
    //To write a range of values
	this.writeDataRange = function (startPoint, endPoint, values, majorDimension) {
  		var url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadSheetId + "/values/" + title + "!" + startPoint + ":" + endPoint + "?valueInputOption=USER_ENTERED";
  		var body = {
    		range : title + "!" + startPoint + ":" + endPoint,
      		values : values
    	};
  
  		if (majorDimension !== undefined) {
          	if (majorDimension !== "ROWS" && majorDimension !== "COLUMNS") {
            	return {
      				"status" : "failure",
      				"errorDetail" : "The major dimension option can either be 'ROWS' or 'COLUMNS'"
	    		};
            }
    		body.majorDimension = majorDimension;
    	}
  	
  		else
      		body.majorDimension = "ROWS";
  
  		var params = {
      		url : url,
			method : "PUT",
      		bodyString : JSON.stringify(body)
		};
		
      	var answer = httpClient.callApi(params);
    	return answer;
	};

	//To clear all data from a sheet without altering format
	this.clearSheetData = function (sheetTitle) {
			var body = {
				"requests": [{
      				"updateCells": {
        				"range": {
          					"sheetId": id
        				},
        			"fields": "userEnteredValue"
      				}
    			}
  				]
			}
    
			var params = {
				method: "POST",
  				url : "https://sheets.googleapis.com/v4/spreadsheets/" + spreadSheetId +":batchUpdate",
 				bodyString : JSON.stringify(body)
			};
      
      		var answer = httpClient.callApi(params);
      
      		return answer;
	};
} //end of Sheet class

function SpreadSheet (_title, _id) {
  	var id;
   	var title;
  	if (_id === undefined) {
      	id = _title
        title = "";
    }
    else {
      	id = _id;
      	title = _title;
    }
	
  	this.sheets = new Array();
  	this.getId = function() {
    	return id;
    };
   
  	//To add a sheet
  	this.addSheet = function (sheetTitle, rowCount, columnCount, tabColour) {
      	if (!this.exists(sheetTitle)) {
		var body = {
			"requests": [{
    	  		"addSheet": {
     	    		"properties": {
      	    			"title": sheetTitle
       		 		}
      			}
   			 }
  			]
		}
  
		if (tabColour !== undefined) {
			var tabColour = {
				"red": tabColour.red,
				"green": tabColour.green,
				"blue": tabColour.blue
			};

 	 		body.requests[0].addSheet.properties.tabColor = tabColour;
      	}
	
  		if (rowCount !== undefined && columnCount !== undefined) {
  			var gridProperties = {
     		   	"rowCount": rowCount,
     	       "columnCount": columnCount
			}
        
        // Add the sheet to the sheets Array in the spreadSheetProperties.
		body.requests[0].addSheet.properties.gridProperties = gridProperties;
		} 
  
		var params = {
			method: "POST", 
  			url : "https://sheets.googleapis.com/v4/spreadsheets/" + id +":batchUpdate",
  			bodyString : JSON.stringify(body)
		};
          
        var answer = httpClient.callApi(params);
      	var newSheet = new Sheet (sheetTitle, id, rowCount, columnCount, tabColour);
      	var newSheetId = String(answer.replies[0].addSheet.properties.sheetId); 
      	newSheet.setId(newSheetId);
      	this.sheets.push(newSheet); 
      	 
      	return answer;
        }
		else {
          return {
      			"status" : "failure",
      			"errorDetail" : "You can not add a sheet that already exists",
	    	};
        }
    }; //end of addSheet method
  
  	//To delete a sheet
	this.deleteSheet = function(sheetIndex) {
      	//If the parameter is a string, it converts it into the index of the sheet with the string as its title
    	if (typeof sheetIndex === "string"){
          	sheetIndex = this.getSheetIndex(sheetIndex);
        }
      
      	if (sheetIndex < 0 || sheetIndex >= this.sheets.length) {
          	return {
      			"status" : "failure",
      			"errorDetail" : "This sheet doesn't exist",
	    	};
        }
      
      	else if (this.showSpreadSheetProperties().length === 1) {
          	return {
      			"status" : "failure",
      			"errorDetail" : "You cannot delete the last sheet available"
	    	};
        }
      
      	else {
			var body = {
				"requests": [{
					"deleteSheet": {
        				"sheetId": this.sheets[sheetIndex].getId()
      				}
    			}]
			}
    
    		var params = {
				method: "POST",
  				url : "https://sheets.googleapis.com/v4/spreadsheets/" + id +":batchUpdate",
              	headers : {
                  	"Authorization" : "Bearer " + storage.global.google_spreadsheet_accessToken
                },
  				bodyString : JSON.stringify(body)
			};
          	
          	var answer = httpClient.callApi(params);
          	this.sheets.splice(sheetIndex, 1);
          	return answer;
        }
	}; //end of deleteSheet function
  
	//To see if a sheet exists in the spreadsheet
  	this.exists = function (sheetTitle) {
    	for (var i=0; i<this.sheets.length; i++) {
        	if (this.sheets[i].getTitle() === sheetTitle)
              	return true;
        }
    	
      	return false;
    };
  
  	this.getSheetIndex = function(sheetTitle) {
    	for (var i=0; i<this.sheets.length; i++) {
        	if (this.sheets[i].getTitle() === sheetTitle)
              	return i;
        }
      	//if title doesn't exist return -1
      	return -1;
    };
  
  	this.initialiseSpreadSheet = function() {
     	var params = {
			method: "GET",
  			url : "https://sheets.googleapis.com/v4/spreadsheets/" + id +"?&fields=sheets.properties"
		};
      	var spreadsheetProperties = httpClient.callApi(params);
		var availableSheets = spreadsheetProperties.sheets;
      
      	for (var i=0; i<availableSheets.length; i++) {
          	var newSheet = new Sheet (availableSheets[i].properties.title, id,  availableSheets[i].properties.gridProperties.rowCount, availableSheets[i].properties.gridProperties.columnCount);
          	this.sheets.push(newSheet);
          	this.sheets[i].setId(availableSheets[i].properties.sheetId);	
        }
    };
  	
  	//calls this method on object creation 
  	this.initialiseSpreadSheet();
  
  	this.showSpreadSheetProperties = function () {
      	var sheetsProperties = new Array();
    	for (var i=0; i<this.sheets.length; i++) {
          	var sheetProperty = {
              Title: this.sheets[i].getTitle(),
              Id: this.sheets[i].getId()
            }
            
            sheetsProperties.push(sheetProperty);
        }
      
      	return sheetsProperties;
    };
  
  	this.copyPaste = function (sheetTitle1, startPoint1, endPoint1, sheetTitle2, startPoint2, endPoint2, valueRenderOption) {
    	var sheet1Index = this.getSheetIndex(sheetTitle1);
		var sheet2Index = this.getSheetIndex(sheetTitle2);
      	if (sheet1Index === -1) {
        	return {
      			"status" : "failure",
      			"errorDetail" : "Your source sheet title doesn't exist"
	    	};
        }
      
      	if (sheet2Index === -1) {
          	return {
      			"status" : "failure",
      			"errorDetail" : "Your destination sheet title doesn't exist"
	    	};
        }
      	var dataToCopy;
      	if (valueRenderOption !== undefined)
      		dataToCopy = this.sheets[sheet1Index].readDataRange(startPoint1, endPoint1, valueRenderOption);
      	else
          	dataToCopy = this.sheets[sheet1Index].readDataRange(startPoint1, endPoint1);
      
      	return this.sheets[sheet2Index].writeDataRange(startPoint2, endPoint2, dataToCopy);	
    }
  
}//end of SpreadSheet class