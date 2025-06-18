// import routes from "@/libs/routes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const AuthHeader = () => {
  const lightMode = false;
  const pathname = usePathname();
  console.log(pathname);

  return (
    <div className="auth-header">
      <Link href="/" className="logo">
        <Image
          src={
            !lightMode
              ? "/svgs/yamify_logo_sm.svg"
              : "/svgs/yamify_logo_sm_lm.svg"
          }
          alt="Yamify Logo"
          className="logo-img"
          width={20}
          height={25.333}
        />
        <h1 className="text-white">Yamify</h1>
      </Link>

      {/* pathname !== "/auth/sign-in" ? (
        <div className="wrap">
          <p>Already have an account?</p>
          <Link href={routes.auth.login}>Sign in</Link>
        </div>
      ) : (
        <div className="wrap">
          <p>Need an account?</p>
          <Link href={routes.auth.signup}>Sign up</Link>
        </div>
      ) */}
    </div>
  );
};

export default AuthHeader;
