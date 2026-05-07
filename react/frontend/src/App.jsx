import { useState, useEffect } from 'react';
import './App.css';
const API = 'http://localhost:5000';   

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {                    
    fetch(`${API}/tasks`)
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const addTask = () => {              
    fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
      .then(res => res.json())
      .then(newTask => setTasks([...tasks, newTask]));
  };

return (
  <div className="container">
    <div className="header">
      <h1>Task Manager</h1>
    </div>

    <div className="input-row">
      <input
        className="input"
        type="text"
        placeholder="Add a task..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn" onClick={addTask}>Add Task</button>
    </div>

    <ul className="task-list">
      {tasks.map(task => (
        <li key={task.id} className="task-item">
          {task.title}
        </li>
      ))}
    </ul>
  </div>
);
}     
export default App;