// Controller - gets the data from the model, modifies it and sends it to the view

fetchData = () => {
  const myHeaders = new Headers({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  });

  fetch('http://localhost:5000/projects', {
    headers: myHeaders
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      this.setState({ projects: data.projects, tasks: data.tasks });
    });
};

orderTasks = () => {
  return this.state.projects.map(project =>
    this.state.tasks
      .filter(task => {
        return task.projects === project.name;
      })
      .map(filteredTask => (
        <li key={filteredTask.id}>
          <span>{filteredTask.value}</span>
          <span>{filteredTask.projects}</span>
          <span>{new Date(filteredTask.created * 1000).toDateString()}</span>
        </li>
      ))
  );
};
