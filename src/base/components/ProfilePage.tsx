import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeSeriesScale,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useFetchProfileOverview } from "../queries/profile";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
};

const ProfilePage = () => {
  const [period, setPeriod] = useState("1W");
  const fetchProfileOverview = useFetchProfileOverview({ period: period });

  if (fetchProfileOverview.data) {
    Object.entries(fetchProfileOverview.data.attemptsByPeriod).map(
      ([key]) => key
    );
  }

  const chartData = {
    labels: Object.entries(
      fetchProfileOverview?.data?.attemptsByPeriod || []
    ).map(([key]) => key),
    datasets: [
      {
        label: "Total points",
        data: Object.entries(
          fetchProfileOverview?.data?.attemptsByPeriod || []
        ).reduce((accum, currentVal, index) => {
          const [, val] = currentVal;
          accum[index] = (accum[index - 1] || 0) + val;
          return accum;
        }, [] as Array<number>),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Points",
        data: Object.entries(
          fetchProfileOverview?.data?.attemptsByPeriod || []
        ).map(([, val]) => val),
        borderColor: "rgb(120, 120, 255)",
        backgroundColor: "rgba(120, 99, 255, 0.5)",
      },
    ],
  };

  return (
    <section>
      <h1>User Progress</h1>
      <Line options={options} data={chartData} />
      <button className={`btn`} onClick={() => setPeriod("1W")}>
        1W
      </button>
      <button className={`btn`} onClick={() => setPeriod("1M")}>
        1M
      </button>
      <button className={`btn`} onClick={() => setPeriod("3M")}>
        3M
      </button>
      <button className={`btn`} onClick={() => setPeriod("1Y")}>
        1Y
      </button>
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
    </section>
  );
};

export default ProfilePage;
