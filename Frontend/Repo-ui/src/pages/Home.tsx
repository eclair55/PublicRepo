import React, { useState, useEffect } from 'react';
import { documentService, sectorService, councilorService, BASE_URL } from '../services/api';
import { Search, Filter, Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [documents, setDocuments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [sectors, setSectors] = useState([]);
  const [councilors, setCouncilors] = useState([]);
  const [filters, setFilters] = useState<any>({
    sectorId: '',
    authorId: '',
    dateFrom: '',
    dateTo: '',
    documentType: '',
    term: '',
    search: ''
  });

  useEffect(() => {
    loadSectors();
    loadCouncilors();
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [currentPage]);

  const loadSectors = async () => {
    const res = await sectorService.getAll();
    setSectors(res.data);
  };

  const loadCouncilors = async () => {
    const res = await councilorService.getAll();
    setCouncilors(res.data);
  };

  const loadDocuments = async () => {
    const res = await documentService.getAll({ ...filters, page: currentPage, pageSize });
    setDocuments(res.data.items);
    setTotalItems(res.data.totalItems);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (filters.search) {
      const res = await documentService.search(filters.search);
      setDocuments(res.data);
    } else {
      loadDocuments();
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    loadDocuments();
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Government Documents</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by title or description..."
            className="flex-1 border p-2 rounded"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
            <Search size={18} className="mr-2" /> Search
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <select
            className="border p-2 rounded"
            value={filters.sectorId}
            onChange={(e) => setFilters({...filters, sectorId: e.target.value})}
          >
            <option value="">All Sectors</option>
            {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select
            className="border p-2 rounded"
            value={filters.authorId}
            onChange={(e) => setFilters({...filters, authorId: e.target.value})}
          >
            <option value="">All Authors</option>
            {councilors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            className="border p-2 rounded"
            value={filters.documentType}
            onChange={(e) => setFilters({...filters, documentType: e.target.value})}
          >
            <option value="">All Types</option>
            <option value="Ordinance">Ordinance</option>
            <option value="Resolution">Resolution</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            placeholder="Term (e.g. 2022-2025)"
            className="border p-2 rounded"
            value={filters.term}
            onChange={(e) => setFilters({...filters, term: e.target.value})}
          />
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">From</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={filters.dateFrom}
              onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">To</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={filters.dateTo}
              onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-1 flex items-end">
            <button onClick={applyFilters} className="w-full bg-gray-200 px-4 py-2 rounded flex items-center justify-center hover:bg-gray-300">
              <Filter size={18} className="mr-2" /> Apply Filters
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {documents.map(doc => (
          <div key={doc.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{doc.title}</h2>
              <p className="text-gray-600">{doc.documentType} | {doc.sector?.name} | {doc.author?.name}</p>
              <p className="text-sm text-gray-400">Enacted: {doc.enactmentDate ? new Date(doc.enactmentDate).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/document/${doc.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                <Eye size={20} />
              </Link>
              <button
                onClick={() => window.open(`${BASE_URL}/${doc.filePath}`)}
                className="p-2 text-green-600 hover:bg-green-50 rounded"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        ))}
        {documents.length === 0 && <p className="text-center text-gray-500 py-10">No documents found.</p>}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 rounded border disabled:opacity-50 hover:bg-gray-100"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-2 rounded border disabled:opacity-50 hover:bg-gray-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
