"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "nextjs-toploader/app";
import { useSession } from "@/components/providers/SessionProvider";
import { destinationAfterLogin } from "@/lib/navigation";
import { api } from "@/lib/api/client";
import { notifyApiError, notifyError, notifySuccess } from "@/lib/toast";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export function GoogleButton({ next, text }: { next: string; text: "signin_with" | "signup_with" }) {
  const router = useRouter();
  const { signIn } = useSession();

  if (!CLIENT_ID) return null;

  const onCredential = async (credential?: string) => {
    if (!credential) return notifyError("Google sign-in failed", "Google didn't return an account.");
    try {
      const session = await api.google(credential);
      signIn(session);
      notifySuccess("Login Successful ❤️", "Have fun booking your tickets");
      router.push(destinationAfterLogin(session.user, next));
      router.refresh();
    } catch (error) {
      notifyApiError(error, "Google sign-in failed");
    }
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className="flex justify-center">
        <GoogleLogin
          text={text}
          width="326"
          shape="rectangular"
          onSuccess={(response) => onCredential(response.credential)}
          onError={() => notifyError("Google sign-in failed", "Couldn't authenticate with Google.")}
        />
      </div>
    </GoogleOAuthProvider>
  );
}
