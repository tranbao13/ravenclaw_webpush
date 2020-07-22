const fetch = require('node-fetch');
const e = require('express');
const api = '';
const headers = {
    "Content-Type": "application/json",
    "api-key": api
};

const updateBrowserToken = async requestBody => {
    const payload = {
        "email": requestBody.userEmail,
        "browserToken": requestBody.browserToken
      } 
    return payload;
}

const webPushClick = async requestBody => {
    const pushPayload = {
        "email": requestBody.email,
        "messageId": requestBody.messageId,
        "campaignId": requestBody.campaignId,
        "templateId": requestBody.templateId
    }
    return pushPayload;
}

const dummyMails = async requestBody => {
    const realEmail = requestBody.realEmail;
    const checkExist = await fetch('https://api.iterable.com/api/users/'+realEmail,{method: 'GET', headers: headers});
    if(checkExist === '{}') {
        const replaceData = {
            "currentEmail":requestBody.pushEmail,
            "newEmail":realEmail
        }
        const res = await fetch('https://api.iterable.com/api/users/updateEmail',{method: 'POST', headers: headers, body: JSON.stringify(replaceData)});
        return res.json();
    }
    else {
        const r = await fetch('https://api.iterable.com/api/users/registerBrowserToken',{method: 'POST', headers: headers, body: JSON.stringify({"email":realEmail,"browserToken": requestBody.browserToken})});
        if(r.status == 200) {
            e = await fetch('https://api.iterable.com/api/users/updateSubscriptions',{method: 'POST', headers: headers, body: JSON.stringify({"email": requestBody.pushEmail,"unsubscribedChannelIds": [28077,28653,28079]})});
            return e.json();
        }
        else {
            return r.json();
        }
    }
}

const main = async req => {
    const requestBody = req.body;
    const requestType = req.body.message;
    switch(requestType)
    {
    case "updateBrowserToken":
        const payload = await updateBrowserToken(requestBody);
        const response = await fetch('https://api.iterable.com/api/users/registerBrowserToken',{method: 'POST', headers: headers, body: JSON.stringify(payload)});
        const responseObject = response.json();
        if(response.status == 200) {
            return responseObject;
        }
        else {
            return responseObject.statusText;
        }
    case "webPushClick":
        const pushPayload = await webPushClick(requestBody);
        const pushResponse = await fetch('https://api.iterable.com/api/events/trackWebPushClick',{method: 'POST', headers: headers, body: JSON.stringify(pushPayload)});
        const pushResponseObject = pushResponse.json();
        if(pushResponse.status == 200) {
            return pushResponseObject;
        }
        else {
            return pushResponseObject.statusText;
        }
    case "dummyReplacement":
        const dummyResponse = await dummyMails(requestBody);
        return dummyResponse;
    default:
        return 'Invalid request type';
    }
};


exports.ravenclawWebpush = async (req, res) => {
    const result = await main(req);
    res.set('Access-Control-Allow-Origin', "*")
    res.set('Access-Control-Allow-Methods', 'GET, POST')
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.status(200).send(JSON.stringify(result));
};
