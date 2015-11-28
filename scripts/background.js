/*global chrome*/
(function () {
    'use strict';
    chrome.webRequest.onHeadersReceived.addListener(function (response) {
        response.responseHeaders.push({name: 'Access-Control-Allow-Origin', value: '*'});
        return {responseHeaders: response.responseHeaders};
    }, {urls: ["*://*.quoracdn.net/*", "*://img.youtube.com/*"]}, ["blocking", "responseHeaders"]);
}());
