'use client';

import React from 'react';
import { toast as sonnerToast } from 'sonner';
import "@/styles/Notification.css";

function getToastIcon(variant: 'success' | 'error' | 'info') {
  switch (variant) {
    case 'success':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="#59BF62" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
      );
    case 'error':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#E22D1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> 
          <path d="M12 16V12" stroke="#E22D1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 8H12.01" stroke="#E22D1B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'info':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M13.73 21C13.5542 21.3031 13.3018 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="#E6E6E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );  
    default:
      return null;
  }
}

/** A fully custom toast that still maintains the animations and interactions. */
export default function Notification(props: ToastProps) {
  const { title, description, variant } = props;

  return (
    <div className={`notification-container ${variant === 'info' ? '' : variant}`}>
      <div className={`notification-icon-containter ${variant === 'info' ? '' : variant}`}>
        <div className="notification-icon">
            {getToastIcon(variant)}
        </div>
      </div>
      <div className="notification-content">
        <div className="notification-header">
            <div className="notification-title">
              <h3 className={`notification-title-text ${variant === 'info' ? '' : variant}`}>{title}</h3>
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
  variant: 'success' | 'error' | 'info';
}