"use client";
import React, { useState, useRef } from "react";
import ProjectCard from './ProjectCard'
import ProjectTag from './ProjectTag'
import { motion, useInView } from "framer-motion";

const projectsData = [
  {
    id: 1,
    title: "",
    description: "",
    image : "",
    tag: ["All", "Prep"],
    gitUrl: "",
    previewUrl: "/",
  },
  

 
];

const ProjectsSection:React.FC = () => {
  const [tag, setTag] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleTagChange = (newTag: string) => {
    setTag(newTag);
  };

  const filteredProjects = projectsData.filter((project) =>
    project.tag.includes(tag)
  );

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <section id="projects">
      <h2 className="text-center text-4xl font-bold dark:text-white light:text-black mt-4 mb-8 md:mb-12">
        
      </h2>
      <div className="dark:text-white light:text-black flex flex-row justify-center items-center gap-2 py-6">
      </div>
      <ul ref={ref} className="dark:text-white light:text-black grid md:grid-cols-3 gap-8 md:gap-12">
        {filteredProjects.map((project, index) => (
          <motion.li
            key={index}
            variants={cardVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            transition={{ duration: 0.3, delay: index * 0.4 }}
          >
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              imgUrl={project.image}
              gitUrl={project.gitUrl}
              previewUrl={project.previewUrl}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;
