export default function ProviderResultCard({ provider, best, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border ${
        best ? "border-green-500 bg-[#F8FFF6] shadow-lg" : "border-gray-200 bg-white"
      } flex flex-col gap-1 cursor-pointer hover:ring-2 hover:ring-blue-400`}
    >
      <div className="flex items-center gap-2">
        {best && <span className="text-xl">⭐</span>}
        <img src={provider.logo} alt={provider.provider} className="h-5" />
        <span className="font-semibold">{provider.provider}</span>
        <span className="ml-auto text-gray-500 text-xs">{provider.country}</span>
      </div>
      <div className="flex gap-2 text-base mt-1">
        <span>
          <b className={`text-lg ${best ? "text-red-600" : "text-black"}`}>
            {provider.receiveAmount} {provider.currency}
          </b>
        </span>
        <span className="ml-3 text-xs text-gray-500">(Fee: {provider.fee} KRW)</span>
      </div>
      <div className="text-xs text-gray-500">
        Exchange Rate: 100 {provider.currency} = {provider.exchangeRate} KRW
      </div>
      <div className="text-xs text-green-700 mt-1">
        🌟 Total You Pay: {provider.totalPay} KRW
      </div>
    </div>
  );
}
