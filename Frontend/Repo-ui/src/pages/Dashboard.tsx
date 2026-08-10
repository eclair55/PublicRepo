import React, { useState, useEffect } from 'react';
import { analyticsService, documentService } from '../services/api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Link } from 'react-router-dom';
import { Plus, Users, MapPin, FileText } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [sectorStats, setSectorStats] = useState([]);
  const [topAuthor, setTopAuthor] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const sectorsRes = await analyticsService.getSectorCount();
    setSectorStats(sectorsRes.data);

    const authorRes = await analyticsService.getTopAuthor();
    setTopAuthor(authorRes.data);

    const docsRes = await documentService.getAll({ pageSize: 5 });
    setRecentDocs(docsRes.data.items);
  };

  const chartData = {
    labels: sectorStats.map(s => s.sector),
    datasets: [
      {
        label: 'Documents per Sector',
        data: sectorStats.map(s => s.count),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Link to="/admin/upload" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center">
          <Plus size={40} className="text-blue-600 mb-2" />
          <span className="font-semibold">Upload Document</span>
        </Link>
        <Link to="/admin/sectors" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center">
          <MapPin size={40} className="text-green-600 mb-2" />
          <span className="font-semibold">Manage Sectors</span>
        </Link>
        <Link to="/admin/councilors" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center">
          <Users size={40} className="text-purple-600 mb-2" />
          <span className="font-semibold">Manage Councilors</span>
        </Link>
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Top Author</h3>
          {topAuthor ? (
            <div>
              <p className="text-2xl font-bold">{topAuthor.name}</p>
              <p>{topAuthor.count} Documents</p>
            </div>
          ) : (
            <p>N/A</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Documents per Sector</h2>
          <Bar data={chartData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Submissions</h2>
          <div className="space-y-4">
            {recentDocs.map(doc => (
              <div key={doc.id} className="border-b pb-2 flex justify-between items-center">
                <div>
                  <p className="font-medium">{doc.title}</p>
                  <p className="text-sm text-gray-500">{doc.status || 'Pending'}</p>
                </div>
                {doc.status !== 'Approved' && (
                  <button
                    onClick={async () => {
                      await documentService.approve(doc.id);
                      loadStats();
                    }}
                    className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded"
                  >
                    Approve
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
