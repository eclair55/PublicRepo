import React, { useState, useEffect } from 'react';
import { documentService, sectorService, councilorService, BASE_URL } from '../services/api';
import {
  Search,
  Filter,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  User,
  Tag,
  Grid,
  List as ListIcon,
  X,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const pageSize = 10;

  const [sectors, setSectors] = useState<any[]>([]);
  const [councilors, setCouncilors] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>({
    sectorId: '',
    authorId: '',
    dateFrom: '',
    dateTo: '',
    documentType: '',
    term: '',
    search: '',
    status: isAdmin ? '' : 'Approved'
  });

  useEffect(() => {
    loadSectors();
    loadCouncilors();
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [currentPage]);

  const loadSectors = async () => {
    try {
      const res = await sectorService.getAll();
      setSectors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCouncilors = async () => {
    try {
      const res = await councilorService.getAll();
      setCouncilors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDocuments = async () => {
    try {
      const res = await documentService.getAll({ ...filters, page: currentPage, pageSize });
      // If not admin, only show approved documents (though API should handle this, frontend safety)
      const items = isAdmin ? res.data.items : res.data.items.filter((d: any) => d.status === 'Approved');
      setDocuments(items);
      setTotalItems(res.data.totalItems);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadDocuments();
  };

  const clearFilters = () => {
    setFilters({
      sectorId: '',
      authorId: '',
      dateFrom: '',
      dateTo: '',
      documentType: '',
      term: '',
      search: '',
      status: isAdmin ? '' : 'Approved'
    });
    setCurrentPage(1);
    // Note: useEffect will trigger loadDocuments because we need to force it here too
    setTimeout(() => loadDocuments(), 0);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      Approved: 'bg-green-100 text-green-700 border-green-200',
      Rejected: 'bg-red-100 text-red-700 border-red-200',
      Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Default: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    const style = styles[status as keyof typeof styles] || styles.Pending;
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${style}`}>
        {status || 'Pending'}
      </span>
    );
  };

  return (
    <div className={`${isAdmin ? '' : 'container mx-auto px-4 py-8'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {isAdmin ? 'Document Management' : 'Public Document Repository'}
          </h1>
          <p className="text-gray-500 text-sm">
            {isAdmin
              ? 'Manage, review, and approve government documents.'
              : 'Browse and search through official government ordinances and resolutions.'}
          </p>
        </div>

        {isAdmin && (
          <Link
            to="/admin/upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors shadow-sm"
          >
            <Plus size={20} className="mr-2" /> New Document
          </Link>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by title, description, or keyword..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center px-4 py-2 border rounded-lg font-medium transition-all ${
                isFilterOpen ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter size={18} className="mr-2" /> Filters
            </button>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md">
              Apply
            </button>
            <div className="hidden sm:flex border-l ml-2 pl-2 gap-1">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ListIcon size={20} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid size={20} />
              </button>
            </div>
          </div>
        </form>

        {isFilterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-50 animate-in fade-in slide-in-from-top-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Sector</label>
              <select
                className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={filters.sectorId}
                onChange={(e) => setFilters({...filters, sectorId: e.target.value})}
              >
                <option value="">All Sectors</option>
                {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Author</label>
              <select
                className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={filters.authorId}
                onChange={(e) => setFilters({...filters, authorId: e.target.value})}
              >
                <option value="">All Authors</option>
                {councilors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Type</label>
              <select
                className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={filters.documentType}
                onChange={(e) => setFilters({...filters, documentType: e.target.value})}
              >
                <option value="">All Types</option>
                <option value="Ordinance">Ordinance</option>
                <option value="Resolution">Resolution</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Term</label>
              <input
                type="text"
                placeholder="e.g. 2022-2025"
                className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={filters.term}
                onChange={(e) => setFilters({...filters, term: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">From Date</label>
              <input
                type="date"
                className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">To Date</label>
              <input
                type="date"
                className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
              />
            </div>
            {isAdmin && (
               <div className="space-y-1">
               <label className="text-xs font-bold text-gray-500 uppercase ml-1">Status</label>
               <select
                 className="w-full border border-gray-200 p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                 value={filters.status}
                 onChange={(e) => setFilters({...filters, status: e.target.value})}
               >
                 <option value="">All Statuses</option>
                 <option value="Pending">Pending</option>
                 <option value="Approved">Approved</option>
                 <option value="Rejected">Rejected</option>
               </select>
             </div>
            )}
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full text-gray-500 text-sm font-medium hover:text-blue-600 p-2 transition-colors flex items-center justify-center"
              >
                <X size={14} className="mr-1" /> Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Documents Display */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {documents.map(doc => (
            <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-all group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                   {isAdmin && <StatusBadge status={doc.status} />}
                   <span className="text-xs font-medium text-gray-400">{doc.documentType}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                   {doc.title}
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                   <span className="flex items-center"><Tag size={14} className="mr-1" /> {doc.sector?.name || 'Uncategorized'}</span>
                   <span className="flex items-center"><User size={14} className="mr-1" /> {doc.author?.name || 'Unknown'}</span>
                   <span className="flex items-center"><Calendar size={14} className="mr-1" /> {doc.enactmentDate ? new Date(doc.enactmentDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  to={isAdmin ? `/admin/dashboard` : `/document/${doc.id}`} // Fixed to proper detail view in actual impl
                  onClick={(e) => {
                    if (isAdmin) {
                       // if we are in admin documents, maybe we want a different path or just standard details
                       // standard detail works too
                    }
                  }}
                  className="flex items-center px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all font-medium border border-gray-100"
                >
                  <Eye size={18} className="mr-2" /> View
                </Link>
                <button
                  onClick={() => window.open(`${BASE_URL}/${doc.filePath}`)}
                  className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-medium"
                >
                  <Download size={18} className="mr-2" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map(doc => (
            <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-all group">
               <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                       {doc.documentType}
                    </span>
                    {isAdmin && <StatusBadge status={doc.status} />}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {doc.title}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-500">
                     <p className="flex items-center"><Tag size={14} className="mr-2 shrink-0" /> {doc.sector?.name || 'Uncategorized'}</p>
                     <p className="flex items-center"><User size={14} className="mr-2 shrink-0" /> {doc.author?.name || 'Unknown'}</p>
                     <p className="flex items-center"><Calendar size={14} className="mr-2 shrink-0" /> {doc.enactmentDate ? new Date(doc.enactmentDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
               </div>
               <div className="bg-gray-50 p-4 flex gap-2 border-t border-gray-100">
                  <Link to={`/document/${doc.id}`} className="flex-1 py-2 bg-white text-gray-700 text-center rounded-lg font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center">
                    <Eye size={16} className="mr-2" /> Details
                  </Link>
                  <button onClick={() => window.open(`${BASE_URL}/${doc.filePath}`)} className="flex-1 py-2 bg-blue-600 text-white text-center rounded-lg font-medium text-sm hover:bg-blue-700 transition-all flex items-center justify-center shadow-sm">
                    <Download size={16} className="mr-2" /> Get File
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}

      {documents.length === 0 && (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-20 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
             <FileText size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No documents found</h3>
          <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your search or filters to find what you're looking for.</p>
          <button onClick={clearFilters} className="mt-6 text-blue-600 font-bold hover:underline">Clear all filters</button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo(0,0); }}
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex gap-1">
             {[...Array(totalPages)].map((_, i) => (
               <button
                 key={i}
                 onClick={() => { setCurrentPage(i + 1); window.scrollTo(0,0); }}
                 className={`w-10 h-10 rounded-lg font-medium transition-all ${
                   currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                 }`}
               >
                 {i + 1}
               </button>
             ))}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo(0,0); }}
            className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 disabled:opacity-30 hover:bg-gray-50 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
