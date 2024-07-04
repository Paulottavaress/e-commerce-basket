import { toast } from 'vuetify-sonner';

export const warn = ({ notificationMsg, notificationDescription }) => {
	toast(notificationMsg, {
		description: notificationDescription,
		cardProps: {
			color: 'warning'
		},
		prependIcon: 'mdi-alert',
		action: {
			label: 'Close'
		}
	});
};

export const displayErr = ({ notificationMsg, notificationDescription }) => {
	toast(notificationMsg, {
		description: notificationDescription,
		cardProps: {
			color: 'error'
		},
		prependIcon: 'mdi-block-helper',
		action: {
			label: 'Close'
		}
	});
};

export const displaySuccess = ({
	notificationMsg,
	notificationDescription
}) => {
	toast(notificationMsg, {
		description: notificationDescription,
		cardProps: {
			color: 'success'
		},
		prependIcon: 'mdi-check-circle',
		action: {
			label: 'Close'
		}
	});
};
