"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

const categories = [
  {
    id: "patient-search",
    number: "01",
    title: "Patient Search & Directory",
    description: "Finding the right patient quickly without navigating multiple screens is critical for administrative staff.",
    considerations: [
      "Robust global search indexing",
      "Instant filtering by status, DOB, or MRN",
      "Clear visual indicators for active vs discharged"
    ],
    image: "/images/showcase/search.jpg",
    alt: "Patient Search Interface",
    caption: "A unified patient directory with inline filtering and sorting."
  },
  {
    id: "patient-records",
    number: "02",
    title: "Electronic Health Records",
    description: "Medical histories must be presented in a timeline format that allows clinicians to parse months of data in seconds.",
    considerations: [
      "Chronological timeline visualization",
      "Integrated vital sign charting",
      "Quick access to recent lab documents"
    ],
    image: "/images/showcase/record.jpg",
    alt: "Patient Medical Record",
    caption: "A structured patient profile combining history timelines and vital trends."
  },
  {
    id: "appointments",
    number: "03",
    title: "Intelligent Scheduling",
    description: "Managing provider availability across multiple departments requires a highly dense but readable calendar interface.",
    considerations: [
      "Clear distinction between available and booked slots",
      "Contextual side panels for appointment details",
      "One-click status updates and rescheduling"
    ],
    image: "/images/showcase/appointments.jpg",
    alt: "Appointment Scheduling Calendar",
    caption: "A comprehensive weekly scheduling view with contextual actions."
  },
  {
    id: "analytics",
    number: "04",
    title: "Clinical Dashboards",
    description: "Hospital administrators rely on high-level analytics to monitor facility health, readmission rates, and critical alerts.",
    considerations: [
      "At-a-glance KPIs with delta indicators",
      "Interactive trend visualizations",
      "Prioritized alert surfacing"
    ],
    image: "/images/showcase/dashboard.jpg",
    alt: "Healthcare Analytics Dashboard",
    caption: "An enterprise analytics dashboard highlighting patient admits and critical alerts."
  }
]

export default function ShowcasePage() {
  const [activeSection, setActiveSection] = useState("patient-search")

  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(c => document.getElementById(c.id))
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(categories[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const offset = 100 // adjust for sticky header
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
  } as any

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-24 md:px-12 md:pt-48 md:pb-32 max-w-7xl mx-auto">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="max-w-3xl"
        >
          <motion.p variants={fadeInUp} className="text-sm font-semibold uppercase tracking-widest text-teal-700 mb-6">
            Healthcare Product Design
          </motion.p>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8 text-slate-900">
            Designing Clearer Digital Healthcare Experiences.
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl leading-relaxed text-slate-600 mb-12 max-w-2xl">
            A comprehensive look at how SlotUrSelf implements modern, friction-free UX principles to solve complex administrative challenges in clinical environments.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors">
              Explore Live Product
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Table of Contents - Sticky */}
      <div className="sticky top-16 z-40 w-full border-y border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <ul className="flex items-center gap-8 overflow-x-auto no-scrollbar whitespace-nowrap text-sm font-medium text-slate-500">
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => scrollTo(category.id)}
                  className={`transition-colors duration-300 ${activeSection === category.id ? "text-teal-700 font-semibold" : "hover:text-slate-900"}`}
                >
                  <span className="mr-2 opacity-50">{category.number}</span>
                  {category.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Categories Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 space-y-48">
        {categories.map((category) => (
          <section id={category.id} key={category.id} className="scroll-mt-32">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24"
            >
              {/* Editorial Text Column */}
              <div className="lg:col-span-4 space-y-8">
                <div>
                  <motion.span variants={fadeInUp} className="text-teal-700 font-mono text-sm tracking-wider mb-4 block">
                    {category.number}
                  </motion.span>
                  <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">
                    {category.title}
                  </motion.h2>
                  <motion.p variants={fadeInUp} className="text-lg text-slate-600 leading-relaxed">
                    {category.description}
                  </motion.p>
                </div>
                
                <motion.div variants={fadeInUp} className="pt-8 border-t border-slate-200">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-6">Key Considerations</h3>
                  <ul className="space-y-4">
                    {category.considerations.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-teal-600 mr-3 shrink-0 mt-0.5" />
                        <span className="text-slate-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Large Image Column */}
              <motion.div 
                variants={fadeInUp}
                className="lg:col-span-8"
              >
                <div className="group relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm transition-transform duration-700 hover:scale-[1.01] hover:shadow-md">
                  <div className="aspect-[16/9] w-full relative">
                    <Image
                      src={category.image}
                      alt={category.alt}
                      fill
                      className="object-contain p-4 md:p-8"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority={category.number === "01"}
                    />
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-500 text-center font-medium">
                  {category.caption}
                </p>
              </motion.div>
            </motion.div>
          </section>
        ))}
      </div>

      {/* Final CTA */}
      <section className="border-t border-slate-200 bg-slate-50 py-32 mt-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold tracking-tight text-slate-900 mb-6">
            Ready to experience it yourself?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            SlotUrSelf is built to reduce friction in healthcare administration through purposeful, proven design patterns.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link href="/" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-teal-700 rounded-md hover:bg-teal-800 transition-colors shadow-sm">
              Open Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 text-center">
        <p className="text-sm text-slate-500">
          developed by <span className="font-semibold text-teal-700">TechSqad</span>
        </p>
      </footer>
    </div>
  )
}
