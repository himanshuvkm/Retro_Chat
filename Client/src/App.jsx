import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/login/login';
import SignUp from './pages/signup/signup';
import Home from './pages/Home/Home';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContetx';
import ProfilePage from './components/Profile/ProfilePage';

function App() {
  const { authUser } = useAuthContext();
  return (
    <div className='w-full h-screen flex flex-col font-nunito bg-[var(--window-bg)] overflow-hidden'>
      {/* Window Header - Full Width */}
      <div className="window-header h-10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="computer" className="text-lg">💻</span>
          <span className="font-bold text-[var(--header-text)] tracking-wider">Retro_Chat</span>
        </div>
        <div className="window-dots">
          <button className="dot bg-yellow-300 hover:bg-yellow-400" aria-label="minimize"></button>
          <button className="dot bg-green-400 hover:bg-green-500" aria-label="maximize"></button>
          <button className="dot bg-red-400 hover:bg-red-500" aria-label="close"></button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex relative">
        <Routes>
          <Route path='/' element={authUser ? <Home /> : <Navigate to='/login' />} />
          <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
          <Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
          <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
        </Routes>
      </div>

      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          className: 'retro-window !bg-white !text-black border-2 !border-[var(--window-border)] !rounded-md',
        }}
      />
    </div>
  )
}
export default App;
