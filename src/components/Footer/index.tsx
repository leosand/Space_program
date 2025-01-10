import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Space Launches Comparison</h3>
            <p className="text-slate-300">
              Exploring and comparing space launches data from around the world.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Data Sources</h3>
            <ul className="text-slate-300">
              <li>NASA Open Data</li>
              <li>ESA Space Operations</li>
              <li>SpaceX API</li>
              <li>Roscosmos Data Portal</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-slate-300">
              For questions and feedback:<br />
              Email: contact@spacelaunchescomparison.com
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-700 text-center text-slate-300">
          <p>&copy; {new Date().getFullYear()} Space Launches Comparison. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 