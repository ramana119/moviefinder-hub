
import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, MoreHorizontal, Phone, Video, Bot, User, Info, ArrowRight, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Define message types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

// Sample pre-defined AI responses
const aiResponses = [
  "Thanks for reaching out! I'd be happy to help with your travel planning.",
  "Great question! Based on your preferences, I'd recommend visiting early morning or late afternoon to avoid crowds.",
  "The best time to visit that destination would be during weekdays, especially Tuesday to Thursday.",
  "Our premium subscription offers exclusive access to crowd predictions, priority customer support, and special discounts on bookings.",
  "You can modify your booking up to 48 hours before your scheduled visit without any cancellation fee.",
  "Would you like me to recommend some less crowded alternatives to that popular destination?",
  "I'll check the current crowd levels at that location for you. One moment please...",
  "Based on our data, crowd levels are predicted to be lowest between 9-10 AM and after 4 PM for that destination."
];

// Sample human agent responses
const agentResponses = [
  "Hello! I'm Priya from Zenway Travels customer support. How can I assist you today?",
  "I understand your concern. Let me check your booking details right away.",
  "I've updated your reservation to reflect the new dates. You'll receive a confirmation email shortly.",
  "We can definitely arrange for a guide who speaks that language. Let me make a note in your booking.",
  "I've checked with our operations team, and they've confirmed that special accommodation is available.",
  "Thank you for your patience. I've been able to process your refund, which should appear in your account within 3-5 business days."
];

const Support: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('ai-assistant');
  const [messages, setMessages] = useState<Message[]>([]);
  const [agentMessages, setAgentMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [agentInput, setAgentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentIsTyping, setAgentIsTyping] = useState(false);
  const [agentOnline, setAgentOnline] = useState(false);
  const [agentResponseTime, setAgentResponseTime] = useState(3); // minutes
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const agentMessagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    agentMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentMessages]);

  // Initial bot message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: "Hi there! I'm Travelbot, your AI assistant for all things travel. How can I help you today?",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    }
  }, [messages]);

  // Initial live chat setup
  useEffect(() => {
    const checkAgentAvailability = () => {
      // Simulate agent availability changing
      const isAvailable = Math.random() > 0.3;
      setAgentOnline(isAvailable);
      setAgentResponseTime(Math.floor(Math.random() * 5) + 1);
    };
    
    checkAgentAvailability();
    const interval = setInterval(checkAgentAvailability, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (agentMessages.length === 0) {
      setAgentMessages([
        {
          id: '1',
          text: "Welcome to Zenway Travels live support. Please share your query and an agent will assist you shortly.",
          sender: 'agent',
          timestamp: new Date()
        }
      ]);
    }
  }, [agentMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Simulate bot thinking
    setIsTyping(true);
    
    // Delayed bot response
    setTimeout(() => {
      // Random response from array
      const botResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendAgentMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (agentInput.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: agentInput,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    
    setAgentMessages(prev => [...prev, userMessage]);
    setAgentInput('');
    
    // Simulate agent typing if they're online
    if (agentOnline) {
      setAgentIsTyping(true);
      
      // Delayed agent response
      setTimeout(() => {
        const agentResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];
        
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: agentResponse,
          sender: 'agent',
          timestamp: new Date()
        };
        
        setAgentMessages(prev => [...prev, agentMessage]);
        setAgentIsTyping(false);
      }, 2000);
    } else {
      // If agent is offline, show a standard message
      setTimeout(() => {
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Thank you for your message. Our team will get back to you as soon as possible. Current response time is approximately " + agentResponseTime + " minutes.",
          sender: 'agent',
          timestamp: new Date()
        };
        
        setAgentMessages(prev => [...prev, agentMessage]);
      }, 1000);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Customer Support</h1>
              <p className="text-gray-600 mt-1">We're here to help with all your travel needs</p>
            </div>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="ai-assistant" className="flex items-center">
                <Bot className="mr-2 h-4 w-4" /> AI Assistant
              </TabsTrigger>
              <TabsTrigger value="live-support" className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" /> Live Support
                {agentOnline && <Badge className="ml-2 bg-green-500">Online</Badge>}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai-assistant" className="space-y-4">
              <Card className="border border-gray-200">
                <CardHeader className="border-b bg-gray-50 p-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-primary text-white">AI</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">Travel Assistant</CardTitle>
                      <p className="text-sm text-gray-500">AI-powered support</p>
                    </div>
                    <Badge className="ml-auto bg-green-500">Online</Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg p-3 ${
                            message.sender === 'user'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/60' : 'text-gray-500'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="max-w-[75%] rounded-lg p-3 bg-gray-100">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></div>
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
                
                <CardFooter className="border-t p-3">
                  <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-grow"
                    />
                    <Button type="submit">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardFooter>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Popular Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li className="text-primary hover:underline cursor-pointer">How do I cancel my booking?</li>
                      <li className="text-primary hover:underline cursor-pointer">What is your refund policy?</li>
                      <li className="text-primary hover:underline cursor-pointer">How accurate are the crowd predictions?</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">AI Assistant Capabilities</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p>Our AI assistant can help with:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Booking information and modifications
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Crowd prediction inquiries
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Destination recommendations
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Travel planning assistance
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="live-support" className="space-y-4">
              <Card className="border border-gray-200">
                <CardHeader className="border-b bg-gray-50 p-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" />
                      <AvatarFallback className="bg-primary">CS</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">Customer Support</CardTitle>
                      <p className="text-sm text-gray-500">
                        {agentOnline 
                          ? 'Agent online - Typical response time: <1 min' 
                          : `Agents busy - Response time: ~${agentResponseTime} min`}
                      </p>
                    </div>
                    <Badge className={`ml-auto ${agentOnline ? 'bg-green-500' : 'bg-amber-500'}`}>
                      {agentOnline ? 'Online' : 'Busy'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                    {agentMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg p-3 ${
                            message.sender === 'user'
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/60' : 'text-gray-500'}`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {agentIsTyping && (
                      <div className="flex justify-start">
                        <div className="max-w-[75%] rounded-lg p-3 bg-gray-100">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></div>
                            <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={agentMessagesEndRef} />
                  </div>
                </CardContent>
                
                <CardFooter className="border-t p-3">
                  <form onSubmit={handleSendAgentMessage} className="flex w-full space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={agentInput}
                      onChange={(e) => setAgentInput(e.target.value)}
                      className="flex-grow"
                    />
                    <Button type="submit">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardFooter>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Contact Methods</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="space-y-2">
                      <p className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        Call us: +91 1800-200-3000
                      </p>
                      <p className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-primary" />
                        Email: help@zenwaytravels.com
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Phone className="h-4 w-4 mr-2" /> Request Callback
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Support Hours</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      Live Chat: 24/7
                    </p>
                    <p className="flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-2 text-primary" />
                      Phone Support: 9AM - 7PM IST (Mon-Sat)
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Support;
