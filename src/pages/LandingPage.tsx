import { useEffect } from "react";
import { CheckCircle, Target, Brain, BarChart3, Star, ArrowRight, Play } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Card = ({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) => (
  <div className={`bg-white rounded-lg border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, logout, loginWithGoogle } = useAuth();

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!user && url.pathname === '/' && !localStorage.getItem('aimAchiever_user')) {
      if (typeof loginWithGoogle === 'function') loginWithGoogle();
    }
  }, [user, loginWithGoogle]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                  <Target className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold text-gray-900">Aim Achiever</span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="flex items-baseline ml-10 space-x-8">
                <a href="#features" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                  Features
                </a>
                <a href="#how-it-works" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                  How it Works
                </a>
                <a href="#testimonials" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                  Reviews
                </a>
                <a href="#pricing" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
                  Pricing
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!user ? (
                <>
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white transition-shadow rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
                    onClick={() => navigate("/login")}
                  >
                    Sign up for free
                  </button>
                </>
              ) : (
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={logout}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
                <Brain className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-gray-800">AI-powered productivity</span>
              </div>

              <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 lg:text-6xl">
                Break down big goals into
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  {" "}
                  achievable tasks
                </span>
              </h1>

              <p className="mb-8 text-xl leading-relaxed text-gray-600">
                Transform overwhelming goals into manageable microtasks. Track your progress, stay motivated, and verify
                completion with AI-powered quizzes designed just for you.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  className="flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:shadow-lg"
                  onClick={() => navigate("/login")}
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button
                  className="flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 border border-gray-300 rounded-2xl hover:bg-gray-50"
                  onClick={() => navigate("/dashboard")}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Move to Dashboard
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="p-6 bg-white border shadow-lg rounded-2xl border-slate-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Learn Web Development</h3>
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
                      <span className="text-sm font-medium text-blue-700">75% Complete</span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                      style={{ width: "75%" }}
                    ></div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-800">HTML Fundamentals</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-800">CSS Styling & Layout</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-blue-600 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                      <span className="font-medium text-gray-800">JavaScript Basics</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                      <span className="text-gray-500">React Components</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute p-4 bg-white border rounded-lg shadow-lg -top-4 -right-4 border-slate-200">
                <div className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-800">AI Quiz Ready!</span>
                </div>
              </div>

              <div className="absolute p-4 bg-white border rounded-lg shadow-lg -bottom-4 -left-4 border-slate-200">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-800">Progress Tracked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Everything you need to achieve your goals</h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Our intelligent system breaks down complex goals into manageable steps, tracks your progress, and keeps
              you motivated every step of the way.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="transition-shadow bg-white shadow-sm border-slate-200 rounded-2xl hover:shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-12 h-12 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">Smart Goal Breakdown</h3>
                <p className="leading-relaxed text-gray-600">
                  Transform overwhelming goals into bite-sized, actionable microtasks that you can tackle one at a time.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-shadow bg-white shadow-sm border-slate-200 rounded-2xl hover:shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-12 h-12 mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">Progress Tracking</h3>
                <p className="leading-relaxed text-gray-600">
                  Visualize your journey with detailed progress bars, completion statistics, and motivational
                  milestones.
                </p>
              </CardContent>
            </Card>

            <Card className="transition-shadow bg-white shadow-sm border-slate-200 rounded-2xl hover:shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center justify-center w-12 h-12 mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">AI Quiz Verification</h3>
                <p className="leading-relaxed text-gray-600">
                  Verify your understanding and completion with personalized AI-generated quizzes tailored to your
                  learning.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">How it works</h2>
            <p className="text-xl text-gray-600">Simple steps to achieve your biggest goals</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Set Your Goal</h3>
              <p className="text-gray-600">
                Enter your big goal and let our AI break it down into manageable tasks and microtasks.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Complete Tasks</h3>
              <p className="text-gray-600">
                Work through your personalized task list at your own pace, tracking progress along the way.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="mb-4 text-xl font-semibold text-gray-900">Verify & Celebrate</h3>
              <p className="text-gray-600">
                Take AI-powered quizzes to verify completion and celebrate your achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">What our users say</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="bg-white shadow-sm border-slate-200 rounded-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="mb-6 text-gray-600">
                  "This app completely changed how I approach my goals. Breaking everything down into small tasks made
                  my PhD thesis feel manageable!"
                </p>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600">
                    <span className="font-semibold text-white">S</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Chen</p>
                    <p className="text-sm text-gray-600">PhD Student</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-slate-200 rounded-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="mb-6 text-gray-600">
                  "The AI quizzes are brilliant! They help me actually understand what I've learned instead of just
                  checking boxes."
                </p>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
                    <span className="font-semibold text-white">M</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Marcus Johnson</p>
                    <p className="text-sm text-gray-600">Software Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-slate-200 rounded-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="mb-6 text-gray-600">
                  "Finally, a productivity app that actually works! The progress tracking keeps me motivated every
                  single day."
                </p>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                    <span className="font-semibold text-white">A</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Aisha Patel</p>
                    <p className="text-sm text-gray-600">Entrepreneur</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="mb-6 text-4xl font-bold text-white">Ready to achieve your biggest goals?</h2>
          <p className="mb-8 text-xl text-blue-100">
            Join thousands of users who have transformed their productivity with Aim Achiever.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button className="px-8 py-4 text-lg font-semibold text-gray-900 transition-all bg-white rounded-2xl hover:shadow-lg">
              Start Free Trial
            </button>
            <button className="px-8 py-4 text-lg font-semibold text-white transition-all border-2 border-white rounded-2xl hover:bg-white hover:text-gray-900">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Aim Achiever</span>
              </div>
              <p className="text-gray-600">Transform your biggest goals into achievable success stories.</p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-900">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-12 text-center text-gray-600 border-t border-slate-200">
            <p>&copy; 2024 Aim Achiever. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
