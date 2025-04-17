
import React from 'react';
import { Mail, Clock, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Customer Support</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">How Can We Help You?</h2>
            <p className="text-gray-600 mb-6">
              We're here to help with any questions or issues you may have about Zenway Travels. 
              Browse through our FAQ section or contact us directly.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Contact Support Team</h3>
                <p className="text-sm text-gray-600">
                  Our support team is available 24/7 to assist you with any questions or concerns.
                </p>
                <div className="mt-4 flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">support@zenway.com</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Support Hours</h3>
                <p className="text-sm text-gray-600">
                  We're available to assist you during the following hours:
                </p>
                <div className="mt-4 flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">24/7, 365 days a year</span>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">How do I cancel my booking?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      You can cancel your booking by going to "My Bookings" in your account and selecting the booking you wish to cancel. Follow the cancellation instructions and review our refund policy for more details.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-b pb-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">What is the Premium membership?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Premium membership gives you access to exclusive benefits such as priority booking, special discounts, and personalized travel recommendations. Visit our Premium page for more information.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-b pb-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">How accurate are your crowd predictions?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Our crowd predictions are based on historical data, current bookings, and real-time information from our partners. While we strive for accuracy, predictions can change due to unexpected events or weather conditions.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-b pb-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Can I modify my travel dates after booking?</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Yes, you can modify your travel dates up to 72 hours before your scheduled departure, subject to availability and potential price differences. Visit "My Bookings" in your account to make changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-6">
              If you couldn't find the answer to your question, please fill out the form below and we'll get back to you as soon as possible.
            </p>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Your email"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Subject of your inquiry"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600">
                    I agree to the <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>
                  </label>
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
