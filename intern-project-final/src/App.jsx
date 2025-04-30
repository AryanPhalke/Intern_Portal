import { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import './App.css'
import InternList from './pages/InternList'
import ProjectAssignment from './pages/ProjectAssignment'
import React from 'react'

function App() {
  return (
    <div className="container">
      <header className="py-6 mb-8 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-center">Intern Management System</h1>
        <nav className="intern">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Intern Directory
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Project Assignment
          </NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<InternList />} />
          <Route path="/projects" element={<ProjectAssignment />} />
        </Routes>
      </main>
    </div>
  );
}

export default App