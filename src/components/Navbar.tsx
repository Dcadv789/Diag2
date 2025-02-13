import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, Settings, BarChart3, TrendingUp } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => 
    location.pathname === path ? 'bg-blue-600' : 'hover:bg-gray-700';

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-white">
              DiagnósticoPro
            </Link>
            
            <div className="flex space-x-4">
              <Link
                to="/diagnostico"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/diagnostico')}`}
              >
                <ClipboardList className="w-4 h-4 mr-2" />
                Diagnóstico
              </Link>
              
              <Link
                to="/backoffice"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/backoffice')}`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Backoffice
              </Link>
              
              <Link
                to="/resultados"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/resultados')}`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Resultados
              </Link>

              <Link
                to="/ranking"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${isActive('/ranking')}`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Ranking
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}