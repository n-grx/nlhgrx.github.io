(this.webpackJsonppriority=this.webpackJsonppriority||[]).push([[0],{24:function(e,t,a){e.exports=a(38)},29:function(e,t,a){},30:function(e,t,a){},31:function(e,t,a){"use strict";a.r(t),function(e){var t=a(2);e.exports=function e(a,n,s){Object(t.a)(this,e),this.edit=function(){console.log("Task deleted.")},this.changeProject=function(){console.log("Task deleted.")},this.delete=function(){console.log("Task deleted.")},this.complete=function(){console.log("Task deleted.")},this.value=a,this.id=s||"id_"+ +new Date}}.call(this,a(32)(e))},38:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),i=a(21),c=a.n(i),o=(a(29),a(18)),l=a(2),r=a(3),d=a(5),u=a(4),m=a(6),p=a(14),h=a(11),k=(a(30),a(9)),v=function(e){function t(){var e;return Object(l.a)(this,t),(e=Object(d.a)(this,Object(u.a)(t).call(this))).handleClick=e.handleClick.bind(Object(k.a)(e)),e.handleOutsideClick=e.handleOutsideClick.bind(Object(k.a)(e)),e.state={popupVisible:!1},e}return Object(m.a)(t,e),Object(r.a)(t,[{key:"handleClick",value:function(){this.state.popupVisible?document.removeEventListener("click",this.handleOutsideClick,!1):document.addEventListener("click",this.handleOutsideClick,!1),this.setState((function(e){return{popupVisible:!e.popupVisible}}))}},{key:"handleOutsideClick",value:function(e){this.node.contains(e.target)||this.handleClick()}},{key:"componentWillUnmount",value:function(){document.removeEventListener("click",this.handleOutsideClick,!1)}},{key:"render",value:function(){var e=this;return s.a.createElement("div",{className:"popover-container",ref:function(t){e.node=t}},s.a.createElement("button",{onClick:this.handleClick,className:this.props.btnInvisible?"btn btn-icon btn-invisible":"btn btn-icon"},s.a.createElement("i",{className:"material-icons"},this.props.icon)),this.state.popupVisible&&s.a.createElement("div",{className:"menu-container noselect pull-right"},s.a.createElement("div",{className:"menu"},s.a.createElement("div",{className:"menu-list"},this.props.children))))}}]),t}(n.Component),f=function(e){function t(){return Object(l.a)(this,t),Object(d.a)(this,Object(u.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this;return s.a.createElement("div",{className:"menu-item-container"},s.a.createElement("div",{className:"menu-item",onClick:function(){e.props.triggerAction()}},this.props.children))}}]),t}(n.Component),g=function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).onHandleEdit=function(){a.setState({editMode:!0})},a.handleKeyPress=function(e){"Enter"===e.key&&(a.props.onUpdateTask(a.props.id,a.state.taskInputValue),a.setState({editMode:!1}))},a.handleDelete=function(){a.props.onDelete(a.props.id)},a.handleOnCompleteTask=function(){a.setState({isComplete:!0}),setTimeout((function(){a.props.onCompleteTask(a.props.id)}),600)},a.calculateTaskAge=function(e){var t=new Date(e),a=new Date,n=Math.floor((a-t)/864e5);return n<2?"Today":n/7>=1?Math.floor(n/7)+"w ago":n%7+"d ago"},a.handleProjectSelection=function(e){a.props.onUpdateProject(a.props.id,e)},a.handleClick=a.handleClick.bind(Object(k.a)(a)),a.handleOutsideClick=a.handleOutsideClick.bind(Object(k.a)(a)),a.state={editMode:!1,taskInputValue:a.props.children,isComplete:!1},a}return Object(m.a)(t,e),Object(r.a)(t,[{key:"handleClick",value:function(){this.state.editMode?document.removeEventListener("click",this.handleOutsideClick,!1):document.addEventListener("click",this.handleOutsideClick,!1),this.state.editMode&&this.props.onUpdateTask(this.props.id,this.state.taskInputValue),this.setState((function(e){return{editMode:!e.editMode}}))}},{key:"handleOutsideClick",value:function(e){this.node.contains(e.target)||this.handleClick()}},{key:"componentWillUnmount",value:function(){document.removeEventListener("click",this.handleOutsideClick,!1)}},{key:"updateTaskInputValue",value:function(e){this.setState({taskInputValue:e.target.value})}},{key:"render",value:function(){var e=this;return s.a.createElement(s.a.Fragment,null,s.a.createElement("li",{className:"task-item mb-1"},s.a.createElement("div",{className:"task-details"},s.a.createElement("div",{className:"checker"},s.a.createElement("input",{type:"checkbox",className:"form-radio mr-3 ",id:"check-one",onClick:this.handleOnCompleteTask})),s.a.createElement("div",{ref:function(t){e.node=t},className:"task-content ".concat(this.state.isComplete?"strikethrough":"")},this.state.editMode?s.a.createElement("input",{className:"inline-task-edit",type:"text",placeholder:"Add task",value:this.state.taskInputValue,onKeyPress:this.handleKeyPress,onChange:function(t){return e.updateTaskInputValue(t)}}):s.a.createElement("span",{onClick:this.handleClick},this.props.children))),s.a.createElement("div",{className:"task-actions"},s.a.createElement("div",{className:"task-content-project mr-2"},this.props.projects),s.a.createElement("div",{className:"  task-content-age"},this.calculateTaskAge(this.props.created)),s.a.createElement("div",{className:"task-action-menu"},s.a.createElement(v,{icon:"more_horiz",btnInvisible:!0},s.a.createElement(f,{triggerAction:this.handleDelete},"Delete"))))))}}]),t}(n.Component),j=function(e){function t(){var e;return Object(l.a)(this,t),(e=Object(d.a)(this,Object(u.a)(t).call(this))).handleProjectSelection=function(t){e.setState({projectSelectorValue:t}),e.props.onProjectSelection(t),e.handleClick()},e.onTextChange=function(t){var a=t.target.value,n=[];if(e.setState({hasNewProject:!1}),0===a.length&&(n=e.props.items,e.setState({suggestions:n})),a.length>0){var s=new RegExp("^".concat(a),"i");n=e.props.items.sort().filter((function(e){return s.test(e.name)}))}0===n.length?(n.push({name:a}),e.setState({suggestions:n,hasNewProject:!0})):e.setState({suggestions:n})},e.renderSuggestions=function(){var t=e.state.suggestions,a=e.state.hasNewProject;return 0===t.length&&(t=e.props.items),t.map((function(n,i){return s.a.createElement("div",{className:"menu-item-container",key:i},s.a.createElement("div",{className:"menu-item",onClick:function(){e.handleProjectSelection(t[i].name)}},s.a.createElement("div",null,a?"+ Create a new project with ":"",s.a.createElement("span",{className:1===t.length?"new-project-suggestion":""},t[i].name))))}))},e.handleClick=e.handleClick.bind(Object(k.a)(e)),e.handleOutsideClick=e.handleOutsideClick.bind(Object(k.a)(e)),e.state={popupVisible:!1,items:[],suggestions:[],projectSelectorValue:"Select project..."},e}return Object(m.a)(t,e),Object(r.a)(t,[{key:"handleClick",value:function(){this.state.popupVisible?document.removeEventListener("click",this.handleOutsideClick,!1):document.addEventListener("click",this.handleOutsideClick,!1),this.setState((function(e){return{popupVisible:!e.popupVisible}}))}},{key:"handleOutsideClick",value:function(e){this.node.contains(e.target)||this.handleClick()}},{key:"componentWillUnmount",value:function(){document.removeEventListener("click",this.handleOutsideClick,!1)}},{key:"render",value:function(){var e=this;return s.a.createElement("div",{className:"popover-container mb-2",ref:function(t){e.node=t}},s.a.createElement("div",{className:"input-project-selector mr-1",onClick:this.handleClick,placeholder:"Select project..."},this.state.projectSelectorValue,s.a.createElement("i",{className:"material-icons md-18"},"arrow_drop_down")),this.state.popupVisible&&s.a.createElement("div",{className:"menu-container noselect"},s.a.createElement("div",{className:"menu"},s.a.createElement("div",{className:"menu-input"},s.a.createElement("input",{onChange:this.onTextChange,placeholder:"Find project"}),s.a.createElement("i",{className:"material-icons md-18"},"search")),s.a.createElement("div",{className:"menu-list"},this.renderSuggestions()))))}}]),t}(n.Component),E=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,s=new Array(n),i=0;i<n;i++)s[i]=arguments[i];return(a=Object(d.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(s)))).state={taskInputValue:"",projectSelectorValue:""},a.handleKeyPress=function(e){"Enter"===e.key&&(e.preventDefault(),a.createTask())},a.handleProjectSelection=function(e){a.setState({projectSelectorValue:e})},a.handleCreateTask=function(){a.props.onCreateTask(a.state.taskInputValue,a.state.projectSelectorValue),a.setState({taskInputValue:"",projectSelectorValue:""})},a.handleProjectReorder=function(e){a.props.onReorderProjects(e)},a}return Object(m.a)(t,e),Object(r.a)(t,[{key:"updateTaskInputValue",value:function(e){this.setState({taskInputValue:e.target.value})}},{key:"render",value:function(){var e=this;return s.a.createElement(s.a.Fragment,null,s.a.createElement("input",{id:"add-task-input",className:"mb-2",type:"text",placeholder:"Add task",value:this.state.taskInputValue,onKeyPress:this.handleKeyPress,onChange:function(t){return e.updateTaskInputValue(t)}}),s.a.createElement(j,{items:this.props.items,onProjectSelection:this.handleProjectSelection}),s.a.createElement("button",{onClick:this.handleCreateTask,className:"btn btn-primary"},"Add"))}}]),t}(n.Component),b=function(e){function t(){var e,a;Object(l.a)(this,t);for(var n=arguments.length,s=new Array(n),i=0;i<n;i++)s[i]=arguments[i];return(a=Object(d.a)(this,(e=Object(u.a)(t)).call.apply(e,[this].concat(s)))).handleHideModal=function(){a.props.hide()},a}return Object(m.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this.props.show?"modal display-block":"modal display-none";return s.a.createElement("div",{className:e},s.a.createElement("section",{className:"modal-main"},s.a.createElement("h2",null,this.props.heading),this.props.children,s.a.createElement("button",{className:"btn btn-icon btn-invisible modal-close mr-2 mt-2",onClick:this.handleHideModal},s.a.createElement("i",{className:"material-icons"},"close"))))}}]),t}(n.Component),O=a(31),C=function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(d.a)(this,Object(u.a)(t).call(this,e))).myHeaders=new Headers({"Content-Type":"application/json",Accept:"application/json"}),a.updateLocalStorage=function(e,t){window.localStorage.setItem(e,JSON.stringify(t))},a.calculateTaskAge=function(e){var t=Math.floor((new Date-new Date(e))/864e5);return t>60?3:t>10?2:t>7?1:0},a.calculateProjectScore=function(e,t){if(!t)return 0;var a,n=t.length,s=e.projects;return t.find((function(e,t){return e.name===s?a=parseInt(t,10):0})),n-a+1},a.calculateTaskScore=function(e,t){return a.calculateTaskAge(e.created)+a.calculateProjectScore(e,t)},a.orderData=function(e,t){var n=[];return Object.keys(e).map((function(s){var i=e[s],c=a.calculateTaskScore(i,t);i.score=c;var o=[i,c];n.push(o)})),n.sort((function(e,t){return t[1]-e[1]})),n.map((function(e){e.pop()})),[].concat.apply([],n)},a.fetchData=function(){var e=JSON.parse(window.localStorage.getItem("tasks")),t=JSON.parse(window.localStorage.getItem("projects"));e?console.log("Local tasks exists"):a.updateLocalStorage("tasks",{}),t?console.log("Local projects exists"):a.updateLocalStorage("projects",[]),e&&a.setState({rootTasks:e,tasks:a.orderData(e,t),projects:t})},a.reorderProjects=function(e){a.updateLocalStorage("projects",e),a.fetchData()},a.createTask=function(e,t){var n=JSON.parse(window.localStorage.getItem("tasks")),s=a.state.projects,i=s.filter((function(e){return e.name===t}));if(i.length<1){var c=Date.now();i={name:t,id:"id-"+c},s.push(i)}var o=Date.now(),l="id-"+o,r=new Date(o);n[l]={id:l,value:e,projects:t,created:r},a.updateLocalStorage("tasks",n),a.updateLocalStorage("projects",s),a.fetchData()},a.updateTaskValue=function(e,t){var n=JSON.parse(window.localStorage.getItem("tasks"));n[e].value=t,a.updateLocalStorage("tasks",n),a.fetchData()},a.updateTaskProject=function(e,t){},a.deleteTask=function(e){var t=JSON.parse(window.localStorage.getItem("tasks"));delete t[e],a.updateLocalStorage("tasks",t),a.fetchData()},a.deleteProject=function(e){var t=JSON.parse(window.localStorage.getItem("tasks")),n=JSON.parse(window.localStorage.getItem("projects")),s=e.currentTarget.value,i=parseInt(s,10),c=n[s];n=n.filter((function(e,t){return t!=i})),Object.keys(t).forEach((function(e){t[e].projects===c.name&&delete t[e]})),a.updateLocalStorage("tasks",t),a.updateLocalStorage("projects",n),a.fetchData()},a.completeTask=function(e){a.deleteTask(e)},a.restoretestData=function(){var e={"id-1575720265375":{value:"Catch up with Itzi about Smart chat proposal",projects:"OJB",created:"2019-11-07T12:04:25.375Z",id:"id-1575720265375"},"id-1575720282012":{value:"Create calendar prototype",projects:"OJB",created:"2019-11-02T12:04:42.012Z",id:"id-1575720282012"},"id-1575720298251":{value:"Create UT discussion guide",projects:"OJB",created:"2019-12-07T12:04:58.251Z",id:"id-1575720298251"},"id-1575720333155":{value:"Check OJB labels for accessibility",projects:"OJB",created:"2019-11-01T12:05:33.155Z",id:"id-1575720333155"},"id-1575720348555":{value:"Get feedback from Nick RE E7 modal option",projects:"OJB",created:"2019-10-07T12:05:48.555Z",id:"id-1575720348555"},"id-1575720371290":{value:"Phone IT about getting a windows VM",projects:"Admin",created:"2019-09-07T12:06:11.290Z",id:"id-1575720371290"},"id-1575720389795":{value:"Write up mobile modal rules",projects:"Admin",created:"2019-08-07T12:06:29.795Z",id:"id-1575720389795"},"id-1575720400219":{value:"Sketch versioning",projects:"Admin",created:"2019-07-07T12:06:40.219Z",id:"id-1575720400219"},"id-1575720415644":{value:"Yellow circle - Does it apply to UX?",projects:"Admin",created:"2019-06-07T12:06:55.644Z",id:"id-1575720415644"},"id-1575720447203":{value:"Add back button to calendar designs",projects:"OJB",created:"2019-05-07T12:07:27.203Z",id:"id-1575720447203"},"id-1575720465282":{value:"Create meeting for Jan about Q1 OKRs",projects:"Smart",created:"2019-04-07T12:07:45.282Z",id:"id-1575720465282"}},t=[{name:"Smart",id:"id-1575321509156"},{name:"Admin",id:"id-1578418157069"},{name:"OJB",id:"id-1578418157123"},{name:"Test Project",id:"id-1578418157999"}];a.updateLocalStorage("tasks",e),a.updateLocalStorage("projects",t),a.fetchData()},a.onDragStart=function(e,t){console.log("Start"),a.draggedItem=a.state.projects[t],e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/html",e.target.parentNode),e.dataTransfer.setDragImage(e.target.parentNode,20,20)},a.onDragOver=function(e){console.log(e);var t=a.state.projects[e];if(a.draggedItem!==t){var n=a.state.projects.filter((function(e){return e!==a.draggedItem}));n.splice(e,0,a.draggedItem),a.setState({projects:n})}},a.onDragEnd=function(){console.log("End"),a.draggedIdx=null,a.reorderProjects(a.state.projects)},a.showModal=function(e){var t=a.state.modals;t[e.target.dataset.modal].visible=!0,a.setState({modals:t})},a.hideModal=function(){var e=a.state.modals;Object.keys(e).map((function(t){return e[t].visible=!1})),a.setState({modals:e})},a.state={pageTitle:"All tasks",tasks:[],projects:[],modals:{newTask:{visible:!1},navigation:{visible:!1},priority:{visible:!1}},offline:!0},a}return Object(m.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){this.fetchData();var e=new O("value","project","id");console.log(e),e.edit()}},{key:"render",value:function(){var e=this,t=function(t){return s.a.createElement(g,{key:t.id,id:t.id,projects:t.projects,allProjects:e.state.projects,created:t.created,onDelete:e.deleteTask,onUpdateTask:e.updateTaskValue,onUpdateProject:e.updateTaskProject,onCompleteTask:e.completeTask},t.value)};return s.a.createElement("div",{className:this.state.show?"app no-scroll":"app"},s.a.createElement(p.a,null,s.a.createElement("div",{className:"header mb-6"},s.a.createElement("div",{className:"col-1"},s.a.createElement("h1",{"data-modal":"navigation",onClick:this.showModal},this.state.pageTitle)),s.a.createElement("div",{className:"col-2"},s.a.createElement("button",{className:"btn btn-primary mr-2","data-modal":"newTask",onClick:this.showModal},"New task"),s.a.createElement(v,{icon:"more_horiz",btnInvisible:!1},s.a.createElement(f,{triggerAction:this.restoretestData},"Restore test data"))),s.a.createElement(b,{show:this.state.modals.navigation.visible,hide:this.hideModal,heading:"Switch projects"},s.a.createElement("ul",null,s.a.createElement("li",null,s.a.createElement(p.b,{to:"/",onClick:this.hideModal},"All tasks")),s.a.createElement("li",null,s.a.createElement(p.b,{to:"completed",onClick:this.hideModal},"Completed"))),s.a.createElement("hr",null),s.a.createElement("div",{className:"menu-list"},this.state.projects?this.state.projects.map((function(t,a){return s.a.createElement("div",{className:"menu-item-container",key:a,onDragOver:function(){return e.onDragOver(a)}},s.a.createElement("div",{className:"menu-item",draggable:"true",onDragStart:function(t){return e.onDragStart(t,a)},onDragEnd:e.onDragEnd},s.a.createElement("div",{className:"icon-left"},s.a.createElement("i",{className:"material-icons md-18"},"drag_indicator")),s.a.createElement("div",null,s.a.createElement(p.b,{to:"/".concat(t.name),onClick:e.hideModal},t.name)),s.a.createElement("div",{className:"icon-right"},s.a.createElement("button",{value:a,onClick:e.deleteProject},s.a.createElement("i",{className:"material-icons md-18"},"delete")))))})):"Add a task to create your first project.")),s.a.createElement(b,{show:this.state.modals.newTask.visible,hide:this.hideModal,heading:"New task"},s.a.createElement(E,{items:this.state.projects,onCreateTask:this.createTask,onReorderProjects:this.reorderProjects}))),s.a.createElement("div",{className:"main"},s.a.createElement(h.c,null,this.state.projects.length<1?"":this.state.projects.map((function(a,n){return s.a.createElement(h.a,{key:n,path:"/".concat(a.name),heading:a.name},function(a){var n=Object(o.a)(e.state.tasks).filter((function(e){return e.projects===a}));return n.length<1?s.a.createElement("p",null,"This project has no tasks"):s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{className:"task-list-container"},s.a.createElement("ul",{className:"task-list"},n.map((function(e){return t(e)})))))}(a.name))})),s.a.createElement(h.a,{path:"/completed"},s.a.createElement("h1",null,"Hello")),s.a.createElement(h.a,{path:"/"},s.a.createElement((function(){var a,n=Object(o.a)(e.state.tasks);return n.length<1?s.a.createElement("p",null,"Looks like you're done for the day"):1===n.length?s.a.createElement("div",{className:"mit-task-container"},s.a.createElement("h2",null,"This is you MIT"),s.a.createElement("ul",{className:"task-list"},t(n[0]))):(a=n[0],n.shift(),s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{className:"mit-task-container"},s.a.createElement("h2",null,"This is you MIT"),s.a.createElement("ul",{className:"task-list"},t(a))),s.a.createElement("div",{className:"task-list-container"},s.a.createElement("h2",null,"Everything else"),s.a.createElement("ul",{className:"task-list"},n.map((function(e){return t(e)}))))))}),null))))))}}]),t}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(s.a.createElement(C,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[24,1,2]]]);
//# sourceMappingURL=main.d2934ee5.chunk.js.map