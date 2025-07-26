import React, { useState, useEffect } from "react";
import "./index.css";

//Rus

//БЕЗ ПОДСКАЗОК:
//Создайте интерфейс для конвертации валют с загрузкой данных валют из API Frankfurter в state, динамическим отображением options в select, обработкой выбранных валют, ввода суммы, расчётом конвертации через асинхронную функцию с try/catch/finally, отображением результата в UI, проверкой, что сумма больше 0, и состояниями для загрузки и ошибок.

//C ПОДСКАЗКАМИ:
/*
// 1 - Получите массив всех валют из API Frankfurter и запишите его в state.
// 2 - Используя map, динамически создайте options внутри select.
// 3 - Получите значения выбранных валют из обоих select и запишите их в state fromCurrency и toCurrency.
// 4 - Создайте state для записи amount из input. Запишите данные из input в этот state.
// 5 - Создайте вторую асинхронную функцию для получения значения конвертации двух валют. Запишите результат конвертации в новый state - convertedAmount. Покажите результат в интерфейсе.
// 6 - Добавьте в обе функции блоки try/catch/finally. Создайте state для loading (true/false) и error ("Сообщение ошибки").
// 7 - Внедрите логику отображения загрузки и ошибок в интерфейсе.
// 8 - Добавьте проверку, чтобы amount был больше 0.
*/

//Eng

// WITHOUT HINTS:
// Create a currency conversion interface that fetches currency data from the Frankfurter API into the state, dynamically renders options in the select dropdown, processes selected currencies and input amount, performs the conversion using an asynchronous function with try/catch/finally, displays the result in the UI, validates that the amount is greater than 0, and manages loading and error states.

// WITH HINTS:

/*
// 1 - Fetch an array of all currencies from the Frankfurter API and save it to the state.
// 2 - Use the map method to dynamically create <option> elements inside the select dropdown.
// 3 - Get the selected currency values from both select elements and save them to the state variables fromCurrency and toCurrency.
// 4 - Create a state variable to store the amount from the input field and save the input value to this state.
// 5 - Create a second asynchronous function to fetch the conversion rate between the two currencies. Save the conversion result to a new state variable - convertedAmount. Display the result in the UI.
// 6 - Add try/catch/finally blocks to both functions. Create states for loading (true/false) and error ("Error message as a string").
// 7 - Implement the logic for displaying loading indicators and error messages in the UI.
// 8 - Add a validation to ensure that the amount is greater than 0.
*/

//https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD

const API_URL = "https://api.frankfurter.app/latest";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState(null);
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState(1);
  const [converted, setConverted] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function getCurrencies() {
      try {
        const res = await fetch(API_URL);

        const data = await res.json();

        const base = data.base;

        const rates = Object.keys(data.rates);
        setCurrencies([...rates, base]);
      } catch {
        setError("Failed to fetch currencies");
      } finally {
        setIsLoading(false);
      }
    }
    getCurrencies();
  }, []);

  async function convertCurrency() {
    setIsLoading(true);
    try {
      if (!amount || amount <= 0 || !fromCurrency || !toCurrency) {
        setError("Please provide all conversion parameters.");
        return;
      }
      if (fromCurrency === toCurrency) {
        setConverted(Number(amount));
        return;
      }
      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
      );

      const data = await res.json();

      setConverted(data.rates[toCurrency]);
    } catch {
      setError("Failed to convert currencies");
    }
    setIsLoading(false);
    setError(null);
  }

  return (
    <div className="app">
      <h1>Currency Exchange Calculator</h1>

      <div className="converter-container">
        {error && <p className="error"> {error} </p>}

        <div className="input-group">
          <input
            type="number"
            placeholder="Amount"
            className="input-field"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="dropdown"
          >
            {currencies.map((currency) => (
              <option value={currency} key={currency}>
                {currency}
              </option>
            ))}
          </select>
          <span className="arrow">→</span>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="dropdown"
          >
            {currencies.map((currency) => (
              <option value={currency} key={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <button className="convert-button" onClick={() => convertCurrency()}>
          Convert
        </button>
        {isLoading && <p className="loading"> Loading...</p>}

        {converted !== null && !isLoading && (
          <p className="result">
            {amount} {fromCurrency} = {converted.toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
