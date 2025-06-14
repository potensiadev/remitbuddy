import { useState, useEffect } from "react";

export default function SendHome() {
  const [amount, setAmount] = useState(1000000);
  const [country, setCountry] = useState({ name: "Vietnam", code: "VND" });
  const [allQuotes, setAllQuotes] = useState([]);
  const [bestProvider, setBestProvider] = useState(null);
  const [loading, setLoading] = useState(false);

  const countries = [
    { name: "Vietnam", code: "VND" },
    { name: "Philippines", code: "PHP" },
    { name: "Cambodia", code: "KHR" },
    { name: "Nepal", code: "NPR" },
    { name: "Myanmar", code: "MMK" },
    { name: "Thailand", code: "THB" },
    { name: "Uzbekistan", code: "UZS" },
    { name: "Indonesia", code: "IDR" },
    { name: "Sri Lanka", code: "LKR" },
    { name: "Bangladesh", code: "BDT" },
  ];

  const updateBestProvider = (quotes) => {
    if (!quotes.length) return;
    const best = quotes.reduce((prev, curr) =>
      prev.recipient_gets > curr.recipient_gets ? prev : curr
    );
    setBestProvider(best);
  };

  const handleFetchQuotes = async () => {
    setLoading(true);
    setAllQuotes([]);
    setBestProvider(null);

    try {
      const fastRes = await fetch(
        `/api/getRemittanceQuote?mode=fast&receive_country=${country.name}&receive_currency=${country.code}&send_amount=${amount}&send_currency=KRW`
      );
      const fastData = await fastRes.json();
      setAllQuotes(fastData.results);
      updateBestProvider(fastData.results);

      // Start slow fetch
      const slowResPromise = fetch(
        `/api/getRemittanceQuote?mode=slow&receive_country=${country.name}&receive_currency=${country.code}&send_amount=${amount}&send_currency=KRW`
      ).then((res) => res.json());

      // Set timeout for slow fetch
      const timeout = new Promise((resolve) =>
        setTimeout(() => resolve(null), 4000)
      );

      const slowData = await Promise.race([slowResPromise, timeout]);
      if (slowData && slowData.results) {
        const merged = [...fastData.results, ...slowData.results];
        setAllQuotes(merged);
        updateBestProvider(merged);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">How much should your family receive?</h1>
        <div className="flex items-center mb-4">
          <input
            type="number"
            className="border rounded-l px-4 py-2 w-full"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            className="border rounded-r px-4 py-2"
            value={country.code}
            onChange={(e) =>
              setCountry(countries.find((c) => c.code === e.target.value))
            }
          >
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold w-full py-3 rounded-xl"
          onClick={handleFetchQuotes}
          disabled={loading}
        >
          {loading ? "Fetching..." : "Find out the Best Rate"}
        </button>

        {bestProvider && (
          <div className="mt-8 bg-yellow-100 p-4 rounded-lg shadow-inner">
            <h2 className="font-bold text-lg mb-2">Best Rate to {country.name}</h2>
            <div className="space-y-1">
              <div><strong>Provider:</strong> {bestProvider.provider}</div>
              <div><strong>Exchange Rate:</strong> {bestProvider.exchange_rate}</div>
              <div><strong>Fee:</strong> {bestProvider.fee} KRW</div>
              <div><strong>Recipient Gets:</strong> {bestProvider.recipient_gets}</div>
            </div>
          </div>
        )}

        <div className="mt-6">
          {allQuotes.length > 0 && (
            <h3 className="font-bold mb-2">Other Options</h3>
          )}
          <ul className="space-y-4">
            {allQuotes.map((quote, idx) => (
              <li
                key={idx}
                className="p-4 bg-gray-50 rounded-lg shadow border hover:bg-gray-100"
              >
                <div className="font-semibold">{quote.provider}</div>
                <div>Exchange Rate: {quote.exchange_rate}</div>
                <div>Fee: {quote.fee} KRW</div>
                <div>Recipient Gets: {quote.recipient_gets}</div>
                <a
                  href={quote.link}
                  target="_blank"
                  className="text-blue-600 underline text-sm mt-2 inline-block"
                  rel="noopener noreferrer"
                >
                  Go to Provider
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
