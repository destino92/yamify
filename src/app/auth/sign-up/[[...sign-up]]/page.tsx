"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AuthHeader from "../../_components/AuthHeader";
import "@/styles/AuthPage.css";
import Image from "next/image";
import { OAuthStrategy } from "@clerk/types";
import { useSignUp, useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import "@/app/auth/reset-password/ResetPassword.css"
const countries = [
  {
    name: "Nigeria",
    dialCode: "+234",
    code: "NG",
    flag: "https://flagcdn.com/ng.svg",
  },
  // Ajoutez d'autres pays si nécessaire
];

export default function SignUp() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [country, setCountry] = useState({
    name: "Nigeria",
    dialCode: "+234",
    code: "NG",
    flag: "https://flagcdn.com/ng.svg",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, isLoaded } = useSignUp();
  const { isSignedIn } = useAuth();

  const modalRef = useRef<HTMLDivElement | null>(null);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

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

  if (!signUp || !isLoaded) return null;

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
      });
  };

  return (
    <div className="auth-section">
       <AuthHeader />
        <p className="back-to-login">
        Already have an account?{' '}
        <a href="auth/sign-in" onClick={(e) => { e.preventDefault(); router.push('/sign-in'); }}>
          Sign in
        </a>
      </p>
      <section>
       
        <div className="container">
          <h1>Create your account</h1>

          <div className="auth-btns">
            <div
              className="btn-auth"
              onClick={() => signUpWithSocial("oauth_github")}
            >
              <Image src="/svgs/mdi_github.svg" alt="" height={20} width={20} />
              Continue with GitHub
            </div>
            <div
              className="btn-auth"
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

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              if (!signUp) return;
              
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email') as string;
              const password = formData.get('password') as string;
              const firstName = formData.get('name')?.toString().split(' ')[0] || '';
              const lastName = formData.get('name')?.toString().split(' ').slice(1).join(' ') || '';

              if (!email || !password || !firstName) {
                toast.error('Please fill in all required fields');
                return;
              }

              try {
                setIsLoading(true);
                
                // Créer le compte
                await signUp.create({
                  emailAddress: email,
                  password,
                  firstName,
                  lastName,
                });

                // Envoyer l'email de vérification
                await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
                
                // Rediriger vers la page de vérification
                router.push('/auth/verify-email');
                
              } catch (err: any) {
                console.error('Error during sign up:', err);
                const errorMessage = err.errors?.[0]?.message || 'An error occurred during sign up';
                toast.error(errorMessage);
              } finally {
                setIsLoading(false);
              }
            }}
            className="auth-form"
          >
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
                  required
                  disabled={isLoading}
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
                    placeholder="Set your password"
                    required
                    disabled={isLoading}
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

            <div className="btn-wrap">
              <button 
                type="submit" 
                className={`submit-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                <div className="contain">
                  <span>{isLoading ? 'Creating account...' : 'Create account'}</span>
                  <span className="hover-text">{isLoading ? 'Creating account...' : 'Create account'}</span>
                </div>
              </button>
            </div>
          </form> 

          <div className="txt">
            By signing up, you agree to our <span>Privacy Policy</span> and{" "}
            <span>Terms of Use</span>
          </div>
        </div>
      </section>
    </div>
  );
}
