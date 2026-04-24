import React, { useState, useEffect } from 'react';
import { sectorService } from '../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Sectors = () => {
  const [sectors, setSectors] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadSectors();
  }, []);

  const loadSectors = async () => {
    const res = await sectorService.getAll();
    setSectors(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await sectorService.update(editing.id, { name });
      setEditing(null);
    } else {
      await sectorService.create({ name });
    }
    setName('');
    loadSectors();
  };

  const handleEdit = (sector) => {
    setEditing(sector);
    setName(sector.name);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await sectorService.delete(id);
      loadSectors();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Manage Sectors</h1>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-8 flex gap-2">
        <input
          type="text"
          className="flex-1 border p-2 rounded"
          placeholder="Sector Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          {editing ? <Edit2 size={18} className="mr-2" /> : <Plus size={18} className="mr-2" />}
          {editing ? 'Update' : 'Add'}
        </button>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setName(''); }} className="bg-gray-200 px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </form>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sectors.map(s => (
              <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="p-4">{s.name}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(s)} className="p-1 text-blue-600 mr-2"><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-1 text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sectors;
