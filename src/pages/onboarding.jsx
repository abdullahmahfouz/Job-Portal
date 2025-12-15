
import React from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";

// Onboarding page where a signed-in user picks if they are a candidate or employer
const Onboarding = () => {
  // Get the current Clerk user and loading state
  const { user, isLoaded } = useUser();
  // Router helper to move to another page
  const navigate = useNavigate();

  // Save the selected role on the user and send them to the next page
  const handleRoleSelection = async (role) => {
    try {
      await user.update({ unsafeMetadata: { role } });
      navigate(role === "employer" ? "/post-job" : "/jobs");
    } catch (err) {
      console.error("Error updating user role", err);
    }
  };

  // While the user data is loading (or missing), show a simple loader
  if (!isLoaded || !user) {
    return (
      <div className="flex flex-col items-center justify-center mt-32 w-full max-w-md mx-auto px-4">
        <BarLoader className="mb-4 w-full" width={"100%"} color="#36d7b7" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-3xl rounded-2xl border bg-background/70 shadow-lg px-8 py-10 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="gradient-title font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            I am a...
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Choose whether you want to look for jobs or post jobs. You can change this later.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-24 text-xl"
            onClick={() => handleRoleSelection("candidate")}
          >
            Candidate
          </Button>
          <Button
            variant="destructive"
            className="h-24 text-xl"
            onClick={() => handleRoleSelection("employer")}
          >
            Employer
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Onboarding;