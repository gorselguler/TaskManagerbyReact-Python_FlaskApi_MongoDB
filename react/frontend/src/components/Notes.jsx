import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_BASE}/tasks`);
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newNote.trim() }),
      });

      if (response.ok) {
        const added = await response.json();
        setNotes([...notes, added]);
        setNewNote('');
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== id));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addNote();
    }
  };

  return (
    <div className="text-white w-full max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight italic decoration-dusk-start">Notes</h2>
        <p className="text-slate-400 mt-1 font-medium">Jot down and manage your quick notes</p>
      </div>

      <div className="bg-card-bg rounded-[2rem] p-8 mb-8 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-dusk-start to-dusk-end"></div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Write a new note..."
            className="flex-1 bg-slate-900 border border-dusk-start/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-dusk-start transition"
          />
          <button
            onClick={addNote}
            className="px-6 py-3 bg-gradient-to-r from-dusk-start to-dusk-end text-white text-xs font-bold rounded-xl hover:opacity-90 transition shadow-lg uppercase tracking-wider"
          >
            Add Note
          </button>
        </div>
      </div>

      <ul className="space-y-4">
        {notes.length > 0 ? (
          notes.map((note) => (
            <li
              key={note.id}
              className="flex justify-between items-center group bg-card-bg p-4 rounded-2xl border border-slate-800 hover:border-dusk-start/50 transition shadow-lg"
            >
              <div className="flex flex-col">
                <span className="text-slate-200 font-medium group-hover:text-dusk-end transition">
                  {note.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Note</span>
                  {note.date && (
                    <span className="text-[10px] text-dusk-start font-bold uppercase tracking-widest mt-0.5 italic">
                      {note.date}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                className="text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete note"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))
        ) : (
          <li className="text-slate-500 italic text-sm text-center py-6 bg-slate-900/30 rounded-2xl border border-white/5">
            No notes yet. Add your first note above.
          </li>
        )}
      </ul>
    </div>
  );
};

export default Notes;
