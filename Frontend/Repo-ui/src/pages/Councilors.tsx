import React, { useState, useEffect } from 'react';
import { councilorService } from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Councilors = () => {
  const [councilors, setCouncilors] = useState([]);
  const [formData, setFormData] = useState({ name: '', term: '' });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadCouncilors();
  }, []);

  const loadCouncilors = async () => {
    const res = await councilorService.getAll();
    setCouncilors(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await councilorService.update(editing.id, formData);
      setEditing(null);
    } else {
      await councilorService.create(formData);
    }
    setFormData({ name: '', term: '' });
    loadCouncilors();
  };

  const handleEdit = (c) => {
    setEditing(c);
    setFormData({ name: c.name, term: c.term });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await councilorService.delete(id);
      loadCouncilors();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Manage Councilors</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-8 flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Full Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="e.g. Juan Dela Cruz"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="w-40">
          <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Term</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="e.g. 2022-2025"
            required
            value={formData.term}
            onChange={(e) => setFormData({...formData, term: e.target.value})}
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 h-[42px] rounded flex items-center">
          {editing ? <Edit2 size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
          {editing ? 'Update' : 'Add'}
        </button>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setFormData({ name: '', term: '' }); }} className="bg-gray-200 px-4 py-2 h-[42px] rounded">
            Cancel
          </button>
        )}
      </form>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Term</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {councilors.map(c => (
              <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4">{c.name}</td>
                <td className="p-4 text-gray-500">{c.term}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(c)} className="p-1 text-blue-600 mr-2"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(c.id)} className="p-1 text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Councilors;
