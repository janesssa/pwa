import React from "react";

const ProjectBlock = ({ project }) => {
  console.log(project);
  return (
    <div className="block">
      <h3>{project.title}</h3>
      <p>Gemaakt door {project.author}</p>
    </div>
  );
};

export default ProjectBlock;
