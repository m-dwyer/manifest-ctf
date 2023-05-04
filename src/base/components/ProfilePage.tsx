import { useQueryClient } from "@tanstack/react-query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useFetchProfileOverview } from "../queries/profile";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
};

const ProfilePage = () => {
  const fetchProfileOverview = useFetchProfileOverview();

  const chartData = {
    labels: fetchProfileOverview.data?.challengeAttempts.map(
      (c) => c.completed
    ),
    datasets: [
      {
        label: "Points",
        data: fetchProfileOverview.data?.challengeAttempts.map(
          (c) => c.points_scored
        ),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <section>
      <h1>User Progress</h1>
      <Line options={options} data={chartData} />
      <div className="flex-initial card w-96 bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="card-title">
            Points
            <span className="tooltip" data-tip="Points"></span>
          </div>
          <p>description here</p>
          <div>total points</div>
        </div>
      </div>
      id:
      {fetchProfileOverview.data?.challengeAttempts.map((c) => (
        <div>{c.points_scored}</div>
      ))}
    </section>
  );
};

export default ProfilePage;
