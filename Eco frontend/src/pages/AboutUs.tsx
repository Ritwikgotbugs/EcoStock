import { AlertTriangle, BarChart3, Globe2, Info, Leaf, Package, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <Package className="h-6 w-6 text-emerald-600" />, title: "AI Demand Prediction", desc: "Predicts inventory needs for each item, considering seasonal and trending demands."
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-blue-600" />, title: "Trend Analysis", desc: "Tracks social media and internet trends, using sentiment and keyword analysis to adjust demand."
  },
  {
    icon: <AlertTriangle className="h-6 w-6 text-orange-500" />, title: "Real-Time Alerts", desc: "Notifies managers of demand anomalies and supply issues instantly, with location-specific insights."
  },
  {
    icon: <Leaf className="h-6 w-6 text-green-600" />, title: "Eco Scoring", desc: "Evaluates products for sustainability: recyclability, emissions, water use, transport, and more."
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-purple-600" />, title: "Smart Stocking", desc: "Optimizes buffer stock and shelf-life management, using FIFO and custom formulas for perishables."
  },
  {
    icon: <Globe2 className="h-6 w-6 text-cyan-600" />, title: "Learning & Analytics", desc: "Learns from past data, provides analytics, and explains reasons for demand changes."
  },
];

const webFeatures = [
  "Manager dashboard for stock and income management",
  "OCR-based stock logging",
  "AI-driven suggestions and alerts",
  "Comprehensive analytics and reporting"
];

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* App Bar */}
      <header className="w-full bg-white/80 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Info className="h-7 w-7 text-emerald-600" />
            <span className="text-xl font-bold text-emerald-800 tracking-tight">EcoStock Guardian AI</span>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition"
          >
            Go to Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <section className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-emerald-700 mb-2">Smarter, Greener Inventory Management</h1>
          <p className="text-lg text-gray-700 mb-4">
            EcoStock Guardian AI empowers retailers to predict, optimize, and manage inventory sustainably using advanced AI and real-time analytics.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-4 bg-white/90 rounded-lg shadow p-5">
              <div>{f.icon}</div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{f.title}</h3>
                <p className="text-gray-700 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Web Platform Features */}
        <section className="bg-blue-50 rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Web Platform Highlights</h2>
          <ul className="list-disc list-inside text-gray-800 space-y-2">
            {webFeatures.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AboutUs; 