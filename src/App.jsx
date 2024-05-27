
import './App.css'
import AnalyticsTable from './components/AnalyticsTable/AnalyticsTable';
import data from "./data/leaderboardData.json"
function App() {
 
  return (
    <>
    <h1 className='heading'>LeaderBoard</h1>
    <AnalyticsTable data = {data}/>
    </>
    
  )
}

export default App
