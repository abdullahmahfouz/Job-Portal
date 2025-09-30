import { Button } from "@/components/ui/button";
import companies from "@/data/companies.json";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const marqueeLogos = [...companies, ...companies];

  return (
    <main className="relative flex min-h-[calc(100vh-180px)] w-full flex-col items-center justify-center gap-16 px-4 py-16 text-center sm:gap-24 sm:py-24">
      <section className="space-y-6">
        <p className="text-[12px] font-semibold uppercase tracking-[0.35em] text-slate-200">
          Hire smarter, hire faster
        </p>
        <div className="flex flex-col items-center gap-6 font-extrabold tracking-tight text-white">
          <h1 className="gradient-title text-4xl leading-tight sm:text-6xl lg:text-[70px]">
            Find Your Dream Job
          </h1>
        </div>
         
        <p className="mx-auto max-w-3xl text-sm text-slate-300 sm:text-lg">
          Explore thousands of job listings or find the perfect candidate with a platform built for modern teams.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button
            asChild
            size="lg"
            className="w-full bg-[#2563EB] px-12 py-5 text-base font-semibold text-white shadow-lg transition hover:bg-[#1d4ed8] sm:w-auto"
          >
            <Link to="/jobs">Find Jobs</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="w-full bg-[#DC2626] px-12 py-5 text-base font-semibold text-white shadow-lg transition hover:bg-[#b91c1c] sm:w-auto"
          >
            <Link to="/post-job">Post a Job</Link>
          </Button>
        </div>
        <div className="mt-8 h-px w-32 bg-white/20" />
      </section>

      <section className="relative w-full overflow-hidden">
        <div className="logo-marquee">
          {marqueeLogos.map((company, index) => (
            <img
              key={`${company.id}-${index}`}
              src={company.path}
              alt={company.name}
              className="h-2 w-auto max-h-8 max-w-[120px] object-contain opacity-70 transition hover:opacity-100 sm:h-2.5 lg:h-3"
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
