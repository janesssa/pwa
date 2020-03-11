import React from "react";
import useFetch from './hooks/fetch'

import ProjectBlock from "./components/ProjectBlock";
import "./App.css";

const App = () => {
  const [data, loading] = useFetch('https://cmgt.hr.nl:8000/api/projects/')

  return (
    <div className="container">
      <h1>Projecten</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        data.projects.map(project => {
          return <ProjectBlock project={project} />;
        })
      )}
    </div>
  );
};

export default App;
