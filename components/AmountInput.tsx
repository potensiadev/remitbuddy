import React from "react";

type AmountInputProps = {
  value: number;
  onChange: (val: number) => void;
  currency: string;
};

export default function AmountInput({
  value,
  onChange,
  currency,
}: AmountInputProps) {
  return (
    <input
      type="number"
      min={1}
      className="w-full rounded-lg border px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder={`Enter amount (${currency})`}
    />
  );
}
