sap.ui.define([
	"sap/m/ButtonRenderer",
	"sap/m/OverflowToolbarButton"
], function (ButtonRenderer, Button) {
	"use strict";
		return Button.extend("HMI.Core.CoreOverflowToolbarButton", {
		metadata: {
			properties: {
				notificationCount: { type: "float", defaultValue: 0 }
			},
			aggregations: {

			}
		},
		init: function () {
			this.addStyleClass('corebutton'); this.addStyleClass('sapFButtonNotifications'); this.addStyleClass('sapMBarChild');
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
		renderer: function (oRM, oControl) {
			ButtonRenderer.render(oRM, oControl);
		}
	});
});