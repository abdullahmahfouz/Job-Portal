import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";

// Top navigation bar that shows logo, login button, and user menu
const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);

  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();

  // Compute where to send the user after they sign in
  const redirectTo = useMemo(
    () => search.get("redirectTo") || "/onboarding",
    [search]
  );

  // Open the sign-in modal if the URL has a ?sign-in param
  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  // Close the sign-in modal when clicking the dark background
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              style={{ width: "50px", height: "50px", objectFit: "contain" }}
              alt="HireMe Logo"
            />
          </Link>

          <div className="flex gap-3 items-center">
            <SignedOut>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSignIn(true)}
              >
                Login
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setSearch({ "sign-in": "true", redirectTo: "/post-job" });
                  setShowSignIn(true);
                }}
              >
                <PenBox size={16} className="mr-2" />
                Post a Job
              </Button>
            </SignedOut>
            <SignedIn>
              <Link to="/post-job">
                <Button variant="destructive" size="sm">
                  <PenBox size={16} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
              <UserButton
                afterSignOutUrl="/"
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Jobs"
                    labelIcon={<BriefcaseBusiness size={15} />}
                    href="/my-jobs"
                  />
                  <UserButton.Link
                    label="Saved Jobs"
                    labelIcon={<Heart size={15} />}
                    href="/saved-jobs"
                  />
                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleOverlayClick}
        >
          <div
            className="bg-white rounded-lg overflow-hidden shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 pt-6 pb-3 border-b">
              <h2 className="text-xl font-semibold">Welcome back</h2>
              <p className="text-sm text-gray-500">
                Sign in to continue where you left off.
              </p>
            </div>
            <div className="p-6">
              <SignIn
                signUpForceRedirectUrl="/onboarding"
                fallbackRedirectUrl={redirectTo}
                redirectUrl={redirectTo}
              />
              <button
                type="button"
                onClick={() => {
                  setShowSignIn(false);
                  setSearch({});
                  navigate("/");
                }}
                className="mt-4 w-full text-sm text-center text-gray-500 hover:text-gray-700 underline underline-offset-2"
              >
                Continue without signing in
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;