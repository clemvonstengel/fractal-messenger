import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

import './App.css';

const base_url = "http://164.90.222.205/"

const type_comps = {
  root: [],
  bark: [Indent, Text],
  branch: [Indent, Collapse, Text],
  meristem: [Indent, Text_Entry]
}

function Indent({level}) {
  return <div style={{marginRight: "10px"}}>{"--  ".repeat(level)+">"}</div>
}

function Collapse({}) {
  return <div/>
}

function Text({comp_data}) {
  return <div>{comp_data.text}</div>
}

function Text_Entry({id, draft, set_draft, parent_id, command_fn}) {
  return (<div>
    <input 
      placeholder={"..."}
      value={draft}
      onChange={(event) => set_draft(event.target.value)}
    ></input>
    <button onClick={() => {
      command_fn(id, "bark", {text: draft})
      set_draft("")
    }}>ENTER</button>
  </div>);
}

function Node({data, selected, command_fn}) {
  const [draft, set_draft] = useState("") //TODO? generic node data 
  return (
    <div
      className={"node " + data.type + "-class" + (selected ? "-selected" : "")}
      onClick={() => command_fn(data.id, "select")}
    >
      {type_comps[data.type].map((comp, j) => 
        <div key={data.id + ":" + j} style={{display: 'inline-block'}}>
          {comp({
            id: data.id,
            level: data.level,
            draft: draft, set_draft: set_draft,
            comp_data: data.comp_data,
            command_fn: command_fn,
          })}
        </div>
      )}
    </div>
  );
}

function App() {
  //stuff for controller comms
  const [socket, set_socket] = useState(null)
  const [raw_data, set_raw_data] = useState([])

  //stuff for view
  const [stack, set_stack] = useState([])
  const [selected_id, set_selected_id] = useState(-1)
  const [collapsed, set_collapsed] = useState([]) //list of ids of collapsed branches

  useEffect(() => {
    set_raw_data([
      {id: 0, level: 0, parent_id: 0, type: "root", comp_data: {}},
      {id: 1, level: 1, parent_id: 0, type: "bark", comp_data: {text: "frontend placeholder 1"}},
      {id: 2, level: 1, parent_id: 0, type: "branch", comp_data: {text: "frontend placeholder 2"}},
      {id: 4, level: 2, parent_id: 2, type: "bark", comp_data: {text: "frontend placeholder 3"}},
      {id: 5, level: 2, parent_id: 2, type: "meristem", comp_data: {}},
      {id: 3, level: 1, parent_id: 0, type: "meristem", comp_data: {}}
    ])
    const newSocket = socketIOClient(base_url)
    set_socket(newSocket)
    return () => newSocket.close()
  }, [set_socket])

  useEffect(() => {
    if (socket) {
      socket.on("load", (new_data) => {
        set_raw_data(new_data)
      })
    }
  }, [socket])

  useEffect(() => {
    //TODO: hide collapsed elements
    set_stack(raw_data)
  }, [raw_data])


  let command_fn = (id, command, data) => {
    console.log(command)
    if (command === "select") {
      set_selected_id(id)
    } else if (command === "bark") {
      socket.emit("bark", {id: id, text: data})
    }
  }

  return (
    <div className="App">
      <div className="header"></div>
      {stack.map((data) => data.type !== "root" && (<Node
        key={data.id}
        data={data}
        selected={data.id === selected_id}
        command_fn={command_fn}
      />))}
    </div>
  );
}

export default App;