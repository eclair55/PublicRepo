import React, { useState, useEffect } from 'react';
import { sectorService } from '../services/api';
import { Plus, Edit2, Trash2, MapPin, X, Loader2, Search } from 'lucide-react';

const Sectors = () => {
  const [sectors, setSectors] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadSectors();
  }, []);

  const loadSectors = async () => {
    setLoading(true);
    try {
      const res = await sectorService.getAll();
      setSectors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await sectorService.update(editing.id, { name });
        setEditing(null);
      } else {
        await sectorService.create({ name });
      }
      setName('');
      loadSectors();
    } catch (err) {
      console.error(err);
      alert('Failed to save sector');
    }
  };

  const handleEdit = (sector: any) => {
    setEditing(sector);
    setName(sector.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this sector? This may affect documents associated with it.')) {
      try {
        await sectorService.delete(id);
        loadSectors();
      } catch (err) {
        console.error(err);
        alert('Failed to delete sector');
      }
    }
  };

  const filteredSectors = sectors.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Sectors Management</h1>
          <p className="text-gray-500">Organize and manage document categories/sectors.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
          {editing ? 'Update Sector' : 'Add New Sector'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Health & Sanitation"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md flex items-center justify-center"
            >
              {editing ? <Edit2 size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
              {editing ? 'Update Sector' : 'Add Sector'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => { setEditing(null); setName(''); }}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search sectors..."
              className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">{filteredSectors.length} Sectors found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Sector Name</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={2} className="px-6 py-10 text-center">
                    <Loader2 size={24} className="animate-spin text-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : filteredSectors.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                       <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center mr-3 font-bold text-xs">
                          {s.name.charAt(0)}
                       </div>
                       <span className="font-medium text-gray-800">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(s)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredSectors.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-gray-400 italic">
                    No sectors found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sectors;
