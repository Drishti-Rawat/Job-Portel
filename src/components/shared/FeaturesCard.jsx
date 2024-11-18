'use client'
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";

export const FeatureCard = ({ 
  title, 
  icon: Icon, 
  description, 
  buttonText, 
  buttonLink, 
  gradient, 
  hoverGradient, 
  buttonColor 
}) => (
  <motion.div 
    whileHover={{ scale: 1.02 }} 
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    className="h-full"
  >
    <Card className={`h-full ${gradient} border-none shadow-xl backdrop-blur-xl hover:shadow-2xl transition-all duration-500`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-bold">
          <div className={`${hoverGradient} p-3 rounded-xl`}>
            <Icon className="h-6 w-6" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <p className="text-lg leading-relaxed opacity-90">
          {description}
        </p>
        <Link href={buttonLink} className="mt-auto">
          <Button 
            size="lg"
            className={`${buttonColor} w-full transform hover:scale-105 transition-all duration-300`}
          >
            {buttonText}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  </motion.div>
);