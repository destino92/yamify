"use client";

import React, { useEffect, useRef, useState } from "react";
import AuthHeader from "../../_components/AuthHeader";
import "@/styles/AuthPage.css";
import Image from "next/image";
import { countries } from "@/utils/data";
import { toast } from "sonner";
import Notification from "@/components/Notification/Notification";
import { OTPInput, SlotProps } from 'input-otp'

import { OAuthStrategy } from "@clerk/types";
import { useSignUp } from "@clerk/nextjs";



export default function SignUp() {
  // const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState(countries[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [verifying, setVerifying] = useState(false)
  const [code, setCode] = useState('')
  const [name, setName] = useState("");
  const [passwordValidations, setPasswordValidations] = useState({
    hasMinLength: false,
    hasNumber: false,
    hasUppercase: false,
    hasSpecialChar: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoaded, signUp, setActive } = useSignUp();

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setPasswordValidations({
      hasMinLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  if (!isLoaded) return null;

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const signUpWithSocial = (strategy: OAuthStrategy) => {
    return signUp
      .authenticateWithRedirect({
        strategy,
        redirectUrl: "/auth/sign-up/sso-callback",
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
        toast.custom(() => <Notification variant="error" title="Error !!!" description={err.errors[0].message} />);
      });
  };

  const ValidSVG = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 22L22 2L2 2L2 22L22 22Z" stroke="#F8F8F8" />
      <rect width="14" height="14" transform="translate(5 5)" fill="#F8F8F8" />
      <path
        d="M16.6663 8.5L10.2497 14.9167L7.33301 12"
        stroke="#1B1B1B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const InvalidSVG = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M22 22L22 2L2 2L2 22L22 22Z" stroke="#4c4c4c" />
    </svg>
  );

  // Function to split full name into first and last name
  const splitFullName = (name: string) => {
    const nameParts = name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''
    return { firstName, lastName }
  }

  // Handle submission of the sign-up form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isLoaded) return

    const { firstName, lastName } = splitFullName(name)

    setIsSubmitting(true)

    // Start the sign-up process using the email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
        unsafeMetadata: {
          country,
        },
      })

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })

      // Set 'verifying' true to display second form
      // and capture the OTP code
      setVerifying(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
      toast.custom(() => <Notification variant="error" title="Error !!!" description={err.errors[0].message} />);
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle resending the verification code
  const handleResendCode = async () => {
    if (!isLoaded || !signUp) return

    toast.custom(() => <Notification variant="info" title="Resending code..." description="Please wait..." />)

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      })
      console.log('Verification code resent')
      toast.custom(() => <Notification variant="success" title="Success !!!" description="Verification code resent, please check your email" />)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error resending code:', JSON.stringify(err, null, 2))
    }
  }

  // Handle the submission of the verification form
  const handleVerify = async () => {

    if (!isLoaded) return

    setIsSubmitting(true)

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Error:', JSON.stringify(err, null, 2))
      toast.custom(() => <Notification variant="error" title="Error !!!" description={err.errors[0].message} />);
    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="auth-section">
      <section>
       <AuthHeader />

        {
          verifying ? (
            <div className="container">
              <div className="back-icon" onClick={() => setVerifying(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M12.375 8H3.625M3.625 8L8 12.375M3.625 8L8 3.625" stroke="#E6E6E6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h1>Verify your email</h1>
              <div className="label-txt" style={{ marginBottom: "24px" }}>
                Please enter the code that was sent to your email address.
              </div>
              <form onSubmit={() => handleVerify()}>
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
                      onComplete={() => handleVerify()}
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
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Verifying ..." : "Verify"}</button>
                <div className="label-txt">
                  <p>Didn&apos;t receive the code?</p>
                  <span onClick={handleResendCode}>Retry</span>
                </div>
              </form>
            </div>
          ) : (
            <div className="container">
              <h1>Create your account</h1>

              <div className="auth-btns">
                <div
                  className="btn"
                  onClick={() => signUpWithSocial("oauth_github")}
                >
                  <Image src="/svgs/mdi_github.svg" alt="" height={20} width={20} />
                  Continue with GitHub
                </div>
                <div
                  className="btn"
                  onClick={() => signUpWithSocial("oauth_google")}
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

              <form onSubmit={handleSubmit}>
                <div className="label">
                  <div className="left">
                    <label htmlFor="">Country</label>
                  </div>
                  <div className="right">
                    <div className="input-wrap" onClick={() => setIsOpen(!isOpen)}>
                      <div className="phone-btn">
                        <Image
                          src={country.flag}
                          alt=""
                          width={100}
                          height={100}
                          className="flag"
                        />
                        {/* <div className="code">{country.dialCode}</div> */}
                        <div className="country-txt">{country.name}</div>
                      </div>

                      <div className="caret-contain">
                        <Image
                          src="/svgs/caret_down.svg"
                          alt=""
                          height={15}
                          width={15}
                        />
                      </div>

                      {isOpen && (
                        <div className="modal-overlay" ref={modalRef}>
                          <input
                            type="text"
                            placeholder="Search country..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                          />

                          {filteredCountries.map((country, index) => (
                            <div
                              className="country-item"
                              key={index}
                              onClick={() => {
                                setCountry(country);
                                setIsOpen(false);
                                setSearchTerm("");
                              }}
                            >
                              <div className="wrap">
                                <Image
                                  src={country.flag}
                                  alt=""
                                  width={100}
                                  height={100}
                                  className="flag"
                                />
                                <div className="name">{country.name}</div>
                              </div>
                              <span className="code">{country.dialCode}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="label">
                  <div className="left">
                    <label htmlFor="">Name</label>
                  </div>
                  <div className="right">
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      required
                    />
                  </div>
                </div>
                <div className="label">
                  <div className="left">
                    <label htmlFor="">Email address</label>
                  </div>
                  <div className="right">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      onChange={(e) => setEmailAddress(e.target.value)}
                      value={emailAddress}
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

                <div className="password-checker-container label">
                  <div className="left"></div>
                  <div className="right">
                    <div className="wrap">
                      {passwordValidations.hasMinLength ? (
                        <ValidSVG />
                      ) : (
                        <InvalidSVG />
                      )}
                      <p>8 characters min</p>
                    </div>
                    <div className="wrap">
                      {passwordValidations.hasNumber ? (
                        <ValidSVG />
                      ) : (
                        <InvalidSVG />
                      )}
                      <p>A number</p>
                    </div>
                    <div className="wrap">
                      {passwordValidations.hasUppercase ? (
                        <ValidSVG />
                      ) : (
                        <InvalidSVG />
                      )}
                      <p>Upper case character</p>
                    </div>
                    <div className="wrap">
                      {passwordValidations.hasSpecialChar ? (
                        <ValidSVG />
                      ) : (
                        <InvalidSVG />
                      )}
                      <p>Special character</p>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting || !emailAddress || !password || !name}>
                  <div className="contain">
                    <span>{isSubmitting ? "Loading" : "Create"}</span>
                    <span className="hover-text">{isSubmitting ? "Creating ..." : "Create"}</span>
                  </div>
                </button>
              </form>

              <div className="txt">
                By signing up, you agree to our <span>Privacy Policy</span> and{" "}
                <span>Terms of Use</span>
              </div>
            </div>
          )
        }
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