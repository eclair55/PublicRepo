import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentService, sectorService, councilorService } from '../services/api';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

const UploadDocument = () => {
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    documentType: 'Ordinance',
    sectorId: '',
    authorId: '',
    term: '',
    enactmentDate: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [sectors, setSectors] = useState<any[]>([]);
  const [councilors, setCouncilors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadSectors();
    loadCouncilors();
  }, []);

  const loadSectors = async () => {
    try {
      const res = await sectorService.getAll();
      setSectors(res.data);
    } catch (err) {
      console.error('Failed to load sectors', err);
    }
  };

  const loadCouncilors = async () => {
    try {
      const res = await councilorService.getAll();
      setCouncilors(res.data);
    } catch (err) {
      console.error('Failed to load councilors', err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');
    if (!formData.term) return alert('Please select a term');

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });
    data.append('file', file);

    try {
      await documentService.upload(data);
      setSuccess(true);
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error uploading document');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Successful!</h2>
        <p className="text-gray-600">Your document has been uploaded and is pending approval.</p>
        <p className="text-sm text-gray-400 mt-4 italic text-sm">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h1 className="text-xl font-bold text-gray-800">Upload New Document</h1>
          <p className="text-sm text-gray-500">Fill in the details below to add a new document to the repository.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Document Title *</label>
              <input
                type="text"
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="e.g. Resolution No. 123 - Annual Budget"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                rows={3}
                placeholder="Briefly describe the contents or purpose of this document..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type *</label>
              <select
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={formData.documentType}
                onChange={(e) => setFormData({...formData, documentType: e.target.value})}
              >
                <option value="Ordinance">Ordinance</option>
                <option value="Resolution">Resolution</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sector *</label>
              <select
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
                value={formData.sectorId}
                onChange={(e) => setFormData({...formData, sectorId: e.target.value})}
              >
                <option value="">Select Sector</option>
                {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Author (Councilor) *</label>
              <select
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
                value={formData.authorId}
                onChange={(e) => setFormData({...formData, authorId: e.target.value})}
              >
                <option value="">Select Author</option>
                {councilors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Term *</label>
              <select
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
                value={formData.term}
                onChange={(e) => setFormData({...formData, term: e.target.value})}
              >
                <option value="">Select Term</option>
                <option value="2022-2025">2022-2025</option>
                <option value="2025-2028">2025-2028</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Enactment Date</label>
              <input
                type="date"
                className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                value={formData.enactmentDate}
                onChange={(e) => setFormData({...formData, enactmentDate: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">File Upload (PDF/DOCX) *</label>
              <div className="relative">
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.docx"
                  required
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full border-2 border-dashed border-gray-200 p-3 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                >
                  <Upload size={20} className="mr-2 text-gray-400" />
                  <span className="text-sm text-gray-600 truncate">
                    {file ? file.name : 'Choose file or drag & drop'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-200 rounded-lg text-gray-600 font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center transition-all shadow-md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Document'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocument;
