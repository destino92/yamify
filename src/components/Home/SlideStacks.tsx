"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import "@/styles/SlideStack.css";

const stackItems = [
  { src: "/svgs/nextjs-svg.svg", text: "NextJs" },
  { src: "/svgs/wordpress.svg", text: "Wordpress" },
  { src: "/svgs/code-square-svg.svg", text: "Code" },
  { src: "/svgs/laravel_icon.svg", text: "Laravel" },
  { src: "/svgs/node-16-svg.svg", text: "NodeJs" },
  { src: "/svgs/sql-svg.svg", text: "MySQL" },
  { src: "/svgs/ai_bionic.svg", text: "AI Apps" },
  { src: "/svgs/Github.svg", text: "Github Repo" },
];

const SlideStacks = () => {
  return (
    <div className="slide-stack-container">
      <h3>We speak your stacks...</h3>
      <motion.div
        className="slide-stack"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 130,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[
          ...stackItems,
          ...stackItems,
          ...stackItems,
          ...stackItems,
          ...stackItems,
          ...stackItems,
          ...stackItems,
          ...stackItems,
          ...stackItems,
          ...stackItems,
          ...stackItems,
          ...stackItems,
        ].map((item, index) => (
          <div className="item" key={index}>
            <Image src={item.src} alt={item.text} width={24} height={24} />
            <p>{item.text}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default SlideStacks;
