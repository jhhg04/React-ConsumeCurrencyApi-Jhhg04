import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [exchangeRate, setExchangeRate] = useState(0);
  const [amount, setAmount] = useState(0);
  const [convertAmount, setConvertAmount] = useState(0);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          'https://v6.exchangerate-api.com/v6/5578f53e5dfd610b97368d18/latest/USD'
        );
        const currencyCodes = Object.keys(response.data.conversion_rates);
        setCurrencies(currencyCodes);
        setFromCurrency('USD');
        setToCurrency('EUR');
        setExchangeRate(response.data.conversion_rates['EUR']);
      } catch (error) {
        console.log('Error Fetching Currencies', error);
      }
    };

    fetchCurrencies();
  }, []);

  const handleFromCurrencyChange = (event) => {
    setFromCurrency(event.target.value);
    updateExchangeRate(event.target.value, toCurrency);
  };

  const handleToCurrencyChange = (event) => {
    setToCurrency(event.target.value);
    updateExchangeRate(fromCurrency, event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
    setConvertAmount(event.target.value * exchangeRate);
  };

  const updateExchangeRate = async (from, to) => {
    try {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/5578f53e5dfd610b97368d18/latest/${from}`
      );
      setExchangeRate(response.data.conversion_rates[to]);
      setConvertAmount(amount * response.data.conversion_rates[to]);
    } catch (error) {
      console.log('Error updating Exchange Rate', error);
    }
  };

  return (
    <div className='container'>
      <h2> Currency Converter</h2>
      <div>
        <label>From Currency:</label>
        <select value={fromCurrency} onChange={handleFromCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>To Currency:</label>
        <select value={toCurrency} onChange={handleToCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Amount:</label>
        <input type='number' value={amount} onChange={handleAmountChange} />
      </div>

      <div>
        <label>Converted Amount:</label>
        <input type='text' value={convertAmount} readOnly />
      </div>
    </div>
  );
}

export default App;
