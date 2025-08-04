import React, { useState } from 'react';
import { ChevronDown, Play, CheckCircle, Target, Brain, BarChart3, Users, Star, ArrowRight, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductivityLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Target className="w-8 h-8 text-purple-400" />,
      title: "Smart Goal Breakdown",
      description: "Transform overwhelming goals into manageable tasks and microtasks with AI-powered suggestions."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      title: "Progress Tracking",
      description: "Visual progress bars and completion status keep you motivated and on track."
    },
    {
      icon: <Brain className="w-8 h-8 text-indigo-400" />,
      title: "AI Quiz Verification",
      description: "Ensure genuine understanding and completion with intelligent quiz-based verification."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-green-400" />,
      title: "Task Management",
      description: "Organize and prioritize your nested microtasks with an intuitive, user-friendly interface."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Developer",
      content: "This app transformed how I approach learning new technologies. Breaking down complex topics into verified microtasks made everything manageable.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Product Manager",
      content: "The AI quiz verification ensures I actually understand what I'm learning, not just checking boxes. Game-changer for skill development.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Designer",
      content: "Beautiful interface and the progress tracking keeps me motivated. Finally, a productivity app that works with how my brain thinks.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">ai tutor</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                <span>Services</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                <span>Courses</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#blog" className="text-gray-300 hover:text-white transition-colors">Blog</a>
            <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white transition-colors">Login</button>
            <button
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/signup')}
            >
              Sign up for free
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-800 border-t border-slate-700 px-6 py-4">
            <div className="flex flex-col space-y-4">
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#services" className="text-gray-300 hover:text-white transition-colors">Services</a>
              <a href="#courses" className="text-gray-300 hover:text-white transition-colors">Courses</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#blog" className="text-gray-300 hover:text-white transition-colors">Blog</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a>
              <div className="pt-4 border-t border-slate-700">
                <button className="text-gray-300 hover:text-white transition-colors mb-2">Login</button>
                <button
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                  onClick={() => navigate('/signup')}
                >
                  Sign up for free
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full px-4 py-2 mb-6">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">Education on your terms</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Personalized learning with an{' '}
                <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
                  AI assistant
                </span>
              </h1>
              
              <p className="text-lg text-gray-300 mb-8 max-w-2xl">
                Unlock your potential with our innovative AI tutor that adapts to your needs. Our platform helps you 
                master the material at a comfortable pace, focusing on topics that are difficult for you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  onClick={() => navigate('/dashboard')}
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border border-gray-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>

            <div className="relative">
              {/* Phone Mockup */}
              <div className="relative mx-auto w-80 h-96 bg-gradient-to-b from-blue-600 to-purple-600 rounded-3xl p-1 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-full bg-slate-900 rounded-3xl overflow-hidden">
                  {/* Phone Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">9:41</span>
                    <div className="flex space-x-1">
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                    </div>
                  </div>

                  {/* App Icons */}
                  <div className="p-4 grid grid-cols-4 gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xs font-bold">10</span>
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-xl"></div>
                    <div className="w-12 h-12 bg-green-500 rounded-xl"></div>
                    <div className="w-12 h-12 bg-orange-500 rounded-xl"></div>
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl"></div>
                    <div className="w-12 h-12 bg-pink-500 rounded-xl"></div>
                    <div className="w-12 h-12 bg-purple-500 rounded-xl"></div>
                  </div>

                  {/* Learning Card */}
                  <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400"></div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">Introduction to programming</h3>
                        <p className="text-xs text-gray-500">Learn the basics of programming</p>
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-2 text-xs text-gray-600 mb-2">
                      Learn the basics of programming, learn about key concepts and take the first steps towards mastering your new skills.
                    </div>
                    <div className="flex items-center justify-between">
                      <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-full text-xs">
                        View the lesson
                      </button>
                      <div className="text-xs text-gray-500">Module 1</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-8 top-16 bg-white rounded-2xl p-4 shadow-lg max-w-xs transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">&lt;/&gt;</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">HTML and CSS</h4>
                    <p className="text-xs text-gray-500">Module 2: Working with styles</p>
                  </div>
                </div>
                <div className="bg-orange-100 rounded-lg p-2 mb-2">
                  <div className="text-xs font-semibold text-orange-800">16%</div>
                  <div className="w-full bg-orange-200 rounded-full h-1">
                    <div className="bg-orange-500 h-1 rounded-full" style={{width: '16%'}}></div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 top-32 bg-white rounded-2xl p-4 shadow-lg max-w-xs transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">UI</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">UX/UI Design Interface</h4>
                    <p className="text-xs text-gray-500">Module 5: User-friendly interfaces</p>
                  </div>
                </div>
                <div className="bg-purple-100 rounded-lg p-2 mb-2">
                  <div className="text-xs font-semibold text-purple-800">72%</div>
                  <div className="w-full bg-purple-200 rounded-full h-1">
                    <div className="bg-purple-500 h-1 rounded-full" style={{width: '72%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-slate-800/50 to-purple-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Powerful Features for <span className="text-purple-400">Smarter Learning</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform provides everything you need to achieve your learning goals efficiently and effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 border border-slate-600 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It <span className="text-blue-400">Works</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Get started in minutes with our simple, three-step process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Set Your Goal</h3>
              <p className="text-gray-300">Define what you want to learn or achieve. Our AI will help break it down into manageable chunks.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Learn & Practice</h3>
              <p className="text-gray-300">Work through your personalized learning path with interactive content and hands-on practice.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Verify & Progress</h3>
              <p className="text-gray-300">Take AI-generated quizzes to verify your understanding and track your progress toward your goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-purple-800/20 to-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our <span className="text-purple-400">Learners Say</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join thousands of successful learners who have transformed their skills with our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 border border-slate-600">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already achieving their goals with our AI-powered platform. 
            Start your journey today, completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              onClick={() => navigate('/dashboard')}
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">No credit card required • Free forever plan available</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">ai tutor</span>
              </div>
              <p className="text-gray-400 mb-4">Personalized learning with AI assistance for everyone.</p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors">
                  <span className="text-white text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors">
                  <span className="text-white text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-colors">
                  <span className="text-white text-sm">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 AI Tutor. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
