import FaqHero from '@/components/faq/faq-hero';
import FaqSection from '@/components/faq/faq-section';
import { faqSections } from '@/constants/faq-data/faqs';

const Faq = () => {
  return (
    <div>
      <FaqHero />
      <section className="px-4 py-16 sm:px-8 md:px-16 lg:px-24">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600 md:text-xl">
            Here, you&apos;ll find answers to the most common questions about Shirley&apos;s, our
            products, and how we bring the authentic taste of West Africa to your kitchen
          </p>
        </div>
        {faqSections.map((section, index) => (
          <FaqSection key={index} title={section.title} faqs={section.faqs} />
        ))}
      </section>
    </div>
  );
};

export default Faq;
