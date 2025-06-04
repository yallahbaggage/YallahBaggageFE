import { ElMessage } from "element-plus";

export const errorMessage = (message: string) => {
	ElMessage.error({
		message: message,
		duration: 2000,
	});
};

export const warnMessage = (message: string) => {
	ElMessage.warning({
		message: message,
		duration: 2000,
	});
};

export const infoMessage = (message: string) => {
	ElMessage.success({
		message: message,
		duration: 2000,
	});
};
