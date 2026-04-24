import React, { useState, useEffect } from 'react';
import { councilorService } from '../services/api';
import { Plus, Edit2, Trash2, User, Search, Loader2, Calendar } from 'lucide-react';

const Councilors = () => {
  const [councilors, setCouncilors] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: '', term: '' });
  const [editing, setEditing] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCouncilors();
  }, []);

  const loadCouncilors = async () => {
    setLoading(true);
    try {
      const res = await councilorService.getAll();
      setCouncilors(res.data);
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
        await councilorService.update(editing.id, formData);
        setEditing(null);
      } else {
        await councilorService.create(formData);
      }
      setFormData({ name: '', term: '' });
      loadCouncilors();
    } catch (err) {
      console.error(err);
      alert('Failed to save councilor');
    }
  };

  const handleEdit = (c: any) => {
    setEditing(c);
    setFormData({ name: c.name, term: c.term });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this councilor?')) {
      try {
        await councilorService.delete(id);
        loadCouncilors();
      } catch (err) {
        console.error(err);
        alert('Failed to delete councilor');
      }
    }
  };

  const filteredCouncilors = councilors.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.term.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Councilors Management</h1>
          <p className="text-gray-500">Manage the official authors and councilors of the government.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
          {editing ? 'Update Councilor Info' : 'Register New Councilor'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 relative">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Juan Dela Cruz"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>
          <div className="md:col-span-1 relative">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-1 block">Active Term</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="2022-2025"
                required
                value={formData.term}
                onChange={(e) => setFormData({...formData, term: e.target.value})}
              />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md flex items-center justify-center h-[42px]"
            >
              {editing ? <Edit2 size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
              {editing ? 'Update' : 'Register'}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => { setEditing(null); setFormData({ name: '', term: '' }); }}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all font-medium h-[42px]"
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
              placeholder="Search by name or term..."
              className="w-full pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-md outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-xs text-gray-400 font-medium">{filteredCouncilors.length} Councilors found</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Councilor Name</th>
                <th className="px-6 py-4 font-semibold">Current Term</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center">
                    <Loader2 size={24} className="animate-spin text-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : filteredCouncilors.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                       <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mr-3 font-bold text-sm">
                          {c.name.charAt(0)}
                       </div>
                       <span className="font-medium text-gray-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {c.term}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(c)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredCouncilors.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">
                    No councilors found
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

export default Councilors;
