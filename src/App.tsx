import React from "react";
import Header from "./components/Header";
import ContentLayout from "./components/ContentLayout";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <ContentLayout />
    </div>
  );
};

export default App;
