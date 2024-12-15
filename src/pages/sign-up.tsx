import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <SignUp forceRedirectUrl={"/mail"} />
    </div>
  );
}
