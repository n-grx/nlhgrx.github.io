import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
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
      }
    };
  }

  myHeaders = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  });

  componentDidMount() {
    fetch('http://localhost:5000/api/task/getincomplete', {
      headers: this.state.myHeaders
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ tasks: data });
      });

    fetch('http://localhost:5000/api/projects/getall ', {
      headers: this.state.myHeaders
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ projects: data });
      });
  }

  reorderProjects = object => {
    fetch('http://localhost:5000/api/projects/order ', {
      method: 'POST',
      headers: new Headers(),
      body: JSON.stringify({
        projects: object
      })
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ tasks: data[1], projects: data[0] });
      });
  };

  // Send the new task to the server and update state.tasks with the new task
  createTask = (task, project) => {
    fetch('http://localhost:5000/api/task/create', {
      method: 'POST',
      headers: new Headers(),
      body: JSON.stringify({
        projects: project,
        value: task
      })
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ tasks: data });
      });
    this.setState({
      taskInputValue: ''
    });
  };

  // Update task value
  updateTaskValue = (taskIDX, taskValue) => {
    fetch('http://localhost:5000/api/task/edit/value', {
      method: 'POST',
      headers: new Headers(),
      body: JSON.stringify({
        taskid: taskIDX,
        value: taskValue
      })
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ tasks: data });
      });
  };

  // Update task project
  updateTaskProject = (taskIDX, project) => {
    fetch('http://localhost:5000/api/task/edit/projects', {
      method: 'POST',
      headers: new Headers(),
      body: JSON.stringify({
        taskid: taskIDX,
        project: project
      })
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        const tasks = data[0];
        const projects = data[1];
        this.setState({ tasks: tasks, projects: projects });
      });
  };

  // Delete the task from the server
  deleteTask = taskId => {
    fetch('http://localhost:5000/api/task/delete/' + taskId, {
      method: 'POST',
      headers: new Headers()
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ tasks: data });
      });
  };

  // Delete project
  deleteProject = e => {
    const projectIDX = e.currentTarget.value;

    fetch('http://localhost:5000/api/projects/delete/' + projectIDX, {
      method: 'POST',
      headers: new Headers()
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ tasks: data[0], projects: data[1] });
      });
  };

  // Complete task
  completeTask = taskIDX => {
    fetch('http://localhost:5000/api/task/complete', {
      method: 'POST',
      headers: new Headers(),
      body: JSON.stringify({
        taskid: taskIDX
      })
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.length < 1) {
          this.setState({ tasks: false });
        } else {
          this.setState({ tasks: data });
        }
      });
  };

  // restore test data
  restoretestData = () => {
    fetch('http://localhost:5000/api/testdata', {
      headers: this.state.myHeaders
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.setState({ projects: data[0], tasks: data[1] });
      });
  };

  onHandleCreateTask = (task, project) => {
    this.createTask(task, project);
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
    //
    const Page = () => {
      return this.props.children;
    };

    const Header = () => {
      return (
        <div className="header mb-6">
          <div className="col-1">
            <h1 data-modal={'navigation'} onClick={this.showModal}>
              All tasks
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
              {this.state.projects.map((project, idx) => (
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
                      <i className="material-icons md-18">drag_indicator</i>
                    </div>
                    <div>
                      <Link to={`/${project.name}`} onClick={this.hideModal}>
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
              ))}
            </div>
          </Modal>
          <Modal
            show={this.state.modals.newTask.visible}
            hide={this.hideModal}
            heading={'New task'}>
            <NewTaskModule
              items={this.state.projects}
              onCreateTask={this.onHandleCreateTask}
              onReorderProjects={this.reorderProjects}></NewTaskModule>
          </Modal>
        </div>
      );
    };

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
      const { tasks } = this.state;

      return tasks.length < 1 ? (
        <p>Looks like you're done for the day</p>
      ) : (
        <React.Fragment>
          <div className="task-list-container">
            <h2>Everything else</h2>
            <ul className="task-list">{tasks.map(task => renderTask(task))}</ul>
          </div>
        </React.Fragment>
      );
    };

    const renderProjectView = project => {
      const { tasks } = this.state;
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
          <Header></Header>
          <div className="main">
            <Switch>
              {this.state.projects.map((project, idx) => (
                <Route
                  key={idx}
                  path={`/${project.name}`}
                  heading={project.name}>
                  {renderProjectView(project.name)}
                </Route>
              ))}

              <Route path="/completed">
                <Page>
                  <h1>Hello</h1>
                </Page>
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
