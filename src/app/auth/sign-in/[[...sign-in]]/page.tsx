"use client";

import React, { useState } from "react";
import AuthHeader from "../../_components/AuthHeader";
import "@/styles/AuthPage.css";
import Image from "next/image";
import Link from "next/link";
import { OAuthStrategy } from '@clerk/types'
import { useSignIn } from '@clerk/nextjs'
import { toast } from "sonner";
import Notification from "@/components/Notification/Notification";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const router = useRouter()

  if (!signIn) return null

  // Handle the submission of the sign-in form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) return

    setIsSubmitting(true)

    try {
      // Start the sign-in process using the email and password provided
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.push('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
        toast.custom(() => <Notification
          variant="error"
          title="Sign In Failed"
          description="Please check your email and password, or try signing in with a different method."
        />)
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Error:', JSON.stringify(err, null, 2))
      toast.custom(() => <Notification
        variant="error"
        title="Sign In Error"
        description={err.errors?.[0]?.message || 'An unexpected error occurred. Please try again.'}
      />)
    } finally {
      setIsSubmitting(false)
    }
  }

  const signInWithSocial = (strategy: OAuthStrategy) => {
    return signIn
      .authenticateWithRedirect({
        strategy,
        redirectUrl: '/auth/sign-in/sso-callback',
        redirectUrlComplete: '/dashboard',
      })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.log(err.errors)
        console.error(err, null, 2)
      })
  }

  return (
    <div className="auth-section">
      <section>
        <AuthHeader />
        <div className="container">
          <h1>Sign in</h1>

          <div className="auth-btns">
            <div className="btn" onClick={() => signInWithSocial('oauth_github')}>
              <Image src="/svgs/mdi_github.svg" alt="" height={20} width={20} />
              Continue with GitHub
            </div>
            <div className="btn" onClick={() => signInWithSocial('oauth_github')}>
              <Image src="/svgs/google.svg" alt="" height={20} width={20} />
              Continue with Google
            </div>
          </div>

          <div className="line-wrap">
            <div className="line"></div>
            <p>OR</p>
            <div className="line"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="label">
              <div className="left">
                <label htmlFor="">Email address</label>
              </div>
              <div className="right">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Image
                    onClick={() => setShowPassword((prev) => !prev)}
                    src={
                      showPassword ? "/svgs/eyeopen.svg" : "/svgs/eyeopen.svg"
                    }
                    alt="Toggle password visibility"
                    height={15}
                    width={15}
                  />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting || !email || !password}>
              <div className="contain">
                <span>{isSubmitting ? "Loading ..." : "Sign in"}</span>
                <span className="hover-text">{isSubmitting ? "Loading ..." : "Sign in"}</span>
              </div>
            </button>
          </form>

          <div className="txt">
            Forgot your password?{" "}
            <span>
              <Link href="/auth/reset-password">Reset it</Link>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}