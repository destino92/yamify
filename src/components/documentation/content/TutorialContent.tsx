// yamify/src/components/documentation/TutorialContent.tsx
"use client";

import React, { RefObject } from "react";

type Props = {
  contentRef: RefObject<HTMLDivElement | null>;
  lightMode: boolean;
};

const TutorialContent: React.FC<Props> = ({ contentRef, lightMode }) => {
  const tutorials = [
    {
      title: "Deploy Your First App",
      description: "Step-by-step guide to deploying your first application on Yamify.",
      level: "Beginner",
      duration: "15 minutes"
    },
    {
      title: "Setting Up Custom Domains",
      description: "Learn how to configure custom domains for your deployed applications.",
      level: "Intermediate",
      duration: "20 minutes"
    },
    {
      title: "Database Integration",
      description: "Connect and manage databases with your applications seamlessly.",
      level: "Intermediate",
      duration: "25 minutes"
    },
    {
      title: "Scaling Applications",
      description: "Advanced techniques for scaling your applications based on demand.",
      level: "Advanced",
      duration: "30 minutes"
    }
  ];

  return (
    <div className={`hero-section ${lightMode && "light-mode"}`} ref={contentRef}>
      <div className="flex justify-center items-center">
        <div className="w-[80%] DocHero py-12">
          <h1 className={`text-4xl font-bold mb-8 ${lightMode ? "text-gray-900" : "text-white"}`}>
            Tutorials
          </h1>
          <p className={`mb-12 text-lg ${lightMode ? "text-gray-600" : "text-gray-300"}`}>
            Follow our hands-on tutorials to master Yamify's features and deploy applications with confidence.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {tutorials.map((tutorial, index) => (
              <div key={index} className={`p-6 rounded-lg transition-colors cursor-pointer ${
                lightMode ? "bg-white shadow-lg hover:shadow-xl" : "bg-[#2a2a2a] hover:bg-[#333]"
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className={`text-xl font-semibold ${lightMode ? "text-gray-900" : "text-white"}`}>
                    {tutorial.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    tutorial.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    tutorial.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {tutorial.level}
                  </span>
                </div>
                <p className={`mb-4 ${lightMode ? "text-gray-600" : "text-gray-300"}`}>
                  {tutorial.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-amber-500 text-sm">{tutorial.duration}</span>
                  <button className="bg-amber-500 hover:bg-amber-600 text-black font-medium px-4 py-2 rounded text-sm transition-colors">
                    Start Tutorial
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialContent;