import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from 'react-router-dom';
import './App.css';
import Task from './components/task';
import NewTaskModule from './components/newTaskModule';
import Dropdown from './components/dropdown';
import DropdownItem from './components/dropdownitem';
import Modal from './components/modal';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTitle: 'All tasks',
      tasks: [],
      projects: [],
      modals: {
        newTask: { visible: false },
        navigation: { visible: false },
        priority: { visible: false }
      },
      offline: true
    };
  }

  myHeaders = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  });

  updateLocalStorage = (name, obj) => {
    window.localStorage.setItem(name, JSON.stringify(obj));
  };

  // ===================================================================

  // Calculate a score based on the tasks age
  calculateTaskAge = date => {
    // get the age of the task in days
    let age = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60 * 24));
    let score;

    if (age > 60) {
      score = 3;
    } else if (age > 10) {
      score = 2;
    } else if (age > 7) {
      score = 1;
    } else {
      score = 0;
    }

    return score;
  };

  // Calculate a score based on the priority of the project
  calculateProjectScore = (task, projects) => {
    if (!projects) {
      return 0;
    }

    let projectCount = projects.length;
    let projectScore;
    let project = task.projects;

    projects.find((item, idx) => {
      if (item.name === project) {
        return (projectScore = parseInt(idx, 10));
      } else {
        return 0;
      }
    });
    return projectCount - projectScore + 1;
  };

  // Calculate the total score for the task
  calculateTaskScore = (task, projects) => {
    let score =
      this.calculateTaskAge(task.created) +
      this.calculateProjectScore(task, projects);
    return score;
  };

  // Order data
  orderData = (tasks, projects) => {
    let rawData = [];
    Object.keys(tasks).map(id => {
      let task = tasks[id];
      let totalScore = this.calculateTaskScore(task, projects);
      task.score = totalScore;
      let newData = [task, totalScore];
      rawData.push(newData);
    });

    // Sorts the array by the total score 9-1;
    rawData.sort(function(a, b) {
      return b[1] - a[1];
    });

    // Remove the total score int from the array
    rawData.map(item => {
      item.pop();
    });
    let newArr = [].concat.apply([], rawData);
    return newArr;
  };

  fetchData = () => {
    // Get existing players from local storage
    let x = JSON.parse(window.localStorage.getItem('tasks'));
    let y = JSON.parse(window.localStorage.getItem('projects'));

    x
      ? console.log('Local tasks exists')
      : this.updateLocalStorage('tasks', {});
    y
      ? console.log('Local projects exists')
      : this.updateLocalStorage('projects', []);

    if (x) {
      this.setState({ rootTasks: x, tasks: this.orderData(x, y), projects: y });
    } else {
      return;
    }
  };

  // ===================================================================

  componentDidMount() {
    console.log(React.version);
    this.fetchData();
  }

  reorderProjects = object => {
    this.updateLocalStorage('projects', object); /* Update local storage */
    this.fetchData(); /* Set the new state and update the UI */
  };

  // Send the new task to the server and update state.tasks with the new task
  createTask = (task, project) => {
    let tasks = JSON.parse(window.localStorage.getItem('tasks'));
    let projects = this.state.projects;

    // Check if the project exists
    let taskProject = projects.filter(item => {
      return item.name === project;
    });

    if (taskProject.length < 1) {
      let timeStamp = Date.now();
      let ids = 'id-' + timeStamp;
      taskProject = { name: project, id: ids };
      projects.push(taskProject);
    }

    // Create a new time stame for the task
    let timeStamp = Date.now();
    let ids = 'id-' + timeStamp;
    let created = new Date(timeStamp);

    // Define the new task
    tasks[ids] = {
      id: ids,
      value: task,
      projects: project,
      created: created
    };

    // Update local storage
    this.updateLocalStorage('tasks', tasks);
    this.updateLocalStorage('projects', projects);

    // Update the UI
    this.fetchData();
  };

  // Update task value
  updateTaskValue = (taskIDX, taskValue) => {
    let tasks = JSON.parse(window.localStorage.getItem('tasks'));
    let task = tasks[taskIDX];
    task.value = taskValue;
    this.updateLocalStorage('tasks', tasks);
    this.fetchData();
  };

  // Update task project
  updateTaskProject = (taskIDX, project) => {
    // let { tasks } = this.state;
    // let { projects } = this.state;
    // let task = tasks[taskIDX];
    // let taskProject = projects.filter(item => {
    //   return item.name === project;
    // });
    // task.projects = project;
    // if (taskProject.length < 1) {
    //   let timeStamp = Date.now();
    //   let ids = 'id-' + timeStamp;
    //   taskProject = { name: project, id: ids };
    //   projects.push(taskProject);
    // }
    // this.setState({ tasks: tasks, projects: projects });
  };

  // Delete the task from the server
  deleteTask = taskId => {
    let tasks = JSON.parse(window.localStorage.getItem('tasks'));
    delete tasks[taskId];
    this.updateLocalStorage('tasks', tasks);
    this.fetchData();
  };

  // Delete project
  deleteProject = e => {
    let tasks = JSON.parse(window.localStorage.getItem('tasks'));
    let projects = JSON.parse(window.localStorage.getItem('projects'));
    const projectIDX = e.currentTarget.value;
    const projectIndex = parseInt(projectIDX, 10);
    const project = projects[projectIDX];
    projects = projects.filter((item, idx) => {
      return idx != projectIndex;
    });
    Object.keys(tasks).forEach(task => {
      if (tasks[task].projects === project.name) delete tasks[task];
    });
    this.updateLocalStorage('tasks', tasks);
    this.updateLocalStorage('projects', projects);
    this.fetchData();
  };

  // Complete task
  completeTask = taskIDX => {
    this.deleteTask(taskIDX);
  };

  // restore test data
  restoretestData = () => {
    let testData = {
      projects: [
        {
          name: 'Smart',
          id: 'id-1575321509156'
        },
        {
          name: 'Admin',
          id: 'id-1578418157069'
        },
        {
          name: 'OJB',
          id: 'id-1578418157123'
        },
        {
          name: 'Test Project',
          id: 'id-1578418157999'
        }
      ],
      incompleteTasks: {
        'id-1575720265375': {
          value: 'Catch up with Itzi about Smart chat proposal',
          projects: 'OJB',
          created: '2019-11-07T12:04:25.375Z',
          id: 'id-1575720265375'
        },
        'id-1575720282012': {
          value: 'Create calendar prototype',
          projects: 'OJB',
          created: '2019-11-02T12:04:42.012Z',
          id: 'id-1575720282012'
        },
        'id-1575720298251': {
          value: 'Create UT discussion guide',
          projects: 'OJB',
          created: '2019-12-07T12:04:58.251Z',
          id: 'id-1575720298251'
        },
        'id-1575720333155': {
          value: 'Check OJB labels for accessibility',
          projects: 'OJB',
          created: '2019-11-01T12:05:33.155Z',
          id: 'id-1575720333155'
        },
        'id-1575720348555': {
          value: 'Get feedback from Nick RE E7 modal option',
          projects: 'OJB',
          created: '2019-10-07T12:05:48.555Z',
          id: 'id-1575720348555'
        },
        'id-1575720371290': {
          value: 'Phone IT about getting a windows VM',
          projects: 'Admin',
          created: '2019-09-07T12:06:11.290Z',
          id: 'id-1575720371290'
        },
        'id-1575720389795': {
          value: 'Write up mobile modal rules',
          projects: 'Admin',
          created: '2019-08-07T12:06:29.795Z',
          id: 'id-1575720389795'
        },
        'id-1575720400219': {
          value: 'Sketch versioning',
          projects: 'Admin',
          created: '2019-07-07T12:06:40.219Z',
          id: 'id-1575720400219'
        },
        'id-1575720415644': {
          value: 'Yellow circle - Does it apply to UX?',
          projects: 'Admin',
          created: '2019-06-07T12:06:55.644Z',
          id: 'id-1575720415644'
        },
        'id-1575720447203': {
          value: 'Add back button to calendar designs',
          projects: 'OJB',
          created: '2019-05-07T12:07:27.203Z',
          id: 'id-1575720447203'
        },
        'id-1575720465282': {
          value: 'Create meeting for Jan about Q1 OKRs',
          projects: 'Smart',
          created: '2019-04-07T12:07:45.282Z',
          id: 'id-1575720465282'
        }
      },
      completedTasks: {
        'id-1575720465888': {
          value: 'This is a completed task',
          projects: 'Smart',
          created: '2019-04-07T12:07:45.282Z',
          id: 'id-1575720465888'
        }
      }
    };

    let tasks = testData.incompleteTasks;
    let projects = testData.projects;

    this.updateLocalStorage('tasks', tasks);
    this.updateLocalStorage('projects', projects);

    this.fetchData();
  };

  // Re-order project priority
  onDragStart = (e, index) => {
    console.log('Start');
    this.draggedItem = this.state.projects[index];
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  onDragOver = index => {
    console.log(index);
    const draggedOverItem = this.state.projects[index];
    // if the item is dragged over itself, ignore
    if (this.draggedItem === draggedOverItem) {
      return;
    }
    // filter out the currently dragged item
    let items = this.state.projects.filter(item => item !== this.draggedItem);
    // add the dragged item after the dragged over item
    items.splice(index, 0, this.draggedItem);
    this.setState({ projects: items });
  };

  onDragEnd = () => {
    console.log('End');
    this.draggedIdx = null;
    this.reorderProjects(this.state.projects);
  };

  // Control modal visibility
  showModal = e => {
    let { modals } = this.state;
    let modal = e.target.dataset.modal;
    modals[modal].visible = true;
    this.setState({ modals });
  };

  hideModal = () => {
    let { modals } = this.state;
    Object.keys(modals).map(modal => (modals[modal].visible = false));
    this.setState({ modals });
  };

  // ==================================================

  render() {
    const Header = () => {};
    const renderTask = task => {
      return (
        <Task
          key={task.id}
          id={task.id}
          projects={task.projects}
          allProjects={this.state.projects}
          created={task.created}
          onDelete={this.deleteTask}
          onUpdateTask={this.updateTaskValue}
          onUpdateProject={this.updateTaskProject}
          onCompleteTask={this.completeTask}>
          {task.value}
        </Task>
      );
    };

    const Inbox = () => {
      let tasks = [...this.state.tasks];
      let mit;

      if (tasks.length < 1) {
        return <p>Looks like you're done for the day</p>;
      } else if (tasks.length === 1) {
        return (
          <div className="mit-task-container">
            <h2>This is you MIT</h2>
            <ul className="task-list">{renderTask(tasks[0])}</ul>
          </div>
        );
      } else {
        mit = tasks[0];
        tasks.shift();
        return (
          <React.Fragment>
            <div className="mit-task-container">
              <h2>This is you MIT</h2>
              <ul className="task-list">{renderTask(mit)}</ul>
            </div>

            <div className="task-list-container">
              <h2>Everything else</h2>
              <ul className="task-list">
                {tasks.map(task => renderTask(task))}
              </ul>
            </div>
          </React.Fragment>
        );
      }
    };

    const renderProjectView = project => {
      const tasks = [...this.state.tasks];
      const filteredTasks = tasks.filter(task => {
        return task.projects === project;
      });
      return filteredTasks.length < 1 ? (
        <p>This project has no tasks</p>
      ) : (
        <React.Fragment>
          <div className="task-list-container">
            <ul className="task-list">
              {filteredTasks.map(task => renderTask(task))}
            </ul>
          </div>
        </React.Fragment>
      );
    };

    return (
      <div className={this.state.show ? 'app no-scroll' : 'app'}>
        <Router>
          <div className="header mb-6">
            <div className="col-1">
              <h1 data-modal={'navigation'} onClick={this.showModal}>
                {this.state.pageTitle}
              </h1>
            </div>
            <div className="col-2">
              <button
                className="btn btn-primary mr-2"
                data-modal={'newTask'}
                onClick={this.showModal}>
                New task
              </button>
              <Dropdown icon="more_horiz" btnInvisible={false}>
                <DropdownItem triggerAction={this.restoretestData}>
                  Restore test data
                </DropdownItem>
              </Dropdown>
            </div>
            <Modal
              show={this.state.modals.navigation.visible}
              hide={this.hideModal}
              heading={'Switch projects'}>
              <ul>
                <li>
                  <Link to={'/'} onClick={this.hideModal}>
                    All tasks
                  </Link>
                </li>
                <li>
                  <Link to={'completed'} onClick={this.hideModal}>
                    Completed
                  </Link>
                </li>
              </ul>
              <hr></hr>
              <div className="menu-list">
                {this.state.projects
                  ? this.state.projects.map((project, idx) => (
                      <div
                        className="menu-item-container"
                        key={idx}
                        onDragOver={() => this.onDragOver(idx)}>
                        <div
                          className="menu-item"
                          draggable="true"
                          onDragStart={e => this.onDragStart(e, idx)}
                          onDragEnd={this.onDragEnd}>
                          <div className="icon-left">
                            <i className="material-icons md-18">
                              drag_indicator
                            </i>
                          </div>
                          <div>
                            <Link
                              to={`/${project.name}`}
                              onClick={this.hideModal}>
                              {project.name}
                            </Link>
                          </div>
                          <div className="icon-right">
                            <button value={idx} onClick={this.deleteProject}>
                              <i className="material-icons md-18">delete</i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  : 'Add a task to create your first project.'}
              </div>
            </Modal>
            <Modal
              show={this.state.modals.newTask.visible}
              hide={this.hideModal}
              heading={'New task'}>
              <NewTaskModule
                items={this.state.projects}
                onCreateTask={this.createTask}
                onReorderProjects={this.reorderProjects}></NewTaskModule>
            </Modal>
          </div>

          <div className="main">
            <Switch>
              {this.state.projects.length < 1
                ? ''
                : this.state.projects.map((project, idx) => (
                    <Route
                      key={idx}
                      path={`/${project.name}`}
                      heading={project.name}>
                      {renderProjectView(project.name)}
                    </Route>
                  ))}

              <Route path="/completed">
                <h1>Hello</h1>
              </Route>

              <Route path="/">
                <Inbox></Inbox>
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
