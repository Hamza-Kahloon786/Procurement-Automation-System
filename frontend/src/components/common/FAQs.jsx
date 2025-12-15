import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  ArrowLeft, 
  ChevronDown,
  Minus,
  Search
} from 'lucide-react';
import { SlideUp, FadeIn } from './AnimatedComponents';

const FAQs = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: 'How do I create a procurement request?',
      answer: 'Navigate to "Create Request" in the sidebar, fill in the details including title, description, budget, and deadline. Once submitted, vendors will receive notifications and can submit their quotations.',
      category: 'Getting Started'
    },
    {
      question: 'What file formats are supported for quotations?',
      answer: 'Currently, we support PDF quotations. Our AI-powered extraction system automatically extracts item descriptions, quantities, prices, and totals from PDF files, regardless of the PDF layout or format.',
      category: 'Technical'
    },
    {
      question: 'How do I verify my vendor account?',
      answer: 'Admin users verify vendor accounts. If your account needs verification, contact support at hamzaakahloon903@gmail.com or call +923091453950. Once verified, you\'ll be able to submit quotations to all available requests.',
      category: 'Account'
    },
    {
      question: 'Can I export quotation comparisons?',
      answer: 'Yes! Use the "Export to Excel" feature available in the quotation comparison view. This will download a detailed Excel file with all quotations, items, prices, and comparison metrics for further analysis.',
      category: 'Features'
    },
    {
      question: 'How does the AI-powered quotation comparison work?',
      answer: 'Our system automatically extracts data from PDF quotations using advanced AI technology. It identifies items, quantities, unit prices, and totals, then normalizes the data for side-by-side comparison. The system can handle various PDF formats and layouts.',
      category: 'Technical'
    },
    {
      question: 'What happens after I submit a quotation?',
      answer: 'After submission, your quotation status will be "Submitted" and pending review. The buyer will be able to see your quotation along with others. If accepted, your status will change to "Accepted" and you\'ll be notified.',
      category: 'Vendor'
    },
    {
      question: 'How do I track my procurement requests?',
      answer: 'You can view all your requests in the "My Requests" section. Each request shows the number of quotations received, status, and deadline. Click on any request to view detailed quotations and comparisons.',
      category: 'Buyer'
    },
    {
      question: 'Can I edit a quotation after submission?',
      answer: 'Currently, quotations cannot be edited after submission. If you need to make changes, you may need to contact the buyer or submit a new quotation if the request is still open.',
      category: 'Vendor'
    },
    {
      question: 'How do I change my password?',
      answer: 'Go to Settings from your profile menu, then navigate to the Security section. Enter your current password and set a new one. Make sure to use a strong password for better security.',
      category: 'Account'
    },
    {
      question: 'What is the difference between buyer and vendor roles?',
      answer: 'Buyers create procurement requests and receive quotations from vendors. Vendors browse available requests and submit quotations. Admins manage users, verify vendors, and oversee platform operations.',
      category: 'Getting Started'
    },
    {
      question: 'How do I delete my account?',
      answer: 'Contact support at hamzaakahloon903@gmail.com to request account deletion. Please note that this action is permanent and cannot be undone.',
      category: 'Account'
    },
    {
      question: 'Can I compare quotations from different vendors?',
      answer: 'Yes! When viewing a request, you can see all submitted quotations in a comparison view. The system automatically extracts and displays items, prices, and totals side-by-side for easy comparison.',
      category: 'Features'
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <SlideUp>
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900">
                  Frequently Asked Questions
                </h1>
                <p className="text-gray-600 mt-2">Find answers to common questions</p>
              </div>
            </div>
          </div>
        </SlideUp>

        {/* Search Bar */}
        <SlideUp delay={100}>
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
              />
            </div>
          </div>
        </SlideUp>

        {/* FAQs List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <FadeIn>
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No FAQs found matching your search.</p>
              </div>
            </FadeIn>
          ) : (
            filteredFAQs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <FadeIn key={index} delay={index * 50}>
                  <div className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 transition-all duration-300">
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors rounded-xl"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-md">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {faq.question}
                        </h3>
                      </div>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        {isOpen ? (
                          <Minus className="h-5 w-5 text-primary-600" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                    </button>
                    
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="px-5 pb-5">
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed mt-3">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })
          )}
        </div>

        {/* Contact Support */}
        <SlideUp delay={600}>
          <div className="mt-12 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="h-6 w-6 text-primary-600" />
              <p className="font-semibold text-gray-900">Still have questions?</p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Can't find what you're looking for? Contact our support team for assistance.
            </p>
            <div className="flex gap-3">
              <a
                href="mailto:hamzaakahloon903@gmail.com"
                className="px-4 py-2 bg-white hover:bg-gray-50 text-primary-600 rounded-lg font-semibold text-sm transition-colors"
              >
                Email Support
              </a>
              <a
                href="tel:+923091453950"
                className="px-4 py-2 bg-white hover:bg-gray-50 text-primary-600 rounded-lg font-semibold text-sm transition-colors"
              >
                Call Support
              </a>
            </div>
          </div>
        </SlideUp>
      </div>
    </div>
  );
};

export default FAQs;

