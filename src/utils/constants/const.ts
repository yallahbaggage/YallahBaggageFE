
export const kAppVersion = "1.0.0.1";
export const kAppTitle = `Yallah Baggage - ${kAppVersion}`;
export const kImageAssetBackground = "bg.jpg";

export const kRestApiUrl = import.meta.env.VITE_RESTAPI_URL;

//NOTE: User
export const kRestApiUrlUserSummary = `${kRestApiUrl}/User/Summary`;
export const kRestApiUrlUserGetAll = `${kRestApiUrl}/User/GetAll`;
export const kRestApiUrlUserGroupGetAll = `${kRestApiUrl}/User/GetAllUserGroups`;
export const kRestApiUrlUserGetByIdentityNumber = `${kRestApiUrl}/User/GetByIdentityNumber`;
export const kRestApiUrlUserSynchronize = `${kRestApiUrl}/User/Synchronize`;
