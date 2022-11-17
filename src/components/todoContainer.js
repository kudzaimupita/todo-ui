import { TrashIcon } from "@heroicons/react/solid";
import React, { useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

import Modal from "./addTodoModal.js.js";
import { openNotificationWithIcon } from "./alert";
import { Empty, Popconfirm } from "antd";
import {
  createTodo,
  deleteTodo,
  listTodos,
  markTodoCompleted,
  markTodoUncompleted,
} from "../services/todoService.js";

const filters = [
  {
    id: 1,
    name: "All",
  },
  {
    id: 2,
    name: "Complete",
  },
  {
    id: 3,
    name: "Incomplete",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TodoContainer() {
  const [todos, setTodos] = useState([]);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState(filters[0]);

  const handleSubmit = () => {
    createTodo({ description: description })
      .then(async (response) => {
        setOpen(false);
        openNotificationWithIcon("success", "Todo saved");
        listTodos().then(async (response) => {
          setTodos(response.todos);
        });
        setSelected(filters[0]);
      })
      .catch(() => openNotificationWithIcon("error", "Error creating todo"));
  };

  const cancel = (e) => {
    console.log(e);
  };

  useEffect(() => {
    (async function () {
      await listTodos().then(async (response) => {
        setTodos(response.todos);
      });
    })();
  }, []);

  useEffect(() => {
    (async function () {
      await listTodos().then(async (response) => {
        if (selected.id === 2) {
          setTodos(response.todos.filter((todo) => todo.completed));
        } else if (selected.id === 3) {
          setTodos(response.todos.filter((todo) => !todo.completed));
        } else if (selected.id === 1) {
          setTodos(response.todos);
        }
      });
    })();
  }, [selected]);

  const handleChangeTodoStatus = (id, completed) => {
    if (completed) {
      markTodoUncompleted(id)
        .then((res) => {
          let newTodos;
          if (selected.id === 1) {
            newTodos = todos.map((p) =>
              p.id === id ? { ...p, completed: false } : p
            );
          } else {
            newTodos = todos.filter((todo) => todo.id !== id);
          }
          setTodos(newTodos);
        })
        .catch(() =>
          openNotificationWithIcon("error", "Error changing status")
        );
    } else {
      markTodoCompleted(id)
        .then((res) => {
          let newTodos;
          if (selected.id === 1) {
            newTodos = todos.map((p) =>
              p.id === id ? { ...p, completed: true } : p
            );
          } else {
            newTodos = todos.filter((todo) => todo.id !== id);
          }

          openNotificationWithIcon("success", "Todo complete");
          setTodos(newTodos);
        })
        .catch(() =>
          openNotificationWithIcon("error", "Error changing status")
        );
    }
  };
  const handleDelete = (id) => {
    deleteTodo(id)
      .then((response) => {
        const newTodos = todos.filter((todo) => todo.id !== id);
        openNotificationWithIcon("success", "Todo deleted");
        setTodos(newTodos);
      })
      .catch(() => openNotificationWithIcon("error", "Error deleting todo"));
  };
  return (
    <>
      {open && (
        <Modal
          open={open}
          setOpen={setOpen}
          handleSubmit={handleSubmit}
          setDescription={setDescription}
        />
      )}
      <main>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-200">
          <div>
            <div className="hidden sm:block" style={{ height: "600px" }}>
              <div class="mt-32">
                <div class="max-w-md mx-auto bg-gray-100 shadow-lg rounded-lg overflow-hidden md:max-w-lg">
                  <div class="">
                    <div class="w-full p-4">
                      <div class="overflow-auto" style={{ maxHeight: "500px" }}>
                        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                          <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
                            <div className="ml-4 mt-4">
                              <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Foodstyles Todo
                              </h3>
                            </div>

                            <div className="ml-4 mt-4 flex-shrink-0">
                              <button
                                onClick={() => setOpen(true)}
                                type="button"
                                className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Add Todo
                              </button>
                            </div>
                          </div>
                          <Listbox value={selected} onChange={setSelected}>
                            {({ open }) => (
                              <>
                                <Listbox.Label className="block text-sm font-medium text-gray-700">
                                  Filter:
                                </Listbox.Label>
                                <div className="relative mt-1">
                                  <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                    <span className="flex items-center">
                                      <span className="ml-3 block truncate">
                                        {selected.name}
                                      </span>
                                    </span>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2"></span>
                                  </Listbox.Button>

                                  <Transition
                                    show={open}
                                    as={Fragment}
                                    leave="transition ease-in duration-100"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                  >
                                    <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                      {filters.map((person) => (
                                        <Listbox.Option
                                          key={person.id}
                                          className={({ active }) =>
                                            classNames(
                                              active
                                                ? "text-white bg-indigo-600"
                                                : "text-gray-900",
                                              "relative cursor-default select-none py-2 pl-3 pr-9"
                                            )
                                          }
                                          value={person}
                                        >
                                          {({ selected, active }) => (
                                            <>
                                              <div className="flex items-center">
                                                <span
                                                  className={classNames(
                                                    selected
                                                      ? "font-semibold"
                                                      : "font-normal",
                                                    "ml-3 block truncate"
                                                  )}
                                                >
                                                  {person.name}
                                                </span>
                                              </div>

                                              {selected ? (
                                                <span
                                                  className={classNames(
                                                    active
                                                      ? "text-white"
                                                      : "text-indigo-600",
                                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                                  )}
                                                ></span>
                                              ) : null}
                                            </>
                                          )}
                                        </Listbox.Option>
                                      ))}
                                    </Listbox.Options>
                                  </Transition>
                                </div>
                              </>
                            )}
                          </Listbox>
                          <ul>
                            {todos?.length > 0 ? (
                              todos.map((todo) => {
                                return (
                                  <li
                                    class="flex justify-between items-center bg-white mt-2 p-2 hover:shadow-lg rounded cursor-pointer transition"
                                    style={{ width: "400px" }}
                                  >
                                    <div className="flex">
                                      <div className="flex-shrink-0"></div>{" "}
                                      <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/5/5d/GNOME_Todo_icon_2019.svg"
                                        width="40"
                                        height="40"
                                        class="rounded-full"
                                      />
                                      <div className="ml-3">
                                        {todo.completed ? (
                                          <s className="text-sm font-medium text-green-800">
                                            {todo.description}
                                          </s>
                                        ) : (
                                          <p className="text-sm font-medium text-green-800">
                                            {todo.description}
                                          </p>
                                        )}
                                      </div>
                                      <div className="ml-auto pl-3">
                                        <div className="-mx-1.5 -my-1.5">
                                          <button
                                            type="button"
                                            className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                                          >
                                            <span className="sr-only">
                                              Dismiss
                                            </span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="w-1/6 flex  items-center ">
                                      <a href="#">
                                        <span>
                                          {" "}
                                          <input
                                            type="checkbox"
                                            checked={todo.completed}
                                            onChange={() =>
                                              handleChangeTodoStatus(
                                                todo.id,
                                                todo.completed
                                              )
                                            }
                                            className="form-checkbox h-7 w-7 mr-2"
                                          />
                                        </span>
                                      </a>
                                      <Popconfirm
                                        title="Are you sure to delete this task?"
                                        onConfirm={() => handleDelete(todo.id)}
                                        onCancel={cancel}
                                        okText="Yes"
                                        cancelText="No"
                                      >
                                        <button aria-label="Delete a todo">
                                          <TrashIcon
                                            className="h-5 w-5 text-red-400"
                                            aria-hidden="true"
                                          />
                                        </button>
                                      </Popconfirm>
                                    </div>
                                  </li>
                                );
                              })
                            ) : (
                              <Empty />
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
