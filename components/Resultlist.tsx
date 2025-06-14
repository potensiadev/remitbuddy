import React from "react";
import ProviderCard from "./ProviderCard";

type Provider = {
  provider: string;
  exchange_rate: number;
  fee: number;
  recipient_gets: number;
  transfer_method: string;
  link: string;
};

type Props = {
  results: Provider[];
  bestProvider: Provider;
  onProviderClick: (provider: string) => void;
};

export default function ResultList({
  results,
  bestProvider,
  onProviderClick,
}: Props) {
  return (
    <div className="mt-6">
      {results
        .sort((a, b) => b.recipient_gets - a.recipient_gets)
        .map((p) => (
          <ProviderCard
            key={p.provider}
            data={p}
            isBest={p.provider === bestProvider.provider}
            onClick={() => onProviderClick(p.provider)}
          />
        ))}
    </div>
  );
}
