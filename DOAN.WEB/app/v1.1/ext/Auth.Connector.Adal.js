sap.ui.define(['sap/m/MessageBox'], function (MessageBox) {
    "use strict";
    return {
        checkPermission: function (funcName) {
            if (!appRuntime.Features || !appRuntime.Features.length)
                return false;
            return appRuntime.Features.indexOf(funcName) > -1;
        },
        getFromApi: function (url, configs) {
            if (!configs.dataType)
                configs.dataType = 'json';
            var root = this;
            this.requestToApi({
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
        getFromSercureApi: function (url, configs) {
            if (!configs.dataType)
                configs.dataType = 'json';
            var root = this;
            this.requestToSercureApi({
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
        postToApi: function (url, configs) {
            if (!configs.dataType)
                configs.dataType = 'json';
            if (!configs.contentType)
                configs.contentType = "application/json; charset=utf-8";
            var root = this;
            this.requestToApi({
                type: "POST",
                url: url,
                data: JSON.stringify(configs.oParameters),
                contentType: configs.contentType,
                //dataType: configs.dataType,
                success: function (data) {
                    if (configs.fnProcessData)
                        data = configs.fnProcessData(data);
                    if (configs.fnSuccess)
                        configs.fnSuccess(data);
                },
                error: function (error, ctx) {
                    if (configs.fnError) configs.fnError(error, ctx);
                    else root.showErrorDefault(error);
                },
                complete: function () {
                    if (configs.fnCompleted) {
                        configs.fnCompleted();
                    }
                }
            });
        },
        putToApi: function (url, configs) {
            if (!configs.dataType)
                configs.dataType = 'json';
            if (!configs.contentType)
                configs.contentType = "application/json; charset=utf-8";
            var root = this;
            this.requestToApi({
                type: "PUT",
                url: url,
                data: JSON.stringify(configs.oParameters),
                contentType: configs.contentType,
                //dataType: configs.dataType,
                success: function (data) {
                    if (configs.fnSuccess)
                        configs.fnSuccess(data);
                },
                error: function (error, ctx) {
                    if (configs.fnError) configs.fnError(error, ctx);
                    else root.showErrorDefault(error);
                },
                complete: function () {
                    if (configs.fnCompleted) {
                        configs.fnCompleted();
                    }
                }
            });
        },
        deleteToApi: function (url, configs) {
            if (!configs.dataType)
                configs.dataType = 'json';
            if (!configs.contentType)
                configs.contentType = "application/json; charset=utf-8";
            var root = this;
            this.requestToApi({
                type: "DELETE",
                url: url,
                data: JSON.stringify(configs.oParameters),
                contentType: configs.contentType,
                //dataType: configs.dataType,
                success: function (data) {
                    if (configs.fnSuccess)
                        configs.fnSuccess(data);
                },
                error: function (error, ctx) {
                    if (configs.fnError) configs.fnError(error, ctx);
                    else root.showErrorDefault(error);
                },
                complete: function () {
                    if (configs.fnCompleted) {
                        configs.fnCompleted();
                    }
                }
            });
        },
        postToSercureApi: function (url, configs) {
            if (!configs.dataType)
                configs.dataType = 'json';
            if (!configs.contentType)
                configs.contentType = "application/json; charset=utf-8";
            var root = this;
            this.requestToSercureApi({
                type: "POST",
                url: url,
                data: JSON.stringify(configs.oParameters),
                contentType: configs.contentType,
                dataType: configs.dataType,
                success: function (data) {
                    if (configs.fnSuccess)
                        configs.fnSuccess(data);
                },
                error: function (error, ctx) {
                    if (configs.fnError) configs.fnError(error, ctx);
                    else root.showErrorDefault(error);
                },
                complete: function () {
                    if (configs.fnCompleted) {
                        configs.fnCompleted();
                    }
                }
            });
        },
        postToSercureApiAsync: async function (url, configs) {
            if (!configs.dataType)
                configs.dataType = 'json';
            if (!configs.contentType)
                configs.contentType = "application/json; charset=utf-8";
            var root = this;
            this.requestToSercureApi({
                type: "POST",
                url: url,
                data: JSON.stringify(configs.oParameters),
                contentType: configs.contentType,
                dataType: configs.dataType,
                success: function (data) {
                    if (configs.fnSuccess)
                        configs.fnSuccess(data);
                },
                error: function (error, ctx) {
                    if (configs.fnError) configs.fnError(error, ctx);
                    else root.showErrorDefault(error);
                },
                complete: function () {
                    if (configs.fnCompleted) {
                        configs.fnCompleted();
                    }
                }
            });
        },
        requestToApi: function (ajaxProperties) {
            $.ajax(ajaxProperties);
        },
        requestToSercureApi: function (ajaxProperties) {
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
                    'Authorization': 'Bearer ' + token

                };
                $.ajax(ajaxProperties);
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
    };
});