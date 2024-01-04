import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Detalji } from './components/Detalji';
import Navigacija from './components/Navigacija'
import Main from './pages/Main'
import Favorites from './pages/Favorites';
import { MovieProvider } from "./Contextpage";
import User from './pages/User';
import Popular from './pages/Popular.jsx'

function App() {

  return (
    <MovieProvider>
      <Navigacija />
      <div className="md:ml-[15rem]">
          <Routes>
              <Route path='/fromapi' element={<Main />} />
              <Route path='/moviedetail/:id' element={<Detalji />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/search/:query" element={<Main/>}/>
              <Route path="/user" element={<User />} />
              <Route path="/" element={<Popular />}   />
          </Routes>
      </div>
    </MovieProvider>
  )
}

export default App
