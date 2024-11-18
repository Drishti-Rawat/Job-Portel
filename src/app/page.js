'use client'
import { Permanent_Marker } from "next/font/google";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { companies, faqs } from "../data/index";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Sparkles, Briefcase, Users, ChevronRight } from "lucide-react";
import { FeatureCard } from "@/components/shared/FeaturesCard";

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
});

const features = [
  {
    title: "For Job Seekers",
    icon: Users,
    description: "Search and apply for your dream job, track your applications, and stay updated with the latest job opportunities.",
    buttonText: "Find Jobs",
    buttonLink: "/job-listing",
    gradient: "bg-gradient-to-br from-blue-900/80 via-blue-800/50 to-blue-900/30",
    hoverGradient: "bg-blue-500/20",
    buttonColor: "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-blue-500/25"
  },
  {
    title: "For Employers",
    icon: Briefcase,
    description: "Post job opportunities and connect with talented candidates. Find the perfect fit for your organization.",
    buttonText: "Post a Job",
    buttonLink: "/post-job",
    gradient: "bg-gradient-to-br from-rose-900/80 via-rose-800/50 to-rose-900/30",
    hoverGradient: "bg-rose-500/20",
    buttonColor: "bg-rose-500 hover:bg-rose-600 text-white shadow-lg hover:shadow-rose-500/25"
  }
];

export default function Home() {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20 relative">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 2 }}
          className="absolute top-20 left-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-40 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Hero Section */}
      <motion.section 
        className="text-center relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </motion.div>

        <h1 className="flex flex-col justify-center items-center text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-tighter">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Find Your Dream Job
          </span>
          <motion.span 
            className="flex items-center justify-center gap-2 sm:gap-6 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            and get{" "}
            <span className={`${permanentMarker.className} text-5xl sm:text-7xl lg:text-9xl text-rose-500`}>
              Hired
            </span>
          </motion.span>
        </h1>
        <motion.p 
          className="text-blue-200 mt-6 text-sm sm:text-xl max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Explore a wide range of job opportunities and find your perfect fit here.
        </motion.p>
      </motion.section>

      {/* CTA Buttons */}
      <motion.div 
        className="flex justify-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Link href="/job-listing">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
          >
            Find Jobs
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link href="/post-job">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg hover:shadow-rose-500/25 transform hover:scale-105 transition-all duration-300"
          >
            Post a Job
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>

      {/* Companies Carousel */}
      <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 1 }}
    className="relative py-10"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
    <Carousel
      plugins={[Autoplay({ delay: 2000 })]}
      className="w-full"
    >
      <CarouselContent className="flex gap-5 sm:gap-10">
        {companies.map(({ name, id, path }) => (
          <CarouselItem key={id} className="basis-1/3 lg:basis-1/6 flex items-center justify-center">
            <motion.div 
              className="h-20 w-full flex items-center justify-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {path ? (
                <img 
                  src={path} 
                  alt={`${name} logo`} 
                  className="h-8 w-auto object-contain filter brightness-100  hover:opacity-100 transition-opacity"
                />
              ) : (
                <span className="text-lg font-semibold bg-gradient-to-r from-gray-200 to-gray-400 text-transparent bg-clip-text hover:from-white hover:to-gray-200 transition-all duration-300">
                  {name}
                </span>
              )}
            </motion.div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  </motion.section>

      {/* Feature Cards */}
      <motion.section 
      className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
    >
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </motion.section>

      {/* FAQ Section */}
      <motion.section
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 1.4 }}
    className="pb-10 max-w-3xl mx-auto w-full"
  >
    <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
      Frequently Asked Questions
    </h2>
    <Accordion type="single" collapsible className="space-y-4">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.4 + index * 0.1 }}
        >
          <AccordionItem 
            value={`item-${index}`}
            className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-600/50 transition-all duration-300 shadow-lg"
          >
            <AccordionTrigger className="px-6 py-4 text-gray-200 hover:text-white hover:bg-gray-700/30 text-left">
              <span className="text-lg font-medium">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 text-gray-300 bg-gray-800/30">
              <p className="leading-relaxed">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        </motion.div>
      ))}
    </Accordion>
  </motion.section>
    </main>
  );
}