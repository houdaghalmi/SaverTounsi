"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full py-24 bg-gradient-to-r from-[#1a2a6c] to-[#b21f1f] text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
            Our Mission
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Empowering Tunisians to achieve financial freedom through smart budgeting and community-driven savings.
          </p>
          <div className="space-x-4">
            <Link href="/signup">
              <Button size="lg" className="bg-[#fdbb2d] text-[#1a2a6c] hover:bg-[#fdbb2d]/90 hover:scale-105 transition-all">
                Join Us Today
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Vision Section */}
      <section className="w-full py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-8 text-[#1a2a6c]">Our Vision</h2>
            <p className="text-lg text-muted-foreground mb-8">
              SaverTounsi was born from a simple idea: make financial management accessible and enjoyable for every Tunisian. 
              We believe that smart budgeting shouldn't be complicated, and saving money should be rewarding.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full py-24 bg-[#fdbb2d]/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-[#1a2a6c]">What Makes Us Different</h2>
            <p className="text-xl text-muted-foreground">Our unique approach to personal finance</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 border-none bg-gradient-to-br from-[#fdbb2d]/10 to-transparent backdrop-blur-sm">
                  <CardHeader>
                    <feature.icon className="w-12 h-12 text-[#1a2a6c] mb-4" />
                    <CardTitle className="text-[#1a2a6c]">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[#1a2a6c]/80">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-[#1a2a6c]">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground">The people behind SaverTounsi</p>
          </motion.div>

          <div className="flex justify-center w-full">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg max-w-[400px] transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-[#1a2a6c]">{member.name}</h3>
                    <p className="text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="w-full py-24 bg-gradient-to-br from-[#1a2a6c] to-[#b21f1f] text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-4xl font-bold mb-8">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of Tunisians who are taking control of their financial future with SaverTounsi.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-[#fdbb2d] text-[#1a2a6c] hover:bg-[#fdbb2d]/90 hover:scale-105 transition-all">
              Get Started Now
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Community Driven",
    description: "Join a community of like-minded savers sharing tips and experiences.",
    icon: CommunityIcon
  },
  {
    title: "Local Focus",
    description: "Tailored specifically for the Tunisian market and financial ecosystem.",
    icon: LocalIcon
  },
  {
    title: "Smart Analytics",
    description: "Advanced tracking and insights to help you make better financial decisions.",
    icon: AnalyticsIcon
  }
];

const team = [
  {
    name: "Houda Ghalmi",
    role: "Web Developer And Creator Of SaverTounsi",
    image: "/images/team/houda.jpeg"
  },
  
];

function CommunityIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

function LocalIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
}

function AnalyticsIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  );
}