import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTruck, FaRoute, FaClock, FaDollarSign, FaShieldAlt, FaComments } from 'react-icons/fa';

function Home() {
  const [isVisible, setIsVisible] = useState({});
  const refs = useRef({});
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  // Set up intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(refs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Hero Section
  const HeroSection = () => (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Truck Dispatch <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">System</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Manage loads, assign drivers, and optimize your dispatch operations with real-time tracking and analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={handleGetStarted}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              Get Started
            </button>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-blue-400 hover:bg-blue-400/10 text-blue-100 font-semibold rounded-lg transition-all"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>
    </section>
  );

  // About Section
  const AboutSection = () => (
    <section ref={(el) => (refs.current.about = el)} id="about" className="py-16 px-4 bg-white">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible.about ? { opacity: 1, y: 0 } : { opacity: 1, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">About Truck Dispatch</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our platform simplifies fleet management with intuitive tools for load submission, driver management, and real-time tracking.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '📦', title: 'Load Management', desc: 'Submit and track loads in real-time' },
            { icon: '👥', title: 'Driver Management', desc: 'Assign drivers and manage schedules' },
            { icon: '📍', title: 'Real-time Tracking', desc: 'Track deliveries as they happen' },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isVisible.about ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="p-6 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // Dispatch Services Section
  const DispatchServicesSection = () => (
    <section ref={(el) => (refs.current.dispatch = el)} id="dispatch" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="mx-auto max-w-6xl">
        {/* Why Do You Need Dispatch Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible.dispatch ? { opacity: 1, y: 0 } : { opacity: 1, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Why Do You Need Dispatch Services?</h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed">
            In today's fast-paced logistics industry, efficient truck dispatch services are crucial for maintaining competitive advantage.
            They save valuable time by streamlining operations, ensure timely deliveries that keep customers satisfied, and provide
            comprehensive management of logistics to minimize costs and maximize efficiency. With professional dispatch services,
            you can focus on growing your business while we handle the complexities of load management and driver coordination.
          </p>
        </motion.div>

        {/* Truck Dispatch Services We Offer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible.dispatch ? { opacity: 1, y: 0 } : { opacity: 1, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Truck Dispatch Services We Offer</h2>
        </motion.div>

        {/* Services List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: FaTruck, title: 'Load Management and Tracking', desc: 'Comprehensive load submission and real-time tracking systems' },
            { icon: FaRoute, title: 'Driver Assignment and Coordination', desc: 'Efficient driver matching and coordination for optimal routes' },
            { icon: FaClock, title: 'Real-time Status Updates', desc: 'Live updates on load status and delivery progress' },
            { icon: FaDollarSign, title: 'Cost-effective Route Planning', desc: 'Optimized routing to reduce fuel costs and delivery times' },
            { icon: FaShieldAlt, title: 'Compliance with Safety and Regulations', desc: 'Ensuring all operations meet safety standards and regulations' },
            { icon: FaComments, title: 'Easy Communication Between Company and Drivers', desc: 'Seamless communication channels for better coordination' },
          ].map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible.dispatch ? { opacity: 1, x: 0 } : { opacity: 1, x: -20 }}
              transition={{ delay: idx * 0.1 + 0.3, duration: 0.6 }}
              className="group p-6 bg-white rounded-lg border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow"
                >
                  <service.icon className="text-white text-xl" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{service.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // Services Section
  const ServicesSection = () => (
    <section ref={(el) => (refs.current.services = el)} id="services" className="py-16 px-4 bg-slate-50">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible.services ? { opacity: 1, y: 0 } : { opacity: 1, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Services</h2>
          <p className="text-lg text-slate-600">Comprehensive tools to manage every aspect of your dispatch</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            'Load Submission',
            'Driver Management',
            'Real-time Tracking',
            'Analytics Dashboard',
            'Automated Notifications',
            'Performance Metrics',
          ].map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible.services ? { opacity: 1, x: 0 } : { opacity: 1, x: -20 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="p-6 bg-white rounded-lg border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all group cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold">✓</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{service}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // How It Works Section
  const HowItWorksSection = () => (
    <section ref={(el) => (refs.current.howitworks = el)} id="howitworks" className="py-16 px-4 bg-white">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible.howitworks ? { opacity: 1, y: 0 } : { opacity: 1, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600">Simple steps to get started with our platform</p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { num: '1', title: 'Register', desc: 'Create your account in seconds' },
            { num: '2', title: 'Submit Loads', desc: 'Add pickup and dropoff locations' },
            { num: '3', title: 'Assign Drivers', desc: 'Match drivers to loads automatically' },
            { num: '4', title: 'Track & Deliver', desc: 'Monitor deliveries in real-time' },
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible.howitworks ? { opacity: 1, y: 0 } : { opacity: 1, y: 20 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              className="relative"
            >
              <div className="p-6 bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg border border-blue-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold mb-4 mx-auto">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 text-center mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 text-center">{step.desc}</p>
              </div>
              {idx < 3 && <div className="hidden md:block absolute top-1/3 -right-2 w-4 h-0.5 bg-blue-300"></div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // Statistics Section
  const StatsSection = () => (
    <section ref={(el) => (refs.current.stats = el)} id="stats" className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { label: 'Total Drivers', value: '1,250+' },
            { label: 'Active Loads', value: '5,680+' },
            { label: 'Successful Deliveries', value: '98.5%' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible.stats ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="text-center text-white"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={isVisible.stats ? { opacity: 1 } : { opacity: 1 }}
                transition={{ delay: idx * 0.2 + 0.3, duration: 0.8 }}
                className="text-5xl font-bold mb-2"
              >
                {stat.value}
              </motion.div>
              <p className="text-blue-100 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );

  // Contact Section
  const ContactSection = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    return (
      <section ref={(el) => (refs.current.contact = el)} id="contact" className="py-16 px-4 bg-slate-50">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.contact ? { opacity: 1, y: 0 } : { opacity: 1, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Get In Touch</h2>
            <p className="text-lg text-slate-600">Have questions? We'd love to hear from you.</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible.contact ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            action="https://formsubmit.co/moiz962748@gmail.com"
            method="POST"
            className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-lg"
          >
            <input type="hidden" name="_subject" value="New contact request from website" />
            <input type="hidden" name="_captcha" value="false" />

            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="Your name"
                required
              />
            </div>

            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-vertical"
                placeholder="Your message"
                rows="5"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all"
            >
              Send Message
            </motion.button>
          </motion.form>
        </div>
      </section>
    );
  };

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <AboutSection />
      <DispatchServicesSection />
      <ServicesSection />
      <HowItWorksSection />
      <StatsSection />
      <ContactSection />
    </div>
  );
}

export default Home;
