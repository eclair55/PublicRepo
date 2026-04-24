import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentService, BASE_URL } from '../services/api';
import {
  Download,
  Calendar,
  User,
  Tag,
  FileText,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Loader2,
  Info
} from 'lucide-react';

const DocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadDocument();
  }, [id]);

  const loadDocument = async () => {
    try {
      const res = await documentService.getById(id);
      setDoc(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await documentService.approve(doc.id);
      loadDocument();
    } catch (err) {
      console.error('Approval failed', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500 font-medium">Loading document details...</p>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <XCircle size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Document Not Found</h2>
        <p className="text-gray-600 mb-8">The document you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={20} className="mr-1" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                      doc.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      doc.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {doc.status || 'Pending'}
                    </span>
                    <span className="text-gray-400 text-xs font-medium">ID: {doc.id}</span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 leading-tight">{doc.title}</h1>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(`${BASE_URL}/${doc.filePath}`)}
                    className="p-2 bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                    title="Open in new tab"
                  >
                    <ExternalLink size={20} />
                  </button>
                  <button
                    onClick={() => window.open(`${BASE_URL}/${doc.filePath}`)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all shadow-md"
                  >
                    <Download size={18} className="mr-2" /> Download
                  </button>
                </div>
              </div>

              <div className="prose prose-blue max-w-none mb-10">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {doc.description || 'No description provided for this document.'}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <FileText size={20} className="mr-2 text-blue-600" /> Document Preview
                  </h3>
                  <span className="text-xs text-gray-400 font-medium italic">Showing first few pages</span>
                </div>
                {doc.filePath.toLowerCase().endsWith('.pdf') ? (
                  <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 aspect-[3/4] relative">
                    <iframe
                      src={`${BASE_URL}/${doc.filePath}#toolbar=0&navpanes=0&scrollbar=0`}
                      className="w-full h-full"
                      title="PDF Preview"
                    ></iframe>
                  </div>
                ) : (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-12 text-center rounded-xl">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <FileText size={32} />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">Preview not available</h4>
                    <p className="text-gray-500 mb-6 max-w-xs mx-auto">This file format does not support in-browser previewing. Please download the file to view its content.</p>
                    <button
                      onClick={() => window.open(`${BASE_URL}/${doc.filePath}`)}
                      className="inline-flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
                    >
                      <Download size={18} className="mr-2" /> Download Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center uppercase text-xs tracking-wider">
                <Info size={16} className="mr-2 text-blue-500" /> Meta Information
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase mb-1">Document Type</span>
                <span className="text-gray-800 font-medium flex items-center">
                  <FileText size={16} className="mr-2 text-gray-400" /> {doc.documentType}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase mb-1">Sector</span>
                <span className="text-gray-800 font-medium flex items-center">
                  <Tag size={16} className="mr-2 text-gray-400" /> {doc.sector?.name || 'Uncategorized'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase mb-1">Author</span>
                <span className="text-gray-800 font-medium flex items-center">
                  <User size={16} className="mr-2 text-gray-400" /> {doc.author?.name || 'Unknown'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase mb-1">Enactment Date</span>
                <span className="text-gray-800 font-medium flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  {doc.enactmentDate ? new Date(doc.enactmentDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase mb-1">Term Period</span>
                <span className="text-gray-800 font-medium">
                  {doc.term || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center uppercase text-xs tracking-wider">
                <CheckCircle size={16} className="mr-2 text-blue-500" /> Status & Actions
              </h3>
            </div>
            <div className="p-6">
              {doc.status === 'Approved' ? (
                <div className="space-y-4">
                  <div className="flex items-start bg-green-50 p-4 rounded-lg">
                    <CheckCircle className="text-green-600 mr-3 shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-bold text-green-800">Approved</p>
                      <p className="text-xs text-green-700 mt-1">This document is visible to the public.</p>
                      {doc.approvedDate && (
                        <p className="text-[10px] text-green-600 mt-2 font-medium">Approved on {new Date(doc.approvedDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start bg-yellow-50 p-4 rounded-lg">
                    <Clock className="text-yellow-600 mr-3 shrink-0" size={20} />
                    <div>
                      <p className="text-sm font-bold text-yellow-800">Pending Review</p>
                      <p className="text-xs text-yellow-700 mt-1">This document requires approval before it becomes public.</p>
                    </div>
                  </div>

                  {location.pathname.includes('/admin') && (
                    <button
                      onClick={handleApprove}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center transition-all shadow-sm"
                    >
                      <CheckCircle size={20} className="mr-2" /> Approve Document
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
