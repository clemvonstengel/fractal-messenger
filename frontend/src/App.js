import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

import './App.css';

const base_url = ""//http://164.90.222.205/"

const type_comps = {
  bark: [Text],
  meristem: [Text_Entry]
}

function Text({key, comp_data}) {
  return <div key={key}>{comp_data.text}</div>
}

function Text_Entry({key, id, draft, set_draft, command_fn}) {
  return (
    <div key={key}>
      <input 
        placeholder={"..."}
        value={draft}
        onChange={(event) => set_draft(event.target.value)}
      ></input>
      <button onClick={() => {
        command_fn(id, "bark", draft)
        set_draft("")
      }}>ENTER</button>
    </div>
  );
}

function Node({data, selected, command_fn}) {
  const [draft, set_draft] = useState("")
  return (
    <div
      className={"node " + data.type + "-class" + (selected ? "-selected" : "")}
      onClick={() => command_fn(data.id, "select")}
    >
      {type_comps[data.type].map((comp, j) => comp({
        key: data.id + ":" + j,
        id: data.id,
        draft: draft, set_draft: set_draft,
        comp_data: data.comp_data,
        command_fn: command_fn,
      }))}
    </div>
  );
}

function App() {
  const [socket, set_socket] = useState(null)
  const [data, set_data] = useState([])
  const [selected_id, set_selected_id] = useState(-1)

  useEffect(() => {
    set_data([
      {id: 0, type: "bark", comp_data: {text: "frontend placeholder 1"}},
      {id: 1, type: "bark", comp_data: {text: "frontend placeholder 2"}},
      {id: 2, type: "meristem", comp_data: {}}
    ])
    const newSocket = socketIOClient(base_url)
    set_socket(newSocket)
    return () => newSocket.close()
  }, [set_socket])

  useEffect(() => {
    if (socket) {
      socket.on("load", (new_data) => {
        set_data(new_data)
      })
    }
  }, [socket])

  let command_fn = (id, command, data) => {
    console.log(command)
    if (command === "select") {
      set_selected_id(id)
    } else if (command === "bark") {
      socket.emit("bark", data)
    }
  }

  return (
    <div className="App">
      <div className="header"></div>
      {data.map((data) => (<Node
        key={data.id}
        data={data}
        selected={data.id === selected_id}
        command_fn={command_fn}
      />))}
    </div>
  );
}

export default App;
