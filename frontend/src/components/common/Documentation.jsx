import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Book, 
  ArrowLeft, 
  FileText, 
  ShoppingBag, 
  Package, 
  Shield, 
  FileSpreadsheet,
  Settings,
  Users,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { SlideUp, FadeIn } from './AnimatedComponents';

const Documentation = () => {
  const navigate = useNavigate();

  const guides = [
    {
      icon: ShoppingBag,
      title: 'Getting Started with ProcureHub',
      description: 'Learn the basics of using ProcureHub for your procurement needs',
      sections: [
        'Creating your account and logging in',
        'Understanding the dashboard interface',
        'Navigating between different sections',
        'Setting up your profile and preferences'
      ]
    },
    {
      icon: FileText,
      title: 'How to Create Procurement Requests',
      description: 'Step-by-step guide to creating and managing procurement requests',
      sections: [
        'Accessing the Create Request page',
        'Filling in request details (title, description, budget)',
        'Setting deadlines and requirements',
        'Submitting and tracking your requests',
        'Managing multiple requests simultaneously'
      ]
    },
    {
      icon: Package,
      title: 'Submitting Quotations as a Vendor',
      description: 'Complete guide for vendors to submit competitive quotations',
      sections: [
        'Browsing available procurement requests',
        'Understanding request requirements',
        'Preparing your quotation PDF',
        'Uploading and submitting quotations',
        'Tracking quotation status and responses'
      ]
    },
    {
      icon: Shield,
      title: 'Understanding User Roles & Permissions',
      description: 'Learn about different user roles and their capabilities',
      sections: [
        'Buyer role: Creating requests and comparing quotations',
        'Vendor role: Submitting quotations and managing bids',
        'Admin role: User management and platform oversight',
        'Role-based access and permissions',
        'Account verification process'
      ]
    },
    {
      icon: FileSpreadsheet,
      title: 'PDF Quotation Upload & Processing',
      description: 'How to upload PDF quotations and understand the extraction process',
      sections: [
        'Supported PDF formats and requirements',
        'AI-powered data extraction technology',
        'Automatic item and price recognition',
        'Handling complex PDF layouts',
        'Troubleshooting extraction issues'
      ]
    },
    {
      icon: BarChart3,
      title: 'Comparing Multiple Quotations',
      description: 'Use advanced comparison tools to evaluate vendor proposals',
      sections: [
        'Viewing all quotations for a request',
        'Side-by-side comparison features',
        'Understanding comparison metrics',
        'Identifying best value options',
        'Making informed procurement decisions'
      ]
    },
    {
      icon: FileSpreadsheet,
      title: 'Exporting Data to Excel',
      description: 'Export quotation comparisons and reports for analysis',
      sections: [
        'Exporting quotation comparisons',
        'Excel file format and structure',
        'Understanding exported columns',
        'Using exported data for further analysis',
        'Sharing reports with team members'
      ]
    },
    {
      icon: Settings,
      title: 'Managing Your Profile & Settings',
      description: 'Customize your account settings and manage your profile',
      sections: [
        'Updating personal information',
        'Changing password and security settings',
        'Notification preferences',
        'Account preferences and themes',
        'Managing company information'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-6xl mx-auto p-6 lg:p-8">
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
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Book className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900">
                  Documentation
                </h1>
                <p className="text-gray-600 mt-2">Comprehensive guides and tutorials</p>
              </div>
            </div>
          </div>
        </SlideUp>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {guides.map((guide, index) => {
            const Icon = guide.icon;
            return (
              <FadeIn key={index} delay={index * 100}>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.title}</h3>
                      <p className="text-gray-600 text-sm">{guide.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex-1 flex flex-col">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Topics covered:</p>
                    <ul className="space-y-1.5 flex-1">
                      {guide.sections.map((section, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                          <span>{section}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>

        {/* Footer Note */}
        <SlideUp delay={800}>
          <div className="mt-12 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200">
            <div className="flex items-center gap-3">
              <Book className="h-6 w-6 text-primary-600" />
              <div>
                <p className="font-semibold text-gray-900">Need more help?</p>
                <p className="text-sm text-gray-600">Check out our FAQs or contact support for assistance.</p>
              </div>
            </div>
          </div>
        </SlideUp>
      </div>
    </div>
  );
};

export default Documentation;

