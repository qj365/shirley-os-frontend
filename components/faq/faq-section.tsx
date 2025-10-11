"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title: string;
  faqs: FaqItem[];
}

const FaqSection = ({ title, faqs }: FaqSectionProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="mb-12">
      <div className="max-w-3xl mx-auto border-b pb-10 border-gray-200">
        <h2 className="text-xl font-bold mb-6">{title}</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="py-2">
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex justify-between items-center text-left bg-gray-100 p-4 rounded-md"
            >
              <span className="text-lg font-semibold">{faq.question}</span>
              {openFaq === index ? <Minus /> : <Plus />}
            </button>
            {openFaq === index && (
              <div className="mt-1 p-4 bg-yellow-400 text-white rounded-md">
                <div
                  className="text-lg font-medium"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;