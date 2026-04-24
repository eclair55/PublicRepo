import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentService, sectorService, councilorService } from '../services/api';

const UploadDocument = () => {
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    documentType: 'Ordinance',
    sectorId: '',
    authorId: '',
    enactmentDate: '',
  });
  const [file, setFile] = useState(null);
  const [sectors, setSectors] = useState([]);
  const [councilors, setCouncilors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadSectors();
    loadCouncilors();
  }, []);

  const loadSectors = async () => {
    const res = await sectorService.getAll();
    setSectors(res.data);
  };

  const loadCouncilors = async () => {
    const res = await councilorService.getAll();
    setCouncilors(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('file', file);

    try {
      await documentService.upload(data);
      navigate('/admin/dashboard');
    } catch (err) {
      alert('Error uploading document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Upload New Document</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          ></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Document Type</label>
            <select
              className="w-full border p-2 rounded"
              value={formData.documentType}
              onChange={(e) => setFormData({...formData, documentType: e.target.value})}
            >
              <option value="Ordinance">Ordinance</option>
              <option value="Resolution">Resolution</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sector</label>
            <select
              className="w-full border p-2 rounded"
              required
              value={formData.sectorId}
              onChange={(e) => setFormData({...formData, sectorId: e.target.value as any})}
            >
              <option value="">Select Sector</option>
              {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Author (Councilor)</label>
            <select
              className="w-full border p-2 rounded"
              required
              value={formData.authorId}
              onChange={(e) => setFormData({...formData, authorId: e.target.value})}
            >
              <option value="">Select Author</option>
              {councilors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Enactment Date</label>
            <input
              type="date"
              className="w-full border p-2 rounded"
              value={formData.enactmentDate}
              onChange={(e) => setFormData({...formData, enactmentDate: e.target.value})}
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">File (PDF/DOCX)</label>
          <input
            type="file"
            className="w-full"
            accept=".pdf,.docx"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </div>
  );
};

export default UploadDocument;
