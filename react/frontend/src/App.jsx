import { useState, useEffect } from 'react';
import './App.css';
const API = 'http://localhost:5000';   

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {                    
    fetch(`${API}/todos`)
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = () => {              
    fetch(`${API}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
      .then(res => res.json())
      .then(newTodo => setTodos([...todos, newTodo]));
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
      <button className="btn" onClick={addTodo}>Add Task</button>
    </div>

    <ul className="todo-list">
      {todos.map(todo => (
        <li key={todo.id} className="todo-item">
          {todo.title}
        </li>
      ))}
    </ul>
  </div>
);
}     
export default App;