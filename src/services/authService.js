import { post2 } from "../util/api_helper";

export const login = (formData) => {
  return new Promise((resolve, reject) => {
    return post2(`/user/login`, formData)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const register = (formData) => {
  return new Promise((resolve, reject) => {
    return post2(`/user/signup`, formData)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
