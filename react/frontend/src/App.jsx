import { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import LeftSidebar from './components/LeftSideBar';

function App() {
  // ─── 1. STATES (DURUMLAR) ───
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false); // Controls the input visibility
  const [newTaskDate, setNewTaskDate] = useState(''); // New state for date

  // ─── 2. EFFECTS (YAN ETKİLER) ───
  useEffect(() => {
    fetchTasks();
  }, []);

  // ─── 3. LOGIC HANDLERS (MANTIK) ───
  const fetchTasks = async () => {
    try {
      // Python runs on 5000. Path is /tasks (matching routes.py)
      const response = await fetch('http://localhost:5000/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task.id !== id));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle) return;

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newTaskTitle,
          date: newTaskDate
        }),
      });

      if (response.ok) {
        const addedTask = await response.json();
        setTasks([...tasks, addedTask]); // Add the new task from DB to the list
        setNewTaskTitle(''); // Clear input
        setNewTaskDate(''); // Clear date
        setIsAdding(false); // Hide input
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // ─── 4. UI (ARAYÜZ) ───
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-dashboard-bg text-slate-300">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />

        <main className="flex-1 p-8 overflow-y-auto bg-slate-950">
          <div className="max-w-6xl mx-auto">
            
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white tracking-tight italic decoration-dusk-start">System Overview</h2>
              <p className="text-slate-400 mt-1 font-medium">Real-time status of your workspace</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* Box 1: Last Notes Container */}
              <div className="bg-card-bg rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800 transition hover:border-slate-700">
                <div className="h-1.5 bg-gradient-to-r from-dusk-start to-dusk-end"></div>
                <div className="p-7">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white text-lg tracking-wide uppercase">Last Notes</h3>
                    {/* Toggle Button: Purple Styled Wide Button */}
                    <button 
                      onClick={() => setIsAdding(!isAdding)}
                      className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition duration-300 border ${
                        isAdding 
                        ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700' 
                        : 'bg-gradient-to-r from-dusk-start to-dusk-end text-white border-white/10 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                      }`}
                    >
                      {isAdding ? (
                        <><span>×</span> Cancel</>
                      ) : (
                        <><span>+</span> Quick Note</>
                      )}
                    </button>
                  </div>

                  {/* Inline Quick Note Input */}
                  {isAdding && (
                    <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
                      <input
                        autoFocus
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type note..."
                        className="w-full bg-slate-900 border border-dusk-start/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-dusk-start transition"
                      />
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={newTaskDate}
                          onChange={(e) => setNewTaskDate(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-dusk-start transition"
                        />
                        <button 
                          onClick={addTask}
                          className="px-6 py-2 bg-gradient-to-r from-dusk-start to-dusk-end text-white text-xs font-bold rounded-xl hover:opacity-90 transition shadow-lg"
                        >
                          DONE
                        </button>
                      </div>
                    </div>
                  )}

                  <ul className="space-y-4">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <li key={task.id} className="flex justify-between items-center group bg-slate-900/30 p-3 rounded-2xl border border-transparent hover:border-white/5 transition">
                          <div className="flex flex-col">
                            <span className="text-slate-200 font-medium group-hover:text-dusk-end transition">
                              {task.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Note • #Task</span>
                              {task.date && (
                                <span className="text-[10px] text-dusk-start font-bold uppercase tracking-widest mt-0.5 italic">
                                  {task.date}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => deleteTask(task.id)}
                              className="text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete Task"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                            <div className={`w-2 h-2 rounded-full ${task.done ? 'bg-green-500' : 'bg-dusk-start'}`}></div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500 italic text-sm text-center py-4">No notes found in database.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Box 2: Static Documents (Remains same for now) */}
              <div className="bg-card-bg rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800 transition hover:border-slate-700">
                <div className="h-1.5 bg-gradient-to-r from-warm-start to-warm-end"></div>
                <div className="p-7">
                  <h3 className="font-bold text-white text-lg mb-6 tracking-wide uppercase">Last Opened Documents</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-2xl cursor-pointer hover:bg-slate-800/60 transition group border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-warm-start/10 text-warm-start rounded-xl flex items-center justify-center text-xs font-bold border border-warm-start/20">PDF</div>
                        <span className="text-slate-300 text-sm font-medium group-hover:text-white transition">Project_Scope.pdf</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;