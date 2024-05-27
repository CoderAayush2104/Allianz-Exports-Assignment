import UpArrow from "../../assets/UpArrow.svg"

const AnalyticsTableRow = ({ rowData }) => {
  return (
    <div className="analytics-row">
      
      <span className="analytics-cell">
        {rowData.Rank}
      </span>
      <span className="analytics-cell">
        {rowData.Name}
      
      </span>
      <span className="analytics-cell">
        <img src={UpArrow}/>&nbsp;
        {rowData.Calmar_Ratio}
      </span>
      <span className={`analytics-cell ${rowData.Overall_Profit > 0 ? 'green' : 'red'} profit`}>
        {rowData.Overall_Profit}
        <span className="indicator">{rowData.Overall_Profit > 0 ? `▲` : `▼`}</span>
        
 
      </span>
      <span className={`analytics-cell ${rowData.Avg_Daily_Profit > 0 ? 'green' : 'red'} profit`}>
        {rowData.Avg_Daily_Profit}
        <span className="indicator">{rowData.Avg_Daily_Profit> 0 ? `▲` : `▼`}</span>
        
      
      </span>
      <span className="analytics-cell">
        {rowData.Win}
    
      </span>
      <span className="analytics-cell">
        {rowData.Price ?? '-'}
    
      </span>
      <span className="analytics-cell">
        {rowData.Action}
    
      </span>

    </div>
  );
};

export default AnalyticsTableRow;
