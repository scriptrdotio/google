var ssc = require ("../user.js");

//create your spreadsheet object by entering the name (optional) and spreadsheet id in the parameters
var ss = new ssc.SpreadSheet("createdSS", "1PMD7F_PbomGvKk0VSyYX1HpV9ql22RelbAXEPSnO8HQ");

/**
* When created, your spreadsheet is automatically initialised using the initialiseSpreadSheet() method in which
* the properties of all the sheets in the spreadsheet are added (sheet ID, sheet name).
* Therefore we can access the sheets in the spreadsheet using the array sheets[]. the sheets in this array have the same order
* as they do in the spreadsheet.
**/

var sheet1 = ss.sheets[0];

//If you don't know the index of the sheet in the array you want you can get it using the getSheetIndex method using the sheet title
var index = ss.getSheetIndex("Pricesss");
var sheet2 = ss.sheets[index];
//To add a sheet. You can also specify the max row and column count in the parameters (optional) and the tab colour you want for the sheet (optional). You cannot add a sheet with a title that already exists
ss.addSheet("TestSheet1");
ss.addSheet("limitedTestSheet", 5, 5);
ss.addSheet("colouredTestSheet", 5, 5, {red: 1.0, green: 0.3, blue: 0.5});

//To delete a sheet
ss.deleteSheet("Prices");

//To check if a sheet exists
return ss.exists("Prices");

//To see the spreadsheet properties
ss.showSpreadSheetProperties();

//To get the title of a specific sheet
ss.sheets[0].getTitle();

//To get a single value from a sheet. This method returns the value as a string and the value render option is automatically set to UNFORMATTED_VALUES
var data1 = ss.sheets[0].readSingleValue("A1");

//You can get a numeric value or a math formula by adding the parameter "FORMULA" 
var data2 = ss.sheets[0].readSingleValue("A1", "FORMULA");

//To get a range of data.  This method uses "UNFORMATTED_VALUES" as default value render option and "ROWS" as default major dimension, you can change them by adding the new option in the parameter
var dataArray1 = ss.sheets[0].readDataRange("A1", "C3");
var dataArray2 = ss.sheets[0].readDataRange("A1", "C3", "FORMULA", "COLUMNS");

//To write a single value
ss.sheets[0].writeSingleValue("A1", "Data");

//to write a range of data to a sheet.
var data = [[1,2,3],[4,5,6],[7,8,9]];
ss.sheets[0].writeDataRange("A1", "C3", data);
ss.sheets[0].writeDataRange("A1", "C3", data, "COLUMNS");