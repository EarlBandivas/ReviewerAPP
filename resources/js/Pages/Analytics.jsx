import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export default function Analytics({
  subscriptionsByPlan,
  monthlyGrowth,
  tenantStatus,
  stats,
}) {
  // Prepare data for subscription plan chart
  const planChartData = {
    labels: subscriptionsByPlan.map((item) => item.plan_name),
    datasets: [
      {
        label: 'Subscriptions by Plan',
        data: subscriptionsByPlan.map((item) => item.total),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  // Prepare data for monthly growth chart
  const growthChartData = {
    labels: monthlyGrowth.map((item) => item.month),
    datasets: [
      {
        label: 'Monthly Subscription Growth',
        data: monthlyGrowth.map((item) => item.total),
        backgroundColor: '#36A2EB',
      },
    ],
  };

  // Prepare data for tenant status chart
  const statusChartData = {
    labels: tenantStatus.map((item) => item.status),
    datasets: [
      {
        data: tenantStatus.map((item) => item.total),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <AuthenticatedLayout>
      <Head title="Analytics" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Total Revenue</div>
                <div className="stat-value">${stats.totalRevenue}</div>
              </div>
            </div>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Active Subscriptions</div>
                <div className="stat-value">{stats.activeSubscriptions}</div>
              </div>
            </div>
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Total Tenants</div>
                <div className="stat-value">{stats.totalTenants}</div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Subscriptions by Plan</h2>
                <Pie data={planChartData} />
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Monthly Growth</h2>
                <Bar
                  data={growthChartData}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
