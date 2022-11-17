import { get, del, patch, post2 } from "../util/api_helper";

export const listTodos = () => {
  return new Promise((resolve, reject) => {
    get(`/tasks`)
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

export const createTodo = (formData) => {
  return new Promise((resolve, reject) => {
    return post2(`/tasks`, formData)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const markTodoCompleted = (id) => {
  return new Promise((resolve, reject) => {
    return patch(`/tasks/complete-task/${id}`)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const markTodoUncompleted = (id) => {
  console.log(id);
  return new Promise((resolve, reject) => {
    return patch(`/tasks/uncomplete-task/${id}`)
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const deleteTodo = (id) => {
  return new Promise((resolve, reject) => {
    del(`/tasks/${id}`)
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};
