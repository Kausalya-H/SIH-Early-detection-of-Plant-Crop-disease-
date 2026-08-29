import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../services/apiConfig';

interface FarmerCase {
  case_id: string;
  farmer_id: string;
  farmer_name: string;
  crop: string;
  location: string;
  issue: string;
  complaint_count: number;
  severity: string | null;
  status: string;
  submitted_at: string;
}

interface OutbreakAlert {
  location: string;
  issue: string;
  complaint_count: number;
  severity: string;
  headline: string;
  message: string;
}

interface DashboardData {
  total_cases: number;
  total_farmers: number;
  high_risk_issues: number;
  system_status: string;
  farmers: FarmerCase[];
  outbreak_alerts: OutbreakAlert[];
}

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      setError('');

      const response = await fetch(
        `${API_BASE_URL}/admin/dashboard`
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned ${response.status}`
        );
      }

      const result = await response.json();

      console.log('Admin dashboard data:', result);

      setData(result);
    } catch (err) {
      console.error('Admin dashboard error:', err);

      setError(
        'Unable to connect to backend. Make sure FastAPI is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(loadDashboard, 10000);

    return () => clearInterval(interval);
  }, []);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 p-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Admin Dashboard
        </h1>

        <p className="mt-4 text-slate-600">
          Loading farmer disease reports...
        </p>
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error || !data) {
    return (
      <div className="min-h-screen bg-stone-100 p-8">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Admin Dashboard
        </h1>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-xl font-bold text-red-700">
            Unable to connect to backend
          </h2>

          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Backend URL:
            {' '}
            {API_BASE_URL}/admin/dashboard
          </p>

          <button
            onClick={loadDashboard}
            className="mt-5 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN DASHBOARD ---------------- */

  return (
    <div className="min-h-screen bg-stone-100 p-4 sm:p-8">

      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-slate-600">
            Agricultural Disease Monitoring
          </p>
        </div>

        <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
          ● {data.system_status}
        </div>

      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Total Cases
          </p>

          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {data.total_cases}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Total Farmers
          </p>

          <p className="mt-2 text-3xl font-extrabold text-slate-900">
            {data.total_farmers}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            High Risk Issues
          </p>

          <p className="mt-2 text-3xl font-extrabold text-red-600">
            {data.high_risk_issues}
          </p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            System Status
          </p>

          <p className="mt-2 text-xl font-bold text-green-700">
            {data.system_status}
          </p>
        </div>

      </div>

      {/* COMPLAINT ALERT */}

      {data.farmers.some(
        (farmer) => farmer.complaint_count > 3
      ) && (
        <div className="mt-8 rounded-2xl border-2 border-red-300 bg-red-50 p-6 shadow-sm">

          <div className="flex items-start gap-4">

            <div className="text-3xl">
              🚨
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-red-800">
                Disease Outbreak Alert
              </h2>

              <p className="mt-1 text-sm text-red-700">
                One or more disease complaints have exceeded
                the critical threshold of 3 complaints.
              </p>

              <p className="mt-2 font-bold text-red-800">
                Immediate agricultural officer attention required.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* REGIONAL ALERTS */}

      {data.outbreak_alerts.length > 0 && (
        <div className="mt-8">

          <h2 className="mb-4 text-xl font-bold text-slate-900">
            🚨 Regional Disease Alerts
          </h2>

          <div className="space-y-4">

            {data.outbreak_alerts.map(
              (alert, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-red-200 bg-red-50 p-5"
                >

                  <h3 className="text-lg font-bold text-red-800">
                    {alert.headline}
                  </h3>

                  <p className="mt-2 text-sm text-red-700">
                    {alert.message}
                  </p>

                  <p className="mt-3 text-sm font-bold text-red-800">
                    {alert.location}
                    {' • '}
                    {alert.issue}
                    {' • '}
                    {alert.complaint_count}
                    {' complaints'}
                  </p>

                </div>
              )
            )}

          </div>

        </div>
      )}

      {/* FARMER REPORTS */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">

        <div className="border-b border-stone-200 p-6">

          <h2 className="text-xl font-bold text-slate-900">
            Farmer Disease Reports
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Farmer complaints and repeated disease issues
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-stone-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Farmer
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Crop
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Location
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Issue
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Complaints
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Severity
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Status
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-stone-100">

              {data.farmers.map((farmer) => {

                const highRisk =
                  farmer.complaint_count > 3;

                return (
                  <tr
                    key={farmer.case_id}
                    className={
                      highRisk
                        ? 'bg-red-50 hover:bg-red-100'
                        : 'hover:bg-stone-50'
                    }
                  >

                    {/* FARMER */}

                    <td className="px-6 py-4">

                      <p className="font-semibold text-slate-900">
                        {farmer.farmer_name}
                      </p>

                      <p className="text-xs text-slate-400">
                        ID: {farmer.farmer_id}
                      </p>

                    </td>

                    {/* CROP */}

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {farmer.crop || '—'}
                    </td>

                    {/* LOCATION */}

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {farmer.location || '—'}
                    </td>

                    {/* ISSUE */}

                    <td className="px-6 py-4">

                      <span className="font-semibold text-slate-800">
                        {farmer.issue
                          ? farmer.issue
                              .replace(/_/g, ' ')
                              .replace(/\b\w/g, (c) =>
                                c.toUpperCase()
                              )
                          : 'Pending Diagnosis'}
                      </span>

                    </td>

                    {/* COMPLAINT COUNT */}

                    <td className="px-6 py-4">

                      <div className="flex items-center gap-2">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                            highRisk
                              ? 'bg-red-200 text-red-800'
                              : 'bg-stone-100 text-slate-700'
                          }`}
                        >
                          {farmer.complaint_count}
                        </span>

                        {highRisk && (
                          <span className="text-xs font-bold text-red-700">
                            🚨 ALERT
                          </span>
                        )}

                      </div>

                    </td>

                    {/* SEVERITY */}

                    <td className="px-6 py-4">

                      {farmer.severity || '—'}

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          farmer.status ===
                          'SCIENTIST_VERIFIED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >

                        {farmer.status
                          ?.replace(/_/g, ' ')
                          .replace(/\b\w/g, (c) =>
                            c.toUpperCase()
                          )}

                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {/* NO DATA */}

        {data.farmers.length === 0 && (
          <div className="p-10 text-center text-slate-500">
            No farmer disease reports found.
          </div>
        )}

      </div>

    </div>
  );
};

export default AdminDashboardPage;