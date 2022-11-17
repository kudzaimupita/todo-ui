import axios from "axios";

const API_URL = "http://localhost:8080";

export const axiosApi = axios.create({
  baseURL: API_URL,
});

axiosApi.defaults.headers.common["Authorization"] =
  "Bearer " + JSON.parse(localStorage.getItem("token"));

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export async function get(url, config = {}) {
  return await axiosApi
    .get(url, { ...config })
    .then((response) => {
      return response.data;
    })
    .catch((error) => error);
}

export async function post2(url, data, config = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axiosApi.post(API_URL + url, data);
      return resolve(res);
    } catch (err) {
      const errors = err.response.data.error;
      const errorArray = errors.split(",");
      return reject(errorArray);
    }
  });
}

export async function post(url, data, config = {}) {
  console.log(url, data);
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then((response) => response.data)
    .catch((error) => error);
}
export async function put(url, data, config = {}) {
  console.log(url, data);
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then((response) => response.data)
    .catch((error) => error);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then((response) => response.data)
    .catch((error) => error);
}

export async function patch(url, data, config = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axiosApi.patch(API_URL + url, data);
      return resolve(res);
    } catch (err) {
      const errors = err.response.data.error;
      const errorArray = errors.split(",");
      return reject(errorArray);
    }
  });
}
