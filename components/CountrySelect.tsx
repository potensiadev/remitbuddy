import React from "react";

const COUNTRIES = [
  { name: "Vietnam", currency: "VND" },
  { name: "Philippines", currency: "PHP" },
  { name: "Cambodia", currency: "KHR" },
  { name: "Nepal", currency: "NPR" },
  { name: "Myanmar", currency: "MMK" },
  { name: "Thailand", currency: "THB" },
  { name: "Uzbekistan", currency: "UZS" },
  { name: "Indonesia", currency: "IDR" },
  { name: "Sri Lanka", currency: "LKR" },
  { name: "Bangladesh", currency: "BDT" },
];

type Props = {
  value: string;
  onChange: (country: string) => void;
};

export default function CountrySelect({ value, onChange }: Props) {
  return (
    <select
      className="w-full rounded-lg border px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select Country</option>
      {COUNTRIES.map((c) => (
        <option key={c.name} value={c.name}>
          {c.name} ({c.currency})
        </option>
      ))}
    </select>
  );
}

export function getCurrencyByCountry(country: string) {
  return COUNTRIES.find((c) => c.name === country)?.currency || "";
}
