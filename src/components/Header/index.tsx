import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            Space Launches
          </Link>
          <ul className="flex space-x-6">
            <li>
              <NavLink 
                to="/"
                className={({ isActive }) => 
                  isActive ? 'text-blue-400' : 'hover:text-blue-400'
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/launches"
                className={({ isActive }) => 
                  isActive ? 'text-blue-400' : 'hover:text-blue-400'
                }
              >
                Launches
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/statistics"
                className={({ isActive }) => 
                  isActive ? 'text-blue-400' : 'hover:text-blue-400'
                }
              >
                Statistics
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/compare"
                className={({ isActive }) => 
                  isActive ? 'text-blue-400' : 'hover:text-blue-400'
                }
              >
                Compare
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header 