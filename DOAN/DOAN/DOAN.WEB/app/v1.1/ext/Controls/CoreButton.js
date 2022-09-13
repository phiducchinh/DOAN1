sap.ui.define([
	"sap/m/ButtonRenderer",
	"sap/m/Button"
], function (ButtonRenderer, Button) {
	"use strict";
	return Button.extend("HMI.Core.CoreButton", {
		metadata: {
			properties: {
				notificationCount: { type: "float", defaultValue: 0 }
			},
			aggregations: {

			}
		},
		init: function () {
			this.addStyleClass('corebutton');
		},
		setNotificationCount: function (iValue) {
			this.setProperty("notificationCount", iValue, true);
			var datas = this.getCustomData();
			if (datas) {
				if (datas.coreNotifCount)
					this.removeCustomData('coreNotifCount');
			}
			if (iValue && iValue > 0) {
				this.addCustomData(new sap.ui.core.CustomData({
					writeToDom: true,
					key: 'coreNotifCount',
					value: iValue.toString()
				}));
			}
		},
		getNotificationCount: function (iValue) {
			return this.getProperty("notificationCount");
		},
		//setButtonText: function (sValue) {
		//	this.setProperty("buttonText", sValue, true);
		//	this.getAggregation("_button").setText(sValue);
		//},
		renderer: function (oRM, oControl) {
			ButtonRenderer.render(oRM, oControl);
		}
	});
});