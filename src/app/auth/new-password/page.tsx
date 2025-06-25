"use client";

import React, { Suspense, useState } from "react";
import AuthHeader from "../_components/AuthHeader";
import "@/styles/AuthPage.css";
import "./NewPassword.css";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import toast from 'react-hot-toast';
import "@/app/auth/reset-password/ResetPassword.css"

// Composant interne qui utilise useSearchParams
function NewPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, signIn } = useSignIn();
  
  // Récupérer le token de l'URL
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !signIn || !token) return;
    
    // Validation des mots de passe
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Utiliser Clerk pour réinitialiser le mot de passe
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: token,
        password,
      });
      
      if (result.status === 'complete') {
        // Mot de passe réinitialisé avec succès
        setSuccess(true);
        toast.success("Password updated successfully!");
        
        // Rediriger vers la page de connexion après un délai
        setTimeout(() => {
          router.push('auth/sign-in');
        }, 3000);
      }
    } catch (err: unknown) {
      console.error("Error resetting password:", err);
      const clerkError = err as { errors?: Array<{ message: string }> };
      const errorMessage = clerkError.errors?.[0]?.message || "An error occurred while resetting your password. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
            <div className="success-message">
              <div className="success-icon">
                <Image
                  src="/svgs/check-circle.svg"
                  alt="Success"
                  width={80}
                  height={80}
                />
              </div>
              
              <h1>Password Updated!</h1>
              <p className="success-text">Your password has been successfully updated.</p>
              
              <button 
                className="submit-button"
                onClick={() => router.push('/sign-in')}
              >
                Back to Login
              </button>
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
          
          <h1>Create new password</h1>
          <p className="subtitle">Enter your new password below.</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="label">
              <div className="left">
                <label htmlFor="password">New Password</label>
              </div>
              <div className="right">
                <div className="wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={loading}
                  />
                  <Image
                    onClick={() => !loading && setShowPassword(!showPassword)}
                    src={
                      showPassword ? "/svgs/eyeopen.svg" : "/svgs/eyeopen.svg"
                    }
                    alt="Toggle password visibility"
                    height={15}
                    width={15}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
            
            <div className="label">
              <div className="left">
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>
              <div className="right">
                <div className="wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={password && confirmPassword ? 'active' : ''}
              disabled={!password || !confirmPassword || loading}
            >
              <div className="contain">
                <span>Create new password</span>
                <span className="hover-text">Create new password</span>
              </div>
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

// Composant principal qui enveloppe le formulaire avec Suspense
export default function NewPasswordPage() {
  return (
    <Suspense fallback={
      <div className="auth-section">
        <AuthHeader />
        <div className="container">
          
        </div>
      </div>
    }>
      <NewPasswordForm />
    </Suspense>
  );
}