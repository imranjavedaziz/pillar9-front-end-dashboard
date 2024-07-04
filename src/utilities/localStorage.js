export const getToken = () => localStorage.getItem("access");

export const getId = () =>
  JSON.parse(localStorage.getItem("profile_info"))?.user?.id;
