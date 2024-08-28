import React, { useState } from "react";
import { ThemeOptionsPane, ThemeOptions, defaultTheme } from "./ThemeOptions";

const useTheme = () => {
  const [themeOptions, setThemeOptions] = useState<ThemeOptions>(defaultTheme);

  const handleThemeOptionChange = (
    option: keyof ThemeOptions,
    value: string
  ) => {
    setThemeOptions((prev) => ({ ...prev, [option]: value }));
  };

  return { themeOptions, handleThemeOptionChange };
};

const ContentLayout: React.FC = () => {
  const [isLeftPaneOpen, setIsLeftPaneOpen] = useState(true);
  const [isRightPaneOpen, setIsRightPaneOpen] = useState(false);
  const { themeOptions, handleThemeOptionChange } = useTheme();

  const getMiddlePaneWidth = () => {
    let width = 100;
    if (isLeftPaneOpen) width -= 19.17;
    if (isRightPaneOpen) width -= 24.96;
    return `${width}%`;
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] relative">
      {/* (Theme Options pane) */}
      <ThemeOptionsPane
        isOpen={isLeftPaneOpen}
        themeOptions={themeOptions}
        onThemeChange={handleThemeOptionChange}
      />

      <button
        onClick={() => setIsLeftPaneOpen(!isLeftPaneOpen)}
        className="absolute top-2 left-0 z-10 bg-blue-500 text-white px-2 py-1 rounded-r"
      >
        {isLeftPaneOpen ? "←" : "→"}
      </button>

      {/* (Theme Preview pane) */}
      <div
        style={{ width: getMiddlePaneWidth() }}
        className="bg-white p-5 transition-all duration-300 ease-in-out overflow-auto flex flex-col items-center"
      >
        <div className="w-full max-w-3xl">
          <h2 className="font-semibold mb-4 text-center">Theme Preview</h2>
        </div>
      </div>

      {/* (Album Search pane) */}
      <div
        className={`${
          isRightPaneOpen ? "w-[24.96%]" : "w-0"
        } bg-gray-100 transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="p-4 pr-8">
          <h2 className="font-semibold mb-4">Album Search</h2>
        </div>
      </div>

      <button
        onClick={() => setIsRightPaneOpen(!isRightPaneOpen)}
        className="absolute top-2 right-0 z-10 bg-blue-500 text-white px-2 py-1 rounded-l"
      >
        {isRightPaneOpen ? "→" : "←"}
      </button>
    </div>
  );
};

export default ContentLayout;
