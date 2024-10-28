"use client";
import React, { useTransition, useState } from "react";
import Image from "next/image";
import TabButton from './TabButton';

const TAB_DATA = [
  {
    title: "Skills",
    id: "skills",
    content: (
      <ul className="list-disc pl-2 dark:text-white light:text-black">
      </ul>
    ),
  },
  {
    title: "Education",
    id: "education",
    content: (
      <ul className="list-disc pl-2 dark:text-white light:text-black">
        <li></li>
      </ul>
    ),
  },
  {
    title: "Certifications",
    id: "certifications",
    content: (
      <ul className="list-disc pl-2 dark:text-white light:text-black">
        <li></li>
      </ul>
    ),
  },
];

const AboutSection = () => {
  const [tab, setTab] = useState("skills");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (id: string) => {
    startTransition(() => {
      setTab(id);
    });
  };

  const selectedTab = TAB_DATA.find((t) => t.id === tab);
  const selectedTabContent = selectedTab ? selectedTab.content : null;

  return (
    <section className="dark:text-white light:text-black" id="about">
      <div className="md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16 dark:text-white light:text-black">
      
        <div className="mt-4 md:mt-0 text-left flex flex-col h-full dark:text-white light:text-black">
          <h2 className="text-4xl font-bold dark:text-white light:text-black mb-4"></h2>
          <p className="text-base lg:text-lg mb-2.5 dark:text-white light:text-black">

          </p>
          <p className="text-base lg:text-lg mb-2.5 dark:text-white light:text-black">
          </p>
          <p className="text-base lg:text-lg mb-2.5 dark:text-white light:text-black">

          </p>
          <div className="flex flex-row justify-center mt-8 dark:text-white light:text-black">
            <TabButton
              selectTab={() => handleTabChange("skills")}
              active={tab === "skills"}
            >
              {" "}
              {" "}
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("education")}
              active={tab === "education"}
            >
              {" "}
            {" "}
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("certifications")}
              active={tab === "certifications"}
            >
              {" "}
              {" "}
            </TabButton>
          </div>
          <div className="mt-8 dark:text-white light:text-black">
            {selectedTabContent}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;