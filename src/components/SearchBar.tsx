import { useState, useEffect } from 'react';
import { Search, Users, DollarSign } from 'lucide-react';
import { SearchFilters } from '../types';
import { api } from '../services/api';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});

  useEffect(() => {
    api.getCities().then(setCities);
  }, []);

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
          <select
            value={filters.city || ''}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les villes</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            value={filters.type || ''}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les types</option>
            <option value="apartment">Appartement</option>
            <option value="house">Maison</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" />
            Voyageurs
          </label>
          <input
            type="number"
            min="1"
            value={filters.guests || ''}
            onChange={(e) => setFilters({ ...filters, guests: parseInt(e.target.value) || undefined })}
            placeholder="Nombre"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 inline mr-1" />
            Prix max/nuit
          </label>
          <input
            type="number"
            min="0"
            value={filters.max_price || ''}
            onChange={(e) => setFilters({ ...filters, max_price: parseInt(e.target.value) || undefined })}
            placeholder="€"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
          >
            <Search className="w-5 h-5" />
            <span>Rechercher</span>
          </button>
        </div>
      </div>
    </div>
  );
}
