import "./analyticsTable.css";
import AnalyticsTableHeader from "./AnalyticsTableHeader";

import AnalyticsTableRow from "./AnalyticsTableRow";
const AnalyticsTable = ({ data }) => {
  return (
    <div className="analytics-table">
      <AnalyticsTableHeader />
      <div className="leaderboard-table">
      <div className="analytics-table-col-header-container">
        <span className="col-title">Rank</span>

        <span className="col-title">Name</span>

        <span className="col-title">Calmar Ratio</span>

        <span className="col-title">Overall Profit</span>

        <span className="col-title">Avg. Daily Profit</span>

        <span className="col-title">Win %(Day)</span>

        <span className="col-title">Price (Rs)</span>

        <span className="col-title">Action</span>
      </div>

      <div className="analytics-table-row-container">
        {data.map((rowData, index) => (
          <AnalyticsTableRow key={index} rowData={rowData} />
        ))}
      </div>
      </div>
     
    </div>
  );
};

export default AnalyticsTable;
