import React,{useState,useEffect} from 'react'
import axios from 'axios';
import Plot from 'react-plotly.js';

export const Stock = () => {
  const [stockChartXValues, setStockChartXValues] = useState([]);
  const [stockChartYValues, setStockChartYValues] = useState([]);
  const [error, setError] = useState(false);
  const [value, setValue] = useState('FB');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const API_KEY = (process.env.REACT_APP_API_KEY)
    let API_CALL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${value}&outputsize=compact&apikey=${API_KEY}`;
    let stockChartXValuesFunction = [];
    let stockChartYValuesFunction = [];

    try {
      const response = await axios.get(API_CALL);
      const data = await response.data;
      console.log(data);
      for (let key in data['Time Series (Daily)']) {
        stockChartXValuesFunction.push(key);
        stockChartYValuesFunction.push(
          data['Time Series (Daily)'][key]['1. open']
        );
      }
      setStockChartXValues(stockChartXValuesFunction);
      setStockChartYValues(stockChartYValuesFunction);
    } catch (e) {
      setError(true);
    }
  }

  const buttonSubmit = (e) => {
    e.preventDefault();
    fetchData();
    fetchData(value);
  };
  return (
    <div>
      <h1>Stock Market</h1>
      <form onSubmit={buttonSubmit}>
        <label style={{ color: 'orange', fontSize:'20px' }}>
          Choose a company and press submit <br/>
          <span style={{color:'black', fontSize:'12px'}}>(max 5 requests per min)</span>
          <br />
          <select value={value} onChange={(e) => setValue(e.target.value)}>
            <option value='FB'>Facebook</option>
            <option value='AMZN'>Amazon</option>
            <option value='GOOG'>Google</option>
          </select>
        </label>
         <button type='submit'>submit</button>
      </form>
      {error? <p style={{color:'red', textAlign:'center', fontSize:'3rem', margin:'auto'}}>
        Something went wrong</p>:

      <Plot
        data={[
          {
            x: stockChartXValues,
            y: stockChartYValues,
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'blue' },
          },
        ]}
        layout={{
          width: 800,
          height: 500,
          title: `${value} stock value in USD`,
        }}
      />}
    </div>
  );
};
