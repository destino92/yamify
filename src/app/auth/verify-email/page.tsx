"use client";

import { useRouter } from 'next/navigation';
import { useUser, useSignUp } from '@clerk/nextjs';
import { useState, useEffect, useRef, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CreateAnimation from '@/components/Home/CreateAnimation';
import AuthHeader from '../_components/AuthHeader';
import "@/styles/AuthPage.css";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const { isLoaded, isSignedIn } = useUser();
  const { signUp, setActive } = useSignUp();
  const router = useRouter();
  
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailAddress, setEmailAddress] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verifying, setVerifying] = useState(false);
  
  // Messages pour l'animation de chargement
  const loadingTxts = [
    "Verifying your email...",
    "Preparing your account...",
    "Almost there...",
    "Finalizing setup..."
  ];
  
  // Redirection après vérification réussie
  useEffect(() => {
    if (verificationSuccess) {
      const redirectTimeout = setTimeout(() => {
        router.push('/auth/onboarding');
      }, 3000); // Rediriger après 3 secondes d'animation
      
      return () => clearTimeout(redirectTimeout);
    }
  }, [verificationSuccess, router]);
  
  // Refs for inputs
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (!isLoaded) return;
    
    if (isSignedIn) {
      // Already verified and signed in
      router.push('/auth/onboarding');
      return;
    }
    
    // Focus the first input on load
    inputRefs[0].current?.focus();
    
    // Récupérer l'adresse email depuis le signUp object
    if (signUp?.emailAddress) {
      setEmailAddress(signUp.emailAddress);
    }
  }, [signUp]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0); // Only take the first character
    }
    
    // Update verification code
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);
    
    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && verificationCode[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    if (/^\d{6}$/.test(pastedData)) {
      // Paste the 6 digits individually
      const digits = pastedData.split('');
      digits.forEach((digit, index) => {
        if (index < 6) {
          const newVerificationCode = [...verificationCode];
          newVerificationCode[index] = digit;
          setVerificationCode(newVerificationCode);
        }
      });
      // Focus the last input
      inputRefs[5].current?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const code = verificationCode.join('');
    
    if (code.length !== 6) {
      setError('Veuillez entrer les 6 chiffres du code');
      return;
    }
    
    setLoading(true);
    setVerifying(true);
    
    try {
      if (!signUp) {
        throw new Error('Une erreur est survenue. Veuillez réessayer.');
      }
      
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      
      if (completeSignUp.status !== 'complete') {
        throw new Error('checking faild. please try again.');
      }
      
      // Activation de la session
      await setActive({ session: completeSignUp.createdSessionId });
      
      // Activer l'animation de vérification réussie
      setVerificationSuccess(true);
      
      // La redirection est gérée par le composant CreateAnimation
      // après la fin de l'animation
      
    } catch (err) {
      console.error('Erreur lors de la vérification:', err);
      setError((err as Error).message || 'Une erreur est survenue. Veuillez réessayer.');
      setVerifying(false);
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    try {
      if (!signUp) {
        throw new Error('Une erreur est survenue. Veuillez réessayer.');
      }
      
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
    } catch (err) {
      console.error('Erreur lors de l\'envoi du code:', err);
      setError((err as Error).message || 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  // Afficher l'état de chargement ou de vérification
  if (!isLoaded || verifying || verificationSuccess) {
    return (
      <div className="auth-section">
        <section>
          <div className="container">
            <CreateAnimation 
              title={verificationSuccess ? "Email Verified!" : "Verifying..."}
              loadingTxts={loadingTxts}
              successBool={verificationSuccess}
            />
            {verificationSuccess && (
              <div className="redirect-message">
                <p>Redirecting to onboarding...</p>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  }

  // Vérifier si tous les champs sont remplis
  const allFieldsFilled = verificationCode.every(digit => digit !== '');

  return (
    <div className="auth-section">
      <section>
        <div className="container">
          <div className="back-icon" onClick={() => router.back()}>
            <Image src="/svgs/arrow-left.svg" alt="Back" width={20} height={20} />
          </div>
          
          <h1>Verify OTP</h1>
          <p className="subtitle w-full">Please enter the code that was sent to your <span className="email-address">{emailAddress || 'your email'}</span></p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="otp-form">
            <div className="otp-inputs">
              {verificationCode.map((digit, index) => (
                <div key={index} className="otp-input-wrapper">
                  <input
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`otp-input ${digit ? 'filled' : ''}`}
                    placeholder="•"
                    disabled={loading}
                  />
                </div>
              ))}
            </div>
            
            <button 
              type="submit" 
              className={allFieldsFilled ? 'active' : ''}
              disabled={loading || !allFieldsFilled}
            >
              <div className="contain">
                <span>{loading ? 'Verifying...' : 'Verify Email'}</span>
                <span className="hover-text">{loading ? 'Verifying...' : 'Verify Email'}</span>
              </div>
            </button>
          </form>
          
          <div className="resend-container">
            <p>Didn't receive a code?{' '}
              <button 
                type="button" 
                onClick={handleResendCode}
                disabled={loading}
                className="resend-link"
              >
                Retry
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VerifyEmail;