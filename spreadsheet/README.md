<h1>Google SpreadSheet connector</h1>

<h2>About Google SpreadSheet</h2>
<p><a target="_blank" href="https://www.google.com/sheets/about/">Google SpreadSheet</a>  makes your data pop with colorful charts and graphs. Built-in formulas, pivot tables and conditional formatting options save time and simplify common spreadsheet tasks, all for free. Choose from a wide variety of budgets, schedules, and other pre-made spreadsheets. All your changes are automatically saved as you type. You can even use revision history to see old versions of the same spreadsheet, sorted by date and who made the change.</p>

<h2>Purpose of the scriptr.io connector for google SpreadSheet</h2>
<p>The purpose of this connector is simply a way you access google sheet's api from scriptr.io, by providing you a few native objects that you can directly integrate into your own scripts. This will allow you to create and delete sheets, write and read data from a spreadsheet and by doing so, creating a simple database from some applications.</p>
 
<h2>Components</h2>
<ul>
	<li>SpreadSheet/user.js: this is the main object to interact with. It provides access to the functions used to interact with your spreadsheet</li>

	<li>SpreadSheet/httpClient.js: generic http client that handles the communication between scriptr.io and Google Sheet's APIs. </li>

	<li>SpreadSheet/oauth2/getRequestCodeUrl.js: This script implements steps 1 and 2 of the Google OAuth authorization process.</li>

	<li>SpreadSheet/oauth2/getAccessToken.js: This script implements step 3 of the Google OAuth authorization process.</li>
	
	<li>SpreadSheet/oauth2/config.js: This script has the necessary information used for the oauth2 process (client id, client secret, ...)</li>
	
	<li>SpreadSheet/oauth2/TokenManager.js: This script manages saving and editing the access and refresh token of the google oauth process.</li>

	<li>SpreadSheet/test/tests.js: A list of examples on how to use the connectors' objects and corresponding methods.</li>
</ul>

<h2>How to use</h2>
<ol>
	<li>Use the Import Modules feature to deploy the mentioned scripts in your scriptr account, in a folder named "SpreadSheet".</li>
	
	<li>Create an account at Google</li>
	
	<li>Create a new project at <a href="https://console.developers.google.com">Google Developers</a> and enable the Google Drive API (For creating and deleting spreadsheets) and the Google Sheets API (For manipulating the spreadsheet)</li>

	<li>Go to Credentials and click on "Create credentials", then choose OAuth client ID. When asked about the application type, choose "Web Application" and choose a name for your web client </li>
  
  <li>In the 'Authorised JavaScript origins' field, add "https://<i>your_subdomain</i>.scriptrapps.io" and in the 'Authorised redirect URIs' field, add "https://<i>your_subdomain</i>.scriptrapps.io/SpreadSheet/oauth2/getAccessToken.js"</li>
	
	<li>Once done, make sure to copy/paste the values of your Client ID and Client Secret in the corresponding variables of the "config" file.</li>

	<li>Create a test script in scriptr, or use the script provided in modules/SpreadSheet/test/tests.js</li>
</ol>

<h3>Obtain access Token from Google sheet</h3>
<h4>Step 1</h4>
<p>From a front-end application or from scriptr, send a request to the preadSheet/oauth2/getRequestCodeURL script. The result should resemble to the following </p>
<pre><code>
>> curl -X POST  -H 'Authorization: bearer Ujg1RjI3ODE5ODpzY3JpcHRyOkI0QUU4MDhCQTc0QzExMDZBM0UxMDAxMzlDMjcxRkQ1' 'https://api.scriptrapps.io/SpreadSheet/oauth2/getRequestCodeUrl.js'
{
	"metadata": {
		"requestId": "271cb787-85db-4e21-bb69-0a0d1228c8cc",
		"status": "success",
		"statusCode": "200"
	},
	"result": "https://accounts.google.com/o/oauth2/v2/auth?client_id=578940384496-d3hmkpdbcbcgj15o1lbbl10os02b7fcl.apps.googleusercontent.com&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fspreadsheets&access_type=offline&redirect_uri=https%3A%2F%2Fiomansion.scriptrapps.io%2FSpreadSheet%2Foauth2%2FgetAccessToken.js"
}
</code></pre>

<h4>Step 2</h4>
Copy the URL you received from the script into your browser, This redirects your end user to the withings login and authorization page, where he has to enter his credentials then authorize the application on the requested scope. Once this is done, the result should resemble to the following.
<pre><code>
{"response": {
  "metadata": {
    "requestId": "6ca222d3-813d-411a-8524-3e114497a133",
    "status": "success",
    "statusCode": "200"
  },"result": {
 "access_token": "ya29.Ci87Ax5J8Zd5fjzXyf5WzLuZZbiDy3hF6rG4C8i8DiDgLpR5_aYADVtNrmfEWV6oTg",
 "token_type": "Bearer",
 "expires_in": 3600,
 "refresh_token": "1/eENENez2OVnREBgropjfIjf78-buEf7ZZT8tPN-xW0U"
}
}}

</pre></code>

<p>This calls back the SpreadSheet/oauth2/getAccessToken.js script, providing it with the access and refresh token, these are stored in your scriptr.io's global storage.</p>

<h3>Use the connector</h3>
In order to use the connector, you need to import the main module: SpreadSheet/user.js as described below then go through in the OAuth process we described before:

<pre><code>
var userModule = require("/SpreadSheet/user.js");
</code></pre>

<h4>Samples</h4>
<p> The user module class provides many methods to manipulate data in a spreadsheet and create or delete sheets<br>You can find detailed samples and different parameters in /modules/test/tests.js</p>

<pre><code>
/*Create an instance of a new spreadsheet
var ss = new userModule.SpreadSheet(title, id);*/

var ss = new userModule.SpreadSheet("Finance SpreadSheet", "1pSY-KdVblJrzTyyVc6Mvk7wK0n9FbvmIG4CYiWycao8"); //sample

/*Add a new sheet and specifying the title, max rows and max columns (optional) and tab colour (optional)*/
ss.addSheet("Prices", 10, 10, {red: 1.0, green: 0.3, blue: 0.5});

/*Delete a sheet using the sheet name or index*/
ss.deleteSheet("Prices");
ss.deleteSheet(0);

/*When created, the spreadsheet object automatically fetches the sheets properties of this spreadsheet and the sheets are stored in an public array : sheets[]. To access a sheet all you have to do is know the sheet index.
<br>For example: ss.sheets[0] to access the first sheet */

/*Get the sheets index using the sheet title*/
ss.getSheetIndex("Prices");

/*Read data from your sheet, you can read a data range or a single value*/
ss.sheets[0].readSingleValue("A1");
ss.sheets[0].readDataRange("A1", "B3");

/*Write data to your sheet, you can write a data range or a single value*/

ss.sheets[0].writeSingleValue("A1", "A very important data");

var values = [
    		["Item", "Cost", "Stocked", "Ship Date"],
    		["Wheel", "$20.50", "4", "3/1/2016"],
    		["Engine", "$100", "1", "30/20/2016"],
    		["Totals", "=SUM(B2:B3)", "=SUM(C2:C3)", "=MAX(D2:D3)"]
];

ss.sheets[0].writeDataRange("A1", "D4", values);

/*Clear all the data from a sheet without changing the format*/
ss.sheet[0].clearSheetData();

/*Get the id of a sheet*/
ss.sheet[0].getId();

/*Copy and Paste from a sheet to another*/
ss.copyPaste(sourceSheet, startP1, endP1, destinationSheet, startP2, endP2, valueRenderOption);

</code></pre>
