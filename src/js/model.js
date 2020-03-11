// Talks to the database but dosen't know the data

const storageType = 0; // 0 = local, 1 = server;
const updateLocalStorage = (name, obj) => {
  window.localStorage.setItem(name, JSON.stringify(obj));
};

class Model {
  getDataFromStorage = id => {
    let data = JSON.parse(window.localStorage.getItem(id));
    if (data) {
      return data;
    } else {
      return;
    }
  };

  addDataToStorage = (id, data) => {
    updateLocalStorage(id, data);
  };

  addTask = (id, value, project, created) => {
    let data = this.getDataFromStorage('tasks');

    data[id] = {
      id: id,
      value: value,
      project: project,
      created: created
    };

    updateLocalStorage('tasks', data);
  };

  editTaskProject = () => {};
  completeTask = () => {};
  deleteTask = () => {};
  addProject = () => {};
  editProject = () => {};
  deleteProject = () => {};
  reorderProjects = () => {};
}

module.exports = Model;
