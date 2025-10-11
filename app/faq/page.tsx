import FaqHero from "@/components/faq/faq-hero";
import FaqSection from "@/components/faq/faq-section";
import { faqSections } from "@/constants/faq-data/faqs";

const Faq = () => {
  return (
    <main>
      <FaqHero />
      <section className="py-16 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
            Here, you&apos;ll find answers to the most common questions about
            Shirley&apos;s, our products, and how we bring the authentic taste
            of West Africa to your kitchen
          </p>
        </div>
        {faqSections.map((section, index) => (
          <FaqSection
            key={index}
            title={section.title}
            faqs={section.faqs}
          />
        ))}
      </section>
    </main>
  );
};

export default Faq;