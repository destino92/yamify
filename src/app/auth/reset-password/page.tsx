"use client";

import React, { useState } from "react";
import AuthHeader from "../_components/AuthHeader";
import "@/styles/AuthPage.css";
// import "./ResetPassword.css";
import { toast } from "sonner";
import Notification from "@/components/Notification/Notification";
import Image from "next/image";
import { useSignIn } from "@clerk/nextjs";
import { OTPInput, SlotProps } from "input-otp";
import { useRouter } from "next/navigation";


export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { isLoaded, signIn, setActive } = useSignIn();
  
  // Messages pour l'animation de chargement
  // const loadingMessages = [
  //   "Sending reset link...",
  //   "Almost there...",
  //   "Finalizing your request..."
  // ];

  // if (sending) {
  //   return (
  //     <div className="auth-section">
        
  //       <AuthHeader />
  //               <p className="back-to-login">
  //                 Remember your password?{' '}
  //                 <a href="auth/sign-in" onClick={(e) => { e.preventDefault(); router.push('/sign-in'); }}>
  //                   Sign in
  //                 </a>
  //               </p>
  //               <section>
  //         <div className="container">
  //           <div className="sending-message">
  //             <CreateAnimation 
  //               title="Sending reset link"
  //               loadingTxts={loadingMessages}
  //               successBool={false}
  //             />
  //           </div>
  //         </div>
  //       </section>
  //     </div>
  //   );
  // }

  // if (success) {
  //   return (
  //     <div className="auth-section">
       
  //       <AuthHeader />
  //               <p className="back-to-login">
  //                 Remember your password?{' '}
  //                 <a href="auth/sign-in" onClick={(e) => { e.preventDefault(); router.push('/sign-in'); }}>
  //                   Sign in
  //                 </a>
  //               </p> 
  //               <section>
  //         <div className="container">
  //           <div className="back-icon" onClick={() => router.back()}>
  //             <Image src="/svgs/arrow-left.svg" alt="Back" width={20} height={20} />
  //           </div>
  //           <h1>Check your email</h1>
            
  //           <div className="success-message">
  //             <div className="success-icon">
  //               <Image
  //                 src="/svgs/email-sent.svg"
  //                 alt="Email Sent"
  //                 width={80}
  //                 height={80}
  //               />
  //             </div>
              
  //             <p className="email-sent-to">We sent a password reset link to</p>
  //             <p className="email-address">{email}</p>
              
  //             <div className="email-clients">
  //               <p>Open your email and click the link to reset your password.</p>
  //               <div className="client-buttons">
  //                 <button 
  //                   className="email-client-button"
  //                   onClick={() => window.open('https://mail.google.com', '_blank')}
  //                 >
  //                   <Image src="/svgs/gmail.svg" alt="Gmail" width={20} height={20} />
  //                   Open Gmail
  //                 </button>
  //                 <button 
  //                   className="email-client-button"
  //                   onClick={() => window.open('https://outlook.live.com', '_blank')}
  //                 >
  //                   <Image src="/svgs/outlook.svg" alt="Outlook" width={20} height={20} />
  //                   Open Outlook
  //                 </button>
  //               </div>
  //             </div>
              
  //             <div className="email-footer">
  //               <p>Didn't receive the email? <a href="#" onClick={handleResend}>Click to resend</a></p>
  //               <button 
  //                 className="back-to-login"
  //                 onClick={() => router.push('/sign-in')}
  //               >
  //                 Back to Login
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </section>
  //     </div>
  //   );
  // }

  if (!isLoaded || !signIn) {
    return null
  }

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setIsLoading(true)
    await signIn
      ?.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      })
      .then(() => {
        setSuccessfulCreation(true)
        toast.custom(() => <Notification variant="success" title="Success !!!" description="Reset code has been sent to your email." />)
      })
      .catch((err) => {
        console.error('error', err.errors[0].longMessage)
        toast.custom(() => <Notification variant="error" title="Error !!!" description={err.errors[0].longMessage} />)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // Resend the password reset code
  async function resendCode() {
    if (!isLoaded || !signIn) return;
    
    try {
      // Envoyer à nouveau l'email de réinitialisation via Clerk
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      
      toast.custom(() => <Notification variant="success" title="Success !!!" description="Reset link has been resent to your email." />)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error resending reset link:", err);
      const errorMessage = err.errors?.[0]?.message || "Failed to resend email. Please try again.";
      toast.custom(() => <Notification variant="error" title="Error !!!" description={errorMessage} />)
    } 
  };

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e: React.FormEvent) {
    if (!isLoaded || !signIn) return;
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Envoyer l'email de réinitialisation via Clerk
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (result?.status === 'complete') {
        // Set the active session to
        // the newly created session (user is now signed in)
        await setActive({ session: result.createdSessionId })
      } else {
        console.log(result)
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error requesting password reset:", err);
      const errorMessage = err.errors?.[0]?.message || "An error occurred. Please try again.";
      toast.custom(() => <Notification variant="error" title="Error !!!" description={errorMessage} />);
    } finally {
      setIsLoading(false);
    }
  };

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
          {
            !successfulCreation && (
              <>
                <h1>Reset your password</h1>
                <p className="subtitle w-full text-[11px] ">Enter your email address and we&apos;ll send you a password reset code.</p>

                <form onSubmit={create}>
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
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className={email ? 'active' : ''}
                    disabled={isLoading || !email}
                  >
                    <div className="contain">
                      <span>{isLoading ? 'Sending...' : 'Reset password'}</span>
                      <span className="hover-text">{isLoading ? 'Sending...' : 'Reset password'}</span>
                    </div>
                  </button>
                </form>
              </>
            )
          }

          {
            successfulCreation && (
              <>
                <div className="back-icon" onClick={() => setSuccessfulCreation(false)}>
                  <Image src="/svgs/arrow-left.svg" alt="Back" width={20} height={20} />
                </div>

                <h1>Create new password</h1>

                <form onSubmit={reset}>
                  <div className="label">
                    <div className="left">
                      <label htmlFor="">Enter code</label>
                    </div>
                    <div className="right">
                      <OTPInput
                        maxLength={6}
                        containerClassName="otp-container"
                        data-1p-ignore
                        value={code}
                        onChange={setCode}
                        autoFocus
                        render={({ slots }) => (
                          <>
                            {slots.map((slot, idx) => (
                              <Slot key={idx} {...slot} />
                            ))}
                          </>
                        )}
                      />
                    </div>
                  </div>
                  <div className="label">
                    <div className="left">
                      <label htmlFor="password">Password</label>
                    </div>
                    <div className="right">
                      <div className="wrap">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Set your password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <Image
                          onClick={() => setShowPassword((prev) => !prev)}
                          src={
                            showPassword ? "/svgs/eyeopen.svg" : "/svgs/eyeclosed.svg"
                          }
                          alt="Toggle password visibility"
                          height={15}
                          width={15}
                        />
                      </div>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className={email ? 'active' : ''}
                    disabled={isLoading || !email}
                  >
                    <div className="contain">
                      <span>{isLoading ? 'Creating...' : 'Create new password'}</span>
                      <span className="hover-text">{isLoading ? 'Creating...' : 'Create new password'}</span>
                    </div>
                  </button>
                  <div className="label-txt">
                    <p>Didn&apos;t receive the code?</p>
                    <span onClick={resendCode}>Retry</span>
                  </div>
                </form>
              </>
            )
          }
        </div>
      </section>
    </div>
  );
}

function Slot(props: SlotProps) {
  return (
    <div className={`otp-slot ${props.isActive ? 'otp-slot-active' : ''}`}>
      <div className="otp-char">
        {props.char ?? props.placeholderChar}
      </div>
      {props.hasFakeCaret && <FakeCaret />}
    </div>
  )
}

function FakeCaret() {
  return (
    <div className="otp-caret-wrapper">
      <div className="otp-caret" />
    </div>
  )
}