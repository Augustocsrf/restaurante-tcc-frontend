import api from "../Services/api";
import User from "../DataTypes/User";

const USER_KEY = "userData";

export const saveCredentials = (userData) => {
  const userDataStringify = JSON.stringify(userData);

  api.defaults.headers.common["Authorization"] = "Bearer " + userData.apiToken;
  
  localStorage.setItem(USER_KEY, userDataStringify);
};

export const retrieveSavedUser = () => {
  const userDataString = localStorage.getItem(USER_KEY);

  //Caso o valor recuperado esteja vazio, retornar um usuário novo, caso não criar um usuário novo com as informações encontradas
  if (!userDataString) {
    return new User();
  }

  const userData = JSON.parse(userDataString);
  
  api.defaults.headers.common["Authorization"] = "Bearer " + userData.apiToken;
  
  return new User(userData);
};

export const removeCredentials = () => {
  api.defaults.headers.common["Authorization"] = "";
  localStorage.removeItem(USER_KEY);
};
