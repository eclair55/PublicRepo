import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { documentService, BASE_URL } from '../services/api';
import { Download, Calendar, User, Tag, FileText } from 'lucide-react';

const DocumentDetails = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      const res = await documentService.getById(id);
      setDoc(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!doc) return <div className="text-center py-20">Document not found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">{doc.title}</h1>
          <p className="opacity-80">{doc.documentType} No. {doc.id}</p>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap mb-6">{doc.description || 'No description available.'}</p>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              {doc.filePath.endsWith('.pdf') ? (
                <iframe
                  src={`${BASE_URL}/${doc.filePath}`}
                  className="w-full h-96 border rounded"
                  title="PDF Preview"
                ></iframe>
              ) : (
                <div className="bg-gray-100 p-10 text-center rounded">
                  <p>Preview not available for this file type.</p>
                  <button
                    onClick={() => window.open(`${BASE_URL}/${doc.filePath}`)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center mx-auto"
                  >
                    <Download size={18} className="mr-2" /> Download to View
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm tracking-wider">Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Tag size={18} className="mr-2" />
                  <span><strong>Sector:</strong> {doc.sector?.name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <User size={18} className="mr-2" />
                  <span><strong>Author:</strong> {doc.author?.name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={18} className="mr-2" />
                  <span><strong>Enacted:</strong> {doc.enactmentDate ? new Date(doc.enactmentDate).toLocaleDateString() : 'N/A'}</span>
                </div>
                {doc.approvedDate && (
                  <div className="flex items-center text-gray-600">
                    <FileText size={18} className="mr-2 text-green-500" />
                    <span><strong>Approved:</strong> {new Date(doc.approvedDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => window.open(`${BASE_URL}/${doc.filePath}`)}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center transition"
            >
              <Download size={20} className="mr-2" /> Download Original
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
