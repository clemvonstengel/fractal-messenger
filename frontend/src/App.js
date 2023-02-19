import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

import logo from './logo.svg';
import './App.css';

const base_url = "http://164.90.222.205/"

const type_comps = {
  bark: [Text],
  meristem: [Text_Entry]
}

function Text({i, j, comp_data, command_fn}) {
  return <div key={j}>{comp_data.text}</div>
}

function Text_Entry({i, j, command_fn}) {
  return <div key={j}>...</div>
}

function Node({i, data, selected, command_fn}) {
  return (
    <div 
      key={i} 
      className={"node " + data.type + "-class" + (selected ? "-selected" : "")}
      onClick={() => command_fn(i, "select")}
    >
      {type_comps[data.type].map((comp, j) => comp({
        i: i, j: j, comp_data: data.comp_data, command_fn: command_fn,
      }))}
    </div>
  );
}

function App() {
  const [socket, set_socket] = useState(null)
  const [data, set_data] = useState([])
  const [selected_i, set_selected_i] = useState(-1)




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

  let command_fn = (i, command) => {
    if (command == "select") {
      console.log(command)
      set_selected_i(i)
    }
  }

  return (
    <div className="App">
      <div className="header"></div>
      {data.map((data, i) => Node({
        i: i, 
        data: data,
        selected: i == selected_i,
        command_fn: command_fn
      }))}
    </div>
  );
}

export default App;
