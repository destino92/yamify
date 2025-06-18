"use client";

import React, { useState, useEffect } from "react";
import AuthHeader from "../_components/AuthHeader";
import "@/styles/AuthPage.css";
import "./ResetPassword.css";
import toast from 'react-hot-toast';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import CreateAnimation from "@/components/Home/CreateAnimation";


export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const { isLoaded, signIn } = useSignIn();
  
  // Messages pour l'animation de chargement
  const loadingMessages = [
    "Sending reset link...",
    "Almost there...",
    "Finalizing your request..."
  ];

  const handleResend = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Envoyer à nouveau l'email de réinitialisation via Clerk
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      
      // Afficher un message de succès
      setError("");
      toast.success("Reset link has been resent to your email.");
    } catch (err: any) {
      console.error("Error resending reset link:", err);
      const errorMessage = err.errors?.[0]?.message || "Failed to resend email. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;
    
    setLoading(true);
    setError("");
    setSending(true);
    
    try {
      // Envoyer l'email de réinitialisation via Clerk
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      
      setSuccess(true);
    } catch (err: any) {
      console.error("Error requesting password reset:", err);
      const errorMessage = err.errors?.[0]?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setSending(false);
    }
  };

  if (sending) {
    return (
      <div className="auth-section">
        
        <AuthHeader />
                <p className="back-to-login">
                  Remember your password?{' '}
                  <a href="auth/sign-in" onClick={(e) => { e.preventDefault(); router.push('/sign-in'); }}>
                    Sign in
                  </a>
                </p>
                <section>
          <div className="container">
            <div className="sending-message">
              <CreateAnimation 
                title="Sending reset link"
                loadingTxts={loadingMessages}
                successBool={false}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (success) {
    return (
      <div className="auth-section">
       
        <AuthHeader />
                <p className="back-to-login">
                  Remember your password?{' '}
                  <a href="auth/sign-in" onClick={(e) => { e.preventDefault(); router.push('/sign-in'); }}>
                    Sign in
                  </a>
                </p> 
                <section>
          <div className="container">
            <div className="back-icon" onClick={() => router.back()}>
              <Image src="/svgs/arrow-left.svg" alt="Back" width={20} height={20} />
            </div>
            <h1>Check your email</h1>
            
            <div className="success-message">
              <div className="success-icon">
                <Image
                  src="/svgs/email-sent.svg"
                  alt="Email Sent"
                  width={80}
                  height={80}
                />
              </div>
              
              <p className="email-sent-to">We sent a password reset link to</p>
              <p className="email-address">{email}</p>
              
              <div className="email-clients">
                <p>Open your email and click the link to reset your password.</p>
                <div className="client-buttons">
                  <button 
                    className="email-client-button"
                    onClick={() => window.open('https://mail.google.com', '_blank')}
                  >
                    <Image src="/svgs/gmail.svg" alt="Gmail" width={20} height={20} />
                    Open Gmail
                  </button>
                  <button 
                    className="email-client-button"
                    onClick={() => window.open('https://outlook.live.com', '_blank')}
                  >
                    <Image src="/svgs/outlook.svg" alt="Outlook" width={20} height={20} />
                    Open Outlook
                  </button>
                </div>
              </div>
              
              <div className="email-footer">
                <p>Didn't receive the email? <a href="#" onClick={handleResend}>Click to resend</a></p>
                <button 
                  className="back-to-login"
                  onClick={() => router.push('/sign-in')}
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="auth-section">
     
                <AuthHeader />
                <p className="back-to-login">
                  Remember your password?{' '}
                  <a href="auth/sign-in" onClick={(e) => { e.preventDefault(); router.push('/sign-in'); }}>
                    Sign in
                  </a>
                </p>
           
      <section>
        <div className="container">
          <div className="back-icon" onClick={() => router.back()}>
            <Image src="/svgs/arrow-left.svg" alt="Back" width={20} height={20} />
          </div>
          
          <h1>Reset your password</h1>
          <p className="subtitle w-full text-[11px] ">Enter your email address and we'll send you a link to reset your password.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="label">
              <div className="left">
                <label htmlFor="email">Email address</label>
              </div>
              <div className="right">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={email ? 'active' : ''}
              disabled={loading || !email}
            >
              <div className="contain">
                <span>{loading ? 'Sending...' : 'Reset password'}</span>
                <span className="hover-text">{loading ? 'Sending...' : 'Reset password'}</span>
              </div>
            </button>
            
            
          </form>
        </div>
      </section>
    </div>
  );
}
