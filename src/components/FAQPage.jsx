import React from 'react';

const faqs = [
  {
    question: 'What is Memory Vault?',
    answer: 'Memory Vault is a platform that allows you to securely store digital time capsules containing memories, messages, and media to be unlocked at a future date.'
  },
  {
    question: 'How do I create a capsule?',
    answer: 'To create a capsule, fill in the required details such as title, description, media links, unlock date, and optional trusted contacts. Submit the form and your capsule will be safely stored.'
  },
  {
    question: 'Who can see my capsule?',
    answer: 'Only you and the trusted contacts you specify can view the capsule after it unlocks, depending on your privacy settings.'
  },
  {
    question: 'Will my trusted contacts be notified?',
    answer: 'Yes, an email notification is sent to your trusted contacts when a capsule is created and again one day before it unlocks.'
  },
  {
    question: 'What types of media can I attach?',
    answer: 'You can attach Google Drive links to images, videos, or documents. Make sure the links are publicly accessible or shared with the trusted contacts.'
  },
  {
    question: 'What happens if the unlock date is in the past?',
    answer: 'If the unlock date is already passed, and you or your trusted contacts have access, the capsule will be viewable immediately.'
  },
  {
    question: 'Can I share a capsule with multiple people?',
    answer: 'Yes, you can enter multiple trusted contact emails separated by commas. All will get access once the capsule unlocks.'
  },
  {
    question: 'Do I need to sign in to view or create capsules?',
    answer: 'Yes, signing in ensures your capsules are securely linked to your account and only accessible by authorized users.'
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen py-12 px-6 bg-[#FDF6E3] text-[#3A2F2A] font-serif">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center" style={{ color: '#7E6651' }}>
          Frequently Asked Questions
        </h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="border-b border-[#B48A78] pb-4 group cursor-pointer transition-all"
            >
              <summary className="text-xl font-semibold flex justify-between items-center group-open:text-[#D97D54]">
                {faq.question}
                <span className="ml-2 text-[#D97D54] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-2 text-base text-[#3A2F2A] leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
} 
