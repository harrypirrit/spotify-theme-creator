import React, { useState } from "react";
import { generateTheme } from "../generateTheme";
import saveAs from "file-saver";
import JSZip from "jszip";

export interface ThemeOptions {
  background: string;
  cards: string;
  textButtons: string;
  notifications: string;
}

interface ThemeOptionProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

interface ThemeOptionsPaneProps {
  isOpen: boolean;
  themeOptions: ThemeOptions;
  onThemeChange: (option: keyof ThemeOptions, value: string) => void;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string) => void;
}

export const defaultTheme: ThemeOptions = {
  background: "#030303",
  cards: "#272727",
  textButtons: "#FFFFFF",
  notifications: "#66D36E",
};

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

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          What would you like to name your theme?
        </h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-4"
          placeholder="Enter theme title"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (title.trim()) {
                onConfirm(title);
                setTitle("");
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export const ThemeOptionsPane: React.FC<ThemeOptionsPaneProps> = ({
  isOpen,
  themeOptions,
  onThemeChange,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateTheme = async (
    title: string,
    themeOptions: ThemeOptions
  ) => {
    // Generate the theme files
    const { ini, css } = generateTheme(title, themeOptions);
    const zip = new JSZip();
    zip.file("color.ini", ini);
    zip.file("user.css", css);

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${title.replace(/\s+/g, "_")}.zip`);
  };

  const handleGenerateThemeClick = (title: string) => {
    handleGenerateTheme(title, themeOptions);
    setIsModalOpen(false);
  };

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
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Generate Theme
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleGenerateThemeClick}
      />
    </div>
  );
};
