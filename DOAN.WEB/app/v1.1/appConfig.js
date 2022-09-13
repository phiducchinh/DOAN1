const sdConfig = {
    authConfig: {
        instance: 'https://devsso.hmisp.com.vn/',
        tenant: 'adfs',
        clientId: '3417daea-57ee-4750-8d10-06be8a06edae',
        cacheLocation: 'localStorage',
        extraQueryParameter: 'scope=openid allatclaims&response_mode=form_post',
        redirectUri: 'https://localhost:3444/Default/SignInCallback',
        postLogoutRedirectUri: 'https://profile.hmisp.com.vn/',
        navigateToLoginRequestUrl: true
    },
    adminApiEndpoint: 'https://localhost:44342/api/',
    amcApiEndpoint: 'https://localhost:643/v1.0/',       
    sdApiEndpoint: 'https://localhost:2443/',
    domainName: 'hmi'
};
var appRuntime = {};
var appCache = {};
var currentUser = {};
var appCache = {};

