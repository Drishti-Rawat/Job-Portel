'use client'
import Image from "next/image";
import { Permanent_Marker } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400", // You can adjust the weight if needed
});
import  Autoplay  from "embla-carousel-autoplay";
import {companies, faqs} from "../data/index";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


// const companies = [
//   {
//     name: "amazon",
//     path: "/companies/amazon.svg",
//     id: 1,
//   },
//   {
//     name: "atlassian",
//     path: "/companies/atlassian.svg",
//     id: 2,
//   },
//   {
//     name: "google",
//     path: "/companies/google.webp",
//     id: 3,
//   },
//   {
//     name: "ibm",
//     path: "/companies/ibm.svg",
//     id: 4,
//   },
//   {
//     name: "meta",
//     path: "/companies/meta.svg",
//     id: 5,
//   },
//   {
//     name: "microsoft",
//     path: "/companies/microsoft.webp",
//     id: 6,
//   },
//   {
//     name: "netflix",
//     path: "/companies/netflix.png",
//     id: 7,
//   },
//   {
//     name: "uber",
//     path: "/companies/uber.svg",
//     id: 8,
//   },
// ];

export default function Home() {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center ">
        <h1 className="flex flex-col justify-center items-center gradient gradient-title text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-tighter py-4">
          Find Your Dream Job{" "}
          <span className="flex items-center justify-center gap-2 sm:gap-6">
            and get{" "}
            <span
              className={`${permanentMarker.className} text-5xl sm:text-7xl lg:text-9xl  `}
            >
              Hired{" "}
            </span>
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl ">
          Explore a wide range of job opportunities and find your perfect fit
          here.
          {/* Apply now and take your career to the next level. */}
        </p>
      </section>

      <div className="flex justify-center  gap-6">
        {/* buttona */}
        <Link href="/job-listing">
          <Button variant="blue" size="xl">
            {" "}
            Find Jobs
          </Button>
        </Link>
        <Link href="/post-job">
          <Button variant="destructive" size="xl">
            Post a Job
          </Button>
        </Link>
      </div>
      {/* crousel */}
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full py-10"
      >
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
              <Image
                src={path}
                alt={name}
                width={100}
                height={100}
                className="h-9 sm:h-14 object-contain"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* banner */}
      <Image
        src="/hirex.webp"
        alt="banner"
        width={1000}
        height={1000} className="w-full opacity-65"
      />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* cards */}
        <Card>
          <CardHeader>
            <CardTitle>For Job Seekers</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
            <p>
             Search and apply for your dream job, track your applications, and stay updated with the latest job opportunities.
            </p>
            <Link href="/job-listing">
            <Button variant="blue" size="sm" className="mt-4">
              {" "}
              Find Jobs
            </Button>
            </Link>
          </CardContent>
        </Card>
        <Card >
          <CardHeader>
            <CardTitle>For Employers</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
            <p className="">
              Post a job and reach out to talented candidates. Hire the best talent. 
            </p>
            <Link href="/post-job">
            <Button variant="destructive" size="sm" className="mt-4">
              Post a Job
            </Button>
            </Link> 
          </CardContent>
        </Card>
        
        </section>

      {/* accordan */}
      <Accordion type="single" collapsible>
        {
          faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))
        }
        
      </Accordion>
    </main>
  );
}
