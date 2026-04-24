import React, { useState, useEffect } from 'react';
import { analyticsService, documentService } from '../services/api';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Link } from 'react-router-dom';
import {
  Plus,
  Users,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Eye,
  Check,
  X
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [sectorStats, setSectorStats] = useState([]);
  const [topAuthor, setTopAuthor] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const sectorsRes = await analyticsService.getSectorCount();
      setSectorStats(sectorsRes.data);

      const authorRes = await analyticsService.getTopAuthor();
      setTopAuthor(authorRes.data);

      const docsRes = await documentService.getAll({ pageSize: 5 });
      setRecentDocs(docsRes.data.items);

      // In a real app, we'd have an endpoint for these counts
      // For now, let's fetch more docs to get a sense of distribution or mock it
      const allDocsRes = await documentService.getAll({ pageSize: 100 });
      const items = allDocsRes.data.items;
      setCounts({
        total: allDocsRes.data.totalItems,
        pending: items.filter(d => d.status === 'Pending' || !d.status).length,
        approved: items.filter(d => d.status === 'Approved').length,
        rejected: items.filter(d => d.status === 'Rejected').length
      });
    } catch (error) {
      console.error("Error loading dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  const sectorChartData = {
    labels: sectorStats.map(s => s.sector),
    datasets: [
      {
        label: 'Documents',
        data: sectorStats.map(s => s.count),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const statusChartData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [counts.approved, counts.pending, counts.rejected],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',
          'rgba(234, 179, 8, 0.6)',
          'rgba(239, 68, 68, 0.6)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleApprove = async (id) => {
    await documentService.approve(id);
    loadStats();
  };

  const KpiCard = ({ title, value, icon, color, bgColor }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
      <div className={`${bgColor} p-3 rounded-lg mr-4`}>
        {React.cloneElement(icon, { className: color, size: 24 })}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back to the document repository management.</p>
        </div>
        <Link
          to="/admin/upload"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors shadow-sm"
        >
          <Plus size={20} className="mr-2" /> Upload New Document
        </Link>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Documents"
          value={counts.total}
          icon={<FileText />}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <KpiCard
          title="Pending Approval"
          value={counts.pending}
          icon={<Clock />}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
        />
        <KpiCard
          title="Approved"
          value={counts.approved}
          icon={<CheckCircle />}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <KpiCard
          title="Rejected"
          value={counts.rejected}
          icon={<XCircle />}
          color="text-red-600"
          bgColor="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800">Documents per Sector</h2>
            <div className="bg-gray-50 p-1 rounded-md">
               <TrendingUp size={20} className="text-gray-400" />
            </div>
          </div>
          <div className="h-64">
            <Bar
              data={sectorChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } }
              }}
            />
          </div>
        </div>

        {/* Top Author Widget */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Top Author</h2>
          {topAuthor ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 text-2xl font-bold">
                {topAuthor.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{topAuthor.name}</h3>
              <p className="text-gray-500 mb-4">{topAuthor.count} Documents Published</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                View Profile
              </button>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Status Distribution</h2>
          <div className="h-64 flex items-center justify-center">
            <Pie
              data={statusChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
              }}
            />
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Recent Submissions</h2>
            <Link to="/admin/documents" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 font-semibold">Title</th>
                  <th className="px-6 py-3 font-semibold">Sector</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 truncate max-w-[200px]">{doc.title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {doc.sector?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        doc.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        doc.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {doc.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link to={`/document/${doc.id}`} className="p-1 hover:bg-blue-50 text-blue-600 rounded" title="View">
                          <Eye size={18} />
                        </Link>
                        {doc.status !== 'Approved' && (
                          <button
                            onClick={() => handleApprove(doc.id)}
                            className="p-1 hover:bg-green-50 text-green-600 rounded"
                            title="Approve"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        {doc.status !== 'Rejected' && (
                          <button className="p-1 hover:bg-red-50 text-red-600 rounded" title="Reject">
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {recentDocs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                      No recent submissions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
