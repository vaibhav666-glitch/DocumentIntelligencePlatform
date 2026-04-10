// components/MultiCheckbox.tsx

import React from "react";

interface Option {
  label: string;
  value: string;
}

interface MultiCheckboxProps {
  label?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

const MultiCheckbox: React.FC<MultiCheckboxProps> = ({
  label,
  options,
  selectedValues,
  onChange,
}) => {
  const handleChange = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-medium mb-2">{label}</label>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedValues.includes(opt.value)}
              onChange={() => handleChange(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default MultiCheckbox;