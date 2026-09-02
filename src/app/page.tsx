import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import CourseHighlight from "@/components/home/CourseHighlight";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <CourseHighlight />
      <Testimonials />

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-surface to-accent/10 p-10 sm:p-14">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to Start Your DSA Journey?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              Join 2847 students already mastering Data Structures & Algorithms with KERNAL.
            </p>
            <a
              href="/courses/dsa-masterclass"
              className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:scale-[1.02]"
            >
              Get Started for ₹99
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
