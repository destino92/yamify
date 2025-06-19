'use client';

import React from 'react';
import { toast as sonnerToast } from 'sonner';
import "@/styles/Notification.css";

/** A fully custom toast that still maintains the animations and interactions. */
export default function SuccessToast(props: ToastProps) {
  const { title, description } = props;

  return (
    <div className="notification-container success">
      <div className="notification-icon-containter success">
        <div className="notification-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="#59BF62" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
      </div>
      <div className="notification-content">
        <div className="notification-header">
            <div className="notification-title">
                <h3 className="notification-title-text success">{title}</h3>
            </div>
            <div className="notification-close">
                <div className="icon" onClick={() => { sonnerToast.dismiss();}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M11.25 3.75L3.75 11.25M3.75 3.75L11.25 11.25" stroke="#E6E6E6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
        <div className=".notification-body">
            <div className="notification-message">
                <p>{description}</p>
            </div>
        </div>
      </div>
    </div>
  );
}

interface ToastProps {
  title: string;
  description: string;
}