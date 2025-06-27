// app/education/page.tsx
import "./styles/education.css";
import { RefObject } from "react";
interface Props {
  contentRef: RefObject<HTMLDivElement | null>;
  lightMode: boolean;
}

const categories = [
  {
    title: "Introduction",
    links: [
      { text: "Tutorial: Getting started with Yamify.", href: "https://doc.yamify.co" },
      { text: "Tutorial: How to create a yam?", href: "https://doc.yamify.co" },
    ],
  },
  {
    title: "Infrastructure",
    links: [
      { text: "What is Cloud Infrastructure?", href: "https://doc.yamify.co" },
      { text: "Why Kubernetes (and why Yamify hides it)?", href: "https://doc.yamify.co" },
      { text: "Understanding Yams (Your Cluster)", href: "https://doc.yamify.co" },
    ],
  },
  {
    title: "Features",
    links: [
      { text: "Workspaces, Groups, and Apps — Made Simple", href: "https://doc.yamify.co" },
      { text: "How Deployments Work on Yamify", href: "https://doc.yamify.co" },
      { text: "Understanding Billing and Credits", href: "https://doc.yamify.co" },
      { text: "Growing From Frontend to Full-Stack with Yamify", href: "https://doc.yamify.co" },
      { text: "Common Infrastructure Terms (Without the Jargon)", href: "https://doc.yamify.co" },
    ],
  },
];

const EducationPage: React.FC<Props> = ({ contentRef, lightMode }) => {
  return (
    <div  ref={contentRef} className={`education-container w-[88%]   py-12 ${lightMode ? "light-mode" : ""}`}>
     
      <div className="education-columns">
        {[...Array(2)].map((_, colIdx) => (
          <div key={colIdx} className="education-column">
            {categories.map((category, catIdx) => (
              <div key={catIdx} className="education-section">
                <h2
                  className={`section-title ${
                    colIdx === 0 && catIdx === 0 ? "highlighted" : ""
                  }`}
                >
                  {category.title}
                </h2>
                <ul className="link-list">
                  {category.links.map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.href}
                        className={`link-item ${
                          colIdx === 1 ? "highlighted-link" : ""
                        }`}
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default  EducationPage