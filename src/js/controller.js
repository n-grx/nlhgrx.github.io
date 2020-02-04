const storageType = 0; // 0 = local, 1 = server;

switch (true) {
  case 'value1':
    break;
  case 'value2':
    break;
  case 'valueN':
    break;
  default:
    break;
}

// updateLocalStorage = (name, obj) => {
//   window.localStorage.setItem(name, JSON.stringify(obj));
// };

class boob {
  constructor(value, project, id) {
    this.value = value;
    this.id = id ? id : 'id_' + +new Date();
  }

  edit = () => {
    console.log('Task deleted.');
  };

  changeProject = () => {
    console.log('Task deleted.');
  };

  delete = () => {
    console.log('Task deleted.');
  };

  complete = () => {
    console.log('Task deleted.');
  };
}

module.exports = boob;
