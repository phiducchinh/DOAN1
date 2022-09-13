sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "app/ext/Auth.Connector.Adal",
    "app/ext/SavListBinding",
    'sap/m/MessageBox'
], function (JSONModel, AdalConnector, SavListBinding, MessageBox) {
    "use strict";
    return JSONModel.extend("HMI.Core.JSONModel", {
        requestToSecureApi: function (sURL, configs) {
            var that = this;
            var sType = 'GET';
            if (configs.bAsync !== false) {
                configs.bAsync = true;
            }
            if (configs.bMerge === undefined) {
                configs.bMerge = true;
            }
            this.fireRequestSent({ url: sURL, type: sType, async: configs.bAsync, info: "cache=" + configs.bCache + ";bMerge=" + configs.bMerge });
            AdalConnector.requestToSercureApi({
                url: sURL,
                async: configs.bAsync,
                dataType: 'json',
                cache: configs.bCache,
                data: configs.oParameters,
                type: sType,
                success: function (oData) {
                    that.oDataOrig = {};
                    that.oDataOrig = jQuery.extend(true, {}, that.oDataOrig, oData); // Holds a copy of the original data   
                    if (configs.fnProcessData === 'function') {
                        oData = configs.fnProcessData(oData);
                    }
                    that.setData(oData, configs.bMerge, configs.initLoad);
                    that.fireRequestCompleted({ url: sURL, type: sType, async: configs.bAsync, info: "cache=false;bMerge=" + configs.bMerge });
                    // call the callback success function if informed
                    if (typeof configs.fnSuccess === 'function') {
                        oData = configs.fnSuccess(oData);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    jQuery.sap.log.fatal("The following problem occurred: " + textStatus, XMLHttpRequest.responseText + ","
                        + XMLHttpRequest.status + "," + XMLHttpRequest.statusText);
                    that.fireRequestCompleted({ url: sURL, type: sType, async: configs.bAsync, info: "cache=false;bMerge=" + configs.bMerge });
                    that.fireRequestFailed({
                        message: textStatus,
                        statusCode: XMLHttpRequest.status, statusText: XMLHttpRequest.statusText, responseText: XMLHttpRequest.responseText
                    });
                    if (typeof configs.fnError === 'function') {
                        configs.fnError({ message: textStatus, statusCode: XMLHttpRequest.status, statusText: XMLHttpRequest.statusText, responseText: XMLHttpRequest.responseText });
                    }
                    else
                        that.showErrorDefault(XMLHttpRequest);
                },
                complete: function () {
                    if (typeof configs.fnCompleted === 'function') {
                        configs.fnCompleted();
                    }
                }
            });
        },
        requestToSercureApiWithRole: function (ajaxProperties) {
            authContext.acquireToken(authContext.config.loginResource, function (error, token) {
                if (error || !token) {
                    if (error.indexOf("login_required")) {
                        authContext.login(); return;
                    }
                    if (error.indexOf("invalid_request") || error.indexOf("MSIS9621") || error.indexOf("MSIS9638") || error.indexOf("interaction_required"))
                        authContext.acquireTokenRedirect(authContext.config.loginResource, null, null);
                    return;
                }
                ajaxProperties.headers = {
                    'Authorization': 'Bearer ' + token,
                    'x-userrole-token': appRuntime.roleToken

                };
                $.ajax(ajaxProperties);
            });
        },
        getFromSercureApi: function (sURL, configs) {
            var that = this;
            var sType = 'GET';
            if (configs.bAsync !== false) {
                configs.bAsync = true;
            }
            if (configs.bMerge === undefined) {
                configs.bMerge = false;
            }
            this.fireRequestSent({ url: sURL, type: sType, async: configs.bAsync, info: "cache=" + configs.bCache + ";bMerge=" + configs.bMerge });
            AdalConnector.requestToSercureApi({
                url: sURL,
                async: configs.bAsync,
                dataType: 'json',
                cache: configs.bCache,
                data: JSON.stringify(configs.oParameters),
                type: sType,
                success: function (oData) {
                    that.oDataOrig = {};
                    that.oDataOrig = jQuery.extend(true, {}, that.oDataOrig, oData); // Holds a copy of the original data   
                    if (typeof configs.fnProcessData === 'function') {
                        oData = configs.fnProcessData(oData);
                    }
                    that.setData(oData, configs.bMerge);
                    that.fireRequestCompleted({ url: sURL, type: sType, async: configs.bAsync, info: "cache=false;bMerge=" + configs.bMerge });
                    // call the callback success function if informed
                    if (typeof configs.fnSuccess === 'function') {
                        oData = configs.fnSuccess(oData);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    jQuery.sap.log.fatal("The following problem occurred: " + textStatus, XMLHttpRequest.responseText + ","
                        + XMLHttpRequest.status + "," + XMLHttpRequest.statusText);
                    that.fireRequestCompleted({ url: sURL, type: sType, async: configs.bAsync, info: "cache=false;bMerge=" + configs.bMerge });
                    that.fireRequestFailed({
                        message: textStatus,
                        statusCode: XMLHttpRequest.status, statusText: XMLHttpRequest.statusText, responseText: XMLHttpRequest.responseText
                    });
                    if (typeof configs.fnError === 'function') {
                        configs.fnError({ message: textStatus, statusCode: XMLHttpRequest.status, statusText: XMLHttpRequest.statusText, responseText: XMLHttpRequest.responseText });
                    }
                    else {
                        that.showErrorDefault(XMLHttpRequest);
                    }
                },
                complete: function () {
                    if (typeof configs.fnCompleted === 'function') {
                        configs.fnCompleted();
                    }
                }
            });
        },
        getFromSercureApiWithRole: function (url, configs) {
            if (!configs.dataType)
                configs.dataType = 'json';
            var root = this;
            this.requestToSercureApiWithRole({
                type: "GET",
                url: url,
                dataType: configs.dataType,
                success: function (data) {
                    if (configs.fnProcessData)
                        data = configs.fnProcessData(data);
                    if (configs.fnSuccess)
                        configs.fnSuccess(data);
                },
                error: function (error, ctx) {
                    if (configs.fnError)
                        configs.fnError(error, ctx);
                    else {
                        root.showErrorDefault(error);
                    }
                },
                complete: function () {
                    if (configs.fnCompleted) {
                        configs.fnCompleted();
                    }
                }
            });
        },
        postToSercureApi: function (sURL, configs) {
            var that = this;
            var sType = 'POST';
            if (configs.bAsync !== false) {
                configs.bAsync = true;
            }
            if (!configs.contentType)
                configs.contentType = "application/json; charset=utf-8";
            if (!configs.dataType)
                configs.dataType = 'json';
            if (configs.bMerge === undefined) {
                configs.bMerge = false;
            }
            this.fireRequestSent({ url: sURL, type: sType, async: configs.bAsync, info: "cache=" + configs.bCache + ";bMerge=" + configs.bMerge });
            AdalConnector.requestToSercureApi({
                url: sURL,
                async: configs.bAsync,
                dataType: configs.dataType,
                contentType: configs.contentType,
                cache: configs.bCache,
                data: JSON.stringify(configs.oParameters),
                type: sType,
                success: function (oData) {
                    that.oDataOrig = {};
                    that.oDataOrig = jQuery.extend(true, {}, that.oDataOrig, oData); // Holds a copy of the original data   
                    if (typeof configs.fnProcessData === 'function') {
                        oData = configs.fnProcessData(oData);
                    }
                    that.setData(oData, configs.bMerge);
                    that.fireRequestCompleted({ url: sURL, type: sType, async: configs.bAsync, info: "cache=false;bMerge=" + configs.bMerge });
                    // call the callback success function if informed
                    if (typeof configs.fnSuccess === 'function') {
                        oData = configs.fnSuccess(oData);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    jQuery.sap.log.fatal("The following problem occurred: " + textStatus, XMLHttpRequest.responseText + ","
                        + XMLHttpRequest.status + "," + XMLHttpRequest.statusText);
                    that.fireRequestCompleted({ url: sURL, type: sType, async: configs.bAsync, info: "cache=false;bMerge=" + configs.bMerge });
                    that.fireRequestFailed({
                        message: textStatus,
                        statusCode: XMLHttpRequest.status, statusText: XMLHttpRequest.statusText, responseText: XMLHttpRequest.responseText
                    });
                    if (typeof configs.fnError === 'function') {
                        configs.fnError({ message: textStatus, statusCode: XMLHttpRequest.status, statusText: XMLHttpRequest.statusText, responseText: XMLHttpRequest.responseText });
                    }
                    else {
                        that.showErrorDefault(XMLHttpRequest);
                    }
                },
                complete: function () {
                    if (typeof configs.fnCompleted === 'function') {
                        configs.fnCompleted();
                    }
                }
            });
        },
        postToSercureApiPaging: function (sURL, configs) {
            var that = this;
            var sType = 'POST';
            if (configs.bAsync !== false) {
                configs.bAsync = true;
            }
            if (configs.bMerge === undefined) {
                configs.bMerge = true;
            }
            this.fireRequestSent({ url: sURL, type: sType, async: configs.bAsync, info: "cache=" + configs.bCache + ";bMerge=" + configs.bMerge });
            AdalConnector.requestToSercureApi({
                url: sURL,
                async: configs.bAsync,
                dataType: 'json',
                cache: configs.bCache,
                data: configs.oParameters,
                type: sType,
                success: function (oData) {
                    that.oDataOrig = {};
                    that.oDataOrig = jQuery.extend(true, {}, that.oDataOrig, oData); // Holds a copy of the original data   
                    if (typeof configs.fnProcessData === 'function') {
                        oData = configs.fnProcessData(oData);
                    }
                    that.setDataPaging(oData, configs.initLoad);
                    that.fireRequestCompleted({ url: sURL, type: sType, async: configs.bAsync, info: "cache=false;bMerge=" + configs.bMerge });
                    // call the callback success function if informed
                    if (typeof configs.fnSuccess === 'function') {
                        oData = configs.fnSuccess(oData);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    jQuery.sap.log.fatal("The following problem occurred: " + textStatus, XMLHttpRequest.responseText + ","
                        + XMLHttpRequest.status + "," + XMLHttpRequest.statusText);
                    that.fireRequestCompleted({ url: sURL, type: sType, async: configs.bAsync, info: "cache=false;bMerge=" + configs.bMerge });
                    that.fireRequestFailed({
                        message: textStatus,
                        statusCode: XMLHttpRequest.status, statusText: XMLHttpRequest.statusText, responseText: XMLHttpRequest.responseText
                    });
                    if (typeof configs.fnError === 'function') {
                        configs.fnError({ message: textStatus, statusCode: XMLHttpRequest.status, statusText: XMLHttpRequest.statusText, responseText: XMLHttpRequest.responseText });
                    }
                    else {
                        that.showErrorDefault(XMLHttpRequest);
                    }
                },
                complete: function () {
                    if (typeof configs.fnCompleted === 'function') {
                        configs.fnCompleted();
                    }
                }
            });
        },
        setDataPaging: function (D, initLoad) {
            if (this.oData && this.oData.Data && !initLoad) {
                this.oData.Data = $.merge(this.oData.Data, D.Data);
            } else {
                this.oData = D;
            }
            if (this.bObserve) {
                this.observeData();
            }
            this.checkUpdate();
        },
        getOrigData: function () {
            return this.oDataOrig;
        },
        discardChanges: function () {
            this.setData(this.oDataOrig);
        },
        commitChanges: function () {
            this.oDataOrig = this.getData();
        },
        bindList: function (path, context, sorters, filters, parameters) {
            return new SavListBinding(this, path, context, sorters, filters, parameters);
        },
        showErrorDefault: function (XMLHttpRequest) {
            var message = XMLHttpRequest.responseText;
            if (XMLHttpRequest.status === 403) {
                if (!message)
                    message = 'Rất tiếc, bạn không được cấp quyền để sử dụng chức năng này';
                MessageBox.error(
                    message,
                    {
                        title: 'Yêu cầu bị từ chối'
                    }
                );
            }
            else {
                if (!message)
                    message = 'Đã có lỗi xảy ra từ phía hệ thống. Vui lòng liên hệ với người quản trị';
                MessageBox.error(
                    message,
                    {
                        title: 'Đã có lỗi xảy ra'
                    }
                );
            }
        }
    });

});