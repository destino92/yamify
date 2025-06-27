import React, { RefObject, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./styles/faq.css";
import "@/styles/HeroSection.css";

interface Props {
  contentRef: RefObject<HTMLDivElement | null>;
}

const FAQsContent: React.FC<Props> = ({ contentRef }) => {
  const [openFaq, setOpenFaq] = useState(0); // Premier FAQ ouvert par défaut

  const toggleFaq = (index:number) => {
    setOpenFaq(openFaq === index ? 0 : index);
  };

  const faqs = [
    {
      question: "What is a FAQ and why is it important?",
      answer: "FAQ stands for Frequently Asked Questions. It is a list that provides answers to common questions people may have about a specific product, service, or topic."
    },
    {
      question: "Why should I use a FAQ on my website or app?",
      answer: "A FAQ section helps reduce customer support inquiries by providing immediate answers to common questions. It improves user experience, builds trust, and can help with SEO by targeting relevant keywords that users search for."
    },
    {
      question: "How do I effectively create a FAQ section?",
      answer: "To create an effective FAQ section, start by identifying the most common questions your users ask. Organize them logically, use clear and concise language, keep answers brief but comprehensive, and regularly update the content based on new questions that arise."
    },
    {
      question: "What are the benefits of having a well-maintained FAQ section?",
      answer: "A well-maintained FAQ section reduces support costs, improves customer satisfaction, increases conversion rates, helps with SEO rankings, and provides valuable insights into customer concerns and needs."
    },
    {
      question: "How do I effectively create a FAQ section?",
      answer: "Focus on user research to identify real questions, organize content with clear categories, use simple language, provide comprehensive but concise answers, and implement a search function for easy navigation through your FAQ content."
    }
  ];

  return (
    <div className="    w-full  " ref={contentRef}>
      <div className="faq-wrapper w-[88%]">
        <h1 className="text-2xl font-bold mb-8 text-white">FAQ</h1>
        
        <div className="faq-list ">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                onClick={() => toggleFaq(index)}
                className="faq-question-button"
              >
                <span className="faq-question-text">
                  {faq.question}
                </span>
                {openFaq === index ? (
                  <ChevronUp className="faq-icon" />
                ) : (
                  <ChevronDown className="faq-icon" />
                )}
              </button>
              
              <div className={`faq-answer-container ${openFaq === index ? 'open' : ''}`}>
                <div className="faq-answer-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQsContent;