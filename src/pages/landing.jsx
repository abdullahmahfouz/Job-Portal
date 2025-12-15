import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import faqs from "../data/faqs.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

// Public landing page that shows hero, companies slider and FAQs
const LandingPage = () => {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 pt-20">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="gradient-title font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tight">
            Find Your Dream Job
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
            Explore thousands of job listings or find the perfect candidate with a platform built for modern teams.
          </p>
          
          {/* Button Cards */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Card className="w-full sm:w-auto">
              <CardContent className="p-6">
                <Link to="/jobs">
                  <Button size="lg" className="w-full">
                    Find Jobs
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="w-full sm:w-auto">
              <CardContent className="p-6">
                <Link to="/post-job">
                  <Button size="lg" variant="destructive" className="w-full">
                    Post a Job
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="flex gap-8 items-center">
              {companies.map(({ name, id, path }) => (
                <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                  <img
                    src={path}
                    alt={name}
                    className="h-12 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity mx-auto"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="multiple" className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
