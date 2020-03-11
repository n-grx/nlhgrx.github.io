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

const masterController = require('./js/controller.js').default;
const controller = new masterController();

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

  // Get fresh data from db and update state ===========================
  fetchData = () => {
    let data = controller.getData();
    this.setState({ tasks: data[0], projects: data[1] });
  };
  // ===================================================================

  componentDidMount() {
    this.fetchData();
  }

  reorderProjects = object => {
    controller.reorderProjects(object);
    this.fetchData(); /* Set the new state and update the UI */
  };

  // Send the new task to the server and update state.tasks with the new task
  createTask = (task, project) => {
    controller.createTask(task, project);
    this.fetchData();
  };

  // Update task value
  updateTaskValue = (taskId, value) => {
    controller.editTaskValue(taskId, value);
    this.fetchData();
  };

  // Update task project
  updateTaskProject = (taskIDX, project) => {
    // to do
  };

  // Delete the task from the db
  deleteTask = taskId => {
    controller.deleteTask(taskId);
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
    controller.completeTask(taskIDX);
    this.fetchData();
  };

  // restore test data
  restoretestData = () => {
    let data = controller.getTestData();
    this.setState({ tasks: data[0], projects: data[1] });
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
          projects={task.project}
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
        return task.project === project;
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
