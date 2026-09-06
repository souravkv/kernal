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

      <section className="py-32 sm:py-40">
        <div className="mx-auto max-w-[1400px] px-6 text-center sm:px-10">
          <div className="rounded-none border border-[var(--border)] bg-[var(--surface)] p-12 sm:p-20">
            <h2 className="heading-lg mb-4">
              Ready to begin?
            </h2>
            <p className="body-lg mx-auto mb-10 max-w-lg text-[var(--muted)]">
              Join students already mastering DSA with Kernal.
            </p>
            <a
              href="/courses/dsa-masterclass"
              className="inline-flex rounded-full border border-[var(--fg)] bg-[var(--fg)] px-8 py-3 text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--bg)] transition-all duration-300 hover:bg-transparent hover:text-[var(--fg)]"
            >
              Get Started for ₹99
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
