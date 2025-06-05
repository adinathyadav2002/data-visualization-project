import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Upload,
  BarChart3,
  Table,
  TrendingUp,
  BookOpen,
  Users,
  Award,
  Download,
  FileText,
  PieChart,
  LineChart,
  Database,
  Zap,
  Shield,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  Github,
  Mail,
  Twitter,
  Linkedin,
} from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  const [animatedStats, setAnimatedStats] = useState({
    projects: 0,
    students: 0,
    analyses: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({ projects: 1247, students: 3542, analyses: 8691 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: Upload,
      title: "Smart Data Import",
      description:
        "Support for CSV, Excel, JSON and multiple data formats with automatic schema detection",
      color: "bg-blue-500",
    },
    {
      icon: Table,
      title: "Interactive Tables",
      description:
        "Sort, filter, and explore your data with our advanced table interface",
      color: "bg-emerald-500",
    },
    {
      icon: BarChart3,
      title: "Dynamic Visualizations",
      description:
        "Create stunning charts, graphs, and plots with customizable themes and exports",
      color: "bg-violet-500",
    },
    {
      icon: TrendingUp,
      title: "Statistical Analysis",
      description:
        "Comprehensive statistics including correlation, regression, and hypothesis testing",
      color: "bg-orange-500",
    },
    {
      icon: PieChart,
      title: "Advanced Analytics",
      description:
        "Machine learning insights, clustering, and predictive modeling capabilities",
      color: "bg-rose-500",
    },
    {
      icon: FileText,
      title: "Report Generation",
      description:
        "Automated report creation with insights, charts, and academic citations",
      color: "bg-teal-500",
    },
  ];

  const academicFeatures = [
    {
      icon: BookOpen,
      title: "Research Templates",
      description:
        "Pre-built analysis templates for common academic research methodologies",
    },
    {
      icon: Award,
      title: "Citation Generator",
      description:
        "Automatic APA, MLA, and IEEE citation generation for your data sources",
    },
    {
      icon: Users,
      title: "Collaboration Tools",
      description:
        "Share projects with classmates and professors for collaborative analysis",
    },
    {
      icon: Download,
      title: "Export Options",
      description:
        "Export results in multiple formats suitable for academic submissions",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Statistics Professor, MIT",
      content:
        "This platform has revolutionized how my students approach data analysis projects.",
      rating: 5,
    },
    {
      name: "Alex Rodriguez",
      role: "PhD Candidate, Stanford",
      content:
        "The automated insights saved me weeks of manual analysis for my dissertation.",
      rating: 5,
    },
    {
      name: "Prof. Michael Johnson",
      role: "Research Director, Harvard",
      content:
        "An excellent tool for teaching statistical concepts with real-world data.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 opacity-50">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container mx-auto px-6 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Academic Data Analysis Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                Research Data
              </span>
              <br />
              Into Insights
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Powerful, intuitive data analysis platform designed for students,
              researchers, and academics. Upload your datasets and discover
              meaningful patterns with advanced statistical tools and
              visualizations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-4 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Free Analysis
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg"
              >
                <Github className="w-5 h-5 mr-2" />
                View Documentation
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {animatedStats.projects.toLocaleString()}+
                </div>
                <div className="text-slate-600">Projects Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {animatedStats.students.toLocaleString()}+
                </div>
                <div className="text-slate-600">Students & Researchers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {animatedStats.analyses.toLocaleString()}+
                </div>
                <div className="text-slate-600">Analyses Completed</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Powerful Features for Every Analysis
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From basic statistics to advanced machine learning, our platform
              provides all the tools you need for comprehensive data analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-800">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-slate-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              Get insights from your data in three simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connection Lines */}
              <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-blue-200 to-blue-300 transform -translate-y-1/2"></div>
              <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-blue-200 to-blue-300 transform -translate-y-1/2"></div>

              <div className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Upload Your Data
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Simply drag and drop your CSV, Excel, or JSON files. Our
                  platform automatically detects data types and structure.
                </p>
              </div>

              <div className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Automatic Analysis
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Advanced algorithms process your data using Python, Pandas,
                  and scikit-learn to generate comprehensive insights.
                </p>
              </div>

              <div className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <LineChart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  Explore Results
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Interactive dashboards, customizable charts, and detailed
                  statistical reports ready for your research.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Features */}
      <section id="academic" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Built for Academic Excellence
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Specialized tools and features designed to meet the rigorous
              standards of academic research and education.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {academicFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Explore Academic Features
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-20 bg-gradient-to-br from-slate-50 to-blue-50"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Trusted by Educators & Researchers
            </h2>
            <p className="text-xl text-slate-600">
              See what academic professionals are saying about our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Research?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of students and researchers who are already using
            DataLyzer to unlock insights from their data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DataLyzer</span>
              </div>
              <p className="text-slate-400 mb-4">
                Empowering researchers and students with powerful data analysis
                tools.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Academic</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Student Discount
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Classroom License
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Research Partners
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Case Studies
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 DataLyzer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
