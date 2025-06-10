
export const kAppVersion = "1.0.0.0";
export const kAppTitle = `Yalla - ${kAppVersion}`;
export const kImageAssetBackground = "bg.jpg";

// export const kRestApiUrl = 'http://pddapi.sadeyazilim.com:7020/api/v3';
export const kRestApiUrl = import.meta.env.VITE_RESTAPI_URL;

//NOTE: User
export const kRestApiUrlUserSummary = `${kRestApiUrl}/User/Summary`;
export const kRestApiUrlUserGetAll = `${kRestApiUrl}/User/GetAll`;
export const kRestApiUrlUserGroupGetAll = `${kRestApiUrl}/User/GetAllUserGroups`;
export const kRestApiUrlUserGetByIdentityNumber = `${kRestApiUrl}/User/GetByIdentityNumber`;
export const kRestApiUrlUserSynchronize = `${kRestApiUrl}/User/Synchronize`;
