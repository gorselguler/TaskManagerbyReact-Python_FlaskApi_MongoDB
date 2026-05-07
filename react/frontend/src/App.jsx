import TopBar from './components/TopBar';
import LeftSidebar from './components/LeftSideBar';

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-dashboard-bg">
      {/* 1. Header is at the top */}
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Sidebar is on the left */}
        <LeftSidebar />

        {/* 3. Main content area */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-950">
          <div className="max-w-6xl mx-auto">
            
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-white tracking-tight italic decoration-dusk-start">System Overview</h2>
              <p className="text-slate-400 mt-1 font-medium">Real-time status of your workspace</p>
            </div>

            {/* ─── ROW 1: Two Column Layout ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* Box 1: Last Notes */}
              <div className="bg-card-bg rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800 transition hover:border-slate-700">
                <div className="h-1.5 bg-gradient-to-r from-dusk-start to-dusk-end"></div>
                <div className="p-7">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-white text-lg tracking-wide uppercase">Last Notes</h3>
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-700 transition">
                      <span className="text-xs">+</span>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex justify-between items-center group">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-medium group-hover:text-dusk-end transition">Design system meeting</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Note • #Crud</span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono italic">07.05.2026</span>
                    </li>
                    <li className="flex justify-between items-center group">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-medium group-hover:text-dusk-end transition">Backend API logic</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">System • #Refactor</span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono italic">06.05.2026</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Box 2: Documents */}
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
                      <div className="w-6 h-6 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-500 text-[10px]">Open</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900/40 rounded-2xl cursor-pointer hover:bg-slate-800/60 transition group border border-white/5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-dusk-start/10 text-dusk-start rounded-xl flex items-center justify-center text-xs font-bold border border-dusk-start/20">DOC</div>
                        <span className="text-slate-300 text-sm font-medium group-hover:text-white transition">Meeting_Notes.docx</span>
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-500 text-[10px]">Open</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ─── ROW 2: Gallery Downstairs ─── */}
            <div className="bg-card-bg rounded-[2rem] overflow-hidden shadow-2xl border border-slate-800 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-white text-xl tracking-tight uppercase">
                  Gallery <span className="text-dusk-end">Highlights</span>
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {/* Visual Cards inspired by your image */}
                 <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-dusk-start to-dusk-end opacity-90 group-hover:scale-110 transition duration-700"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent">
                      <h4 className="text-white font-bold text-lg mb-1">Dusk</h4>
                      <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest">Theme Visualization</p>
                    </div>
                 </div>
                 
                 <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-warm-start to-warm-end opacity-90 group-hover:scale-110 transition duration-700"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-transparent to-transparent">
                      <h4 className="text-white font-bold text-lg mb-1">Warm Sand</h4>
                      <p className="text-[10px] uppercase font-bold text-white/50 tracking-widest">Theme Visualization</p>
                    </div>
                 </div>

                 <div className="aspect-[4/3] bg-slate-900/60 rounded-2xl border border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 group hover:border-slate-500 transition cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-2xl group-hover:text-slate-300 transition">+</div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Add Media</span>
                 </div>
                 <div className="aspect-[4/3] bg-slate-900/60 rounded-2xl border border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 group hover:border-slate-500 transition cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 text-2xl group-hover:text-slate-300 transition">+</div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Add Media</span>
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