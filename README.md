# Sample Google Cloud Function for Iterable web push
## Features
This Cloud function will handle the following tasks:
- Update browserToken to Iterable
- Update web push click with its payload to Iterable
- Perform a check to update real email and replace placeholder email

## Configuration
- Clone this repo to your local machine
- Follow this [link](https://cloud.google.com/sdk/docs/quickstart-windows) to install Google Cloud SDK Shell
- Navigate to your cloned repo, run `npm install` to download all dependencies
- Open `index.js`, input your Iterable API key. You will need a standard key here
- Deploy your function by running `gcloud functions deploy 'ravenclawWebpush' --runtime nodejs10 --trigger-http --entry-point=ravenclawWebpush`
- Test if you have deployed the function successfully by visiting your function url on a browser. You should see the line "Invalid request type" logged out

## Usage
This cloud function is used in case that you implement Iterable webpush on the front-end but don't want to expose Iterable API key. 
- Use case 1: Update browserToken
  ```javascript
  var data = {};
  data.message = "updateBrowserToken";
  data.userEmail = <userEmail>; 
  data.browserToken  = <token>;
  var url = "https://us-central1-superb-shelter-282914.cloudfunctions.net/ravenclaw-webpush"; // Put your function url here
  var method = "POST";
  var async = true;
  var request = new XMLHttpRequest();
  request.open(method, url, async);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  request.send(JSON.stringify(data));
  var xhr = new XMLHttpRequest();
  ```
- Use case 2: Update a click event
  ```javascript
  var postData = {
    'message':'webPushClick',
    'email': <userEmail>, // Put identifier here
    'messageId': payload.messageId, //get from cookies
    'campaignId': Number(payload.campaignId), //get from cookies
    'templateId': Number(payload.templateId) //get from cookies
  };
  var url = "https://us-central1-superb-shelter-282914.cloudfunctions.net/ravenclaw-webpush"; // Put your function url here
  var method = "POST";
  var async = true;
  var request = new XMLHttpRequest();
  request.open(method, url, async);
  request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  request.send(JSON.stringify(postData));
  var xhr = new XMLHttpRequest();
  ```
