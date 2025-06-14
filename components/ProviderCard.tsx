import React from "react";

type Provider = {
  provider: string;
  exchange_rate: number;
  fee: number;
  recipient_gets: number;
  transfer_method: string;
  link: string;
};

type Props = {
  data: Provider;
  isBest?: boolean;
  onClick: () => void;
};

export default function ProviderCard({ data, isBest, onClick }: Props) {
  return (
    <div
      className={`rounded-xl border p-4 mb-3 shadow-sm bg-white flex flex-col ${
        isBest ? "border-blue-500 ring-2 ring-blue-300" : "border-gray-200"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-center">
        <div className="font-bold text-lg">{data.provider}</div>
        {isBest && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
            Best Rate
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <div>
          <span className="font-semibold">Receive:</span>{" "}
          <span className="text-blue-600 font-bold">
            {data.recipient_gets.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div>
          <span className="font-semibold">Fee:</span>{" "}
          {data.fee.toLocaleString()} KRW
        </div>
        <div>
          <span className="font-semibold">Exchange Rate:</span>{" "}
          {data.exchange_rate}
        </div>
        <div>
          <span className="font-semibold">Method:</span> {data.transfer_method}
        </div>
      </div>
      <a
        href={data.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 text-blue-500 underline text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        Go to Provider
      </a>
    </div>
  );
}
