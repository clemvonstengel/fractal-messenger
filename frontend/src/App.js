import logo from './logo.svg';
import './App.css';

function Node({i, text, metadata, selected}) {
  return (
    <div key={i} className={"node " + metadata.type + "-class" + (selected ? "-selected" : "")}>
      {text}
    </div>
  );
}

function App() {
  let data = [
    {text: "this is the first message in the data", metadata: {type: "default"}},
    {text: "this is the second message in the data", metadata: {type: "default"}},
    {text: "...", metadata: {type: "meristem"}}
  ]

  let selected_i = -1

  return (
    <div className="App">
      <div className="header"></div>
      {data.map((data, i) => Node({
        i: i, 
        text: data.text, 
        metadata: data.metadata,
        selected: i == selected_i
      }))}
    </div>
  );
}

export default App;
