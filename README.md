# google connector 
## About google
## Purpose of the scriptr.io connector for google 
## Components
## How to use
- Deploy the aforementioned scripts in your scriptr account, in a folder named "google".
- Create an application on [google](developers.google.com). 
- Once done, make sure to copy/paste the values of your Client (Consumer) Key, OAuth 2.0 Client ID and Client (Consumer) Secret in the corresponding
variables of the google/config file.
- Add your scriptr.io auth token to the redirect_uri variable in the config file. You can use your authentication token or anonymous token. In that latter case, you will also have to check "Allow Anonymous Requests" in the getAccessToken script.
- Create a test script in scriptr, or use the script provided in google/test. 
