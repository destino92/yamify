"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthHeader from "../../_components/AuthHeader";
import "@/styles/AuthPage.css";
import Image from "next/image";
import { OAuthStrategy } from "@clerk/types";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import "@/app/auth/reset-password/ResetPassword.css"
export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isLoaded } = useSignIn();
  const { isSignedIn } = useAuth();

  // Rediriger si déjà connecté
  if (isSignedIn) {
    router.push('/dashboard');
    return null;
  }

  if (!signIn || !isLoaded) return null;

  const signInWithSocial = (strategy: OAuthStrategy) => {
    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/auth/sign-in/sso-callback",
        redirectUrlComplete: "/dashboard",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.log(err.errors);
        console.error(err, null, 2);
      });
  };

  return (
    <div className="auth-section">
      <AuthHeader />
        <p className="back-to-login">
        Don't have an account?{' '}
        <Link href="/auth/sign-up" >
          Sign up
        </Link>
      </p>
      <section>
        
        <div className="container">
          <h1>Sign in</h1>

          <div className="auth-btns">
            <div
              className="btn-auth"
              onClick={() => signInWithSocial("oauth_github")}
            >
              <Image src="/svgs/mdi_github.svg" alt="" height={20} width={20} />
              Continue with GitHub
            </div>
            <div
              className="btn-auth"
              onClick={() => signInWithSocial("oauth_google")}
            >
              <Image src="/svgs/google.svg" alt="" height={20} width={20} />
              Continue with Google
            </div>
          </div>

          <div className="line-wrap">
            <div className="line"></div>
            <p>OR</p>
            <div className="line"></div>
          </div>

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              if (!signIn) return;
              
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email') as string;
              const password = formData.get('password') as string;

              if (!email || !password) {
                toast.error('Please fill in all required fields');
                return;
              }


              try {
                setIsLoading(true);
                
                // Tenter de se connecter
                const result = await signIn.create({
                  identifier: email,
                  password,
                });

                if (result.status === 'needs_first_factor') {
                  // Gérer la vérification à deux facteurs si nécessaire
                  router.push('/auth/verify');
                } else {
                  // Redirection après connexion réussie
                  router.push('/dashboard');
                }
                
              } catch (err: any) {
                console.error('Error during sign in:', err);
                const errorMessage = err.errors?.[0]?.message || 'Invalid email or password';
                toast.error(errorMessage);
              } finally {
                setIsLoading(false);
              }
            }}
            className="auth-form"
          >
            <div className="label">
              <div className="left">
                <label htmlFor="email">Email address</label>
              </div>
              <div className="right">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading}
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
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <Image
                    onClick={() => !isLoading && setShowPassword((prev) => !prev)}
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

            <div className="btn-wrap">
              <button 
                type="submit" 
                className={`submit-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                <div className="contain">
                  <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
                  <span className="hover-text">{isLoading ? 'Signing in...' : 'Sign in'}</span>
                </div>
              </button>
            </div>
          </form> 

          <div className="txt">
            Forgot your password?{' '}
            <span>
              <Link href="/auth/reset-password">Reset it</Link>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
