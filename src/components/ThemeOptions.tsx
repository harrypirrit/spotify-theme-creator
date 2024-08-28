import React from "react";

export interface ThemeOptions {
  background: string;
  cards: string;
  textButtons: string;
  notifications: string;
}

export const defaultTheme: ThemeOptions = {
  background: "#030303",
  cards: "#272727",
  textButtons: "#FFFFFF",
  notifications: "#66D36E",
};

interface ThemeOptionProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({
  label,
  value,
  onChange,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={handleInputChange}
            className="absolute inset-0 opacity-0 w-8 h-8 cursor-pointer"
          />
          <div
            className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
            style={{ backgroundColor: value }}
          ></div>
        </div>
      </div>
    </div>
  );
};

interface ThemeOptionsPaneProps {
  isOpen: boolean;
  themeOptions: ThemeOptions;
  onThemeChange: (option: keyof ThemeOptions, value: string) => void;
}

export const ThemeOptionsPane: React.FC<ThemeOptionsPaneProps> = ({
  isOpen,
  themeOptions,
  onThemeChange,
}) => {
  return (
    <div
      className={`${
        isOpen ? "w-[19.17%]" : "w-0"
      } bg-gray-100 transition-all duration-300 ease-in-out overflow-hidden`}
    >
      <div className="p-4 pl-8">
        <h2 className="font-semibold mb-6 text-lg">Theme Options</h2>
        {(Object.entries(themeOptions) as [keyof ThemeOptions, string][]).map(
          ([key, value]) => (
            <ThemeOption
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={value}
              onChange={(newValue) => onThemeChange(key, newValue)}
            />
          )
        )}
      </div>
    </div>
  );
};
