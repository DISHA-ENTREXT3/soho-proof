"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  Search, 
  MapPin, 
  Globe, 
  ArrowUpRight,
  Filter,
  BadgeCheck,
  Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const founders = [
  { id: "jane-cooper", name: "Jane Cooper", company: "Acme Corp", industry: "AI & SaaS", location: "Austin, TX", challenges: 3, avatar: "🏢", rating: "4.9", verified: true },
  { id: "sam-altman", name: "Sam Altman", company: "OpenAI", industry: "Artificial Intelligence", location: "San Francisco, CA", challenges: 12, avatar: "💡", rating: "5.0", verified: true },
  { id: "elon-musk", name: "Elon Musk", company: "X", industry: "Social Media", location: "San Francisco, CA", challenges: 8, avatar: "🚀", rating: "4.8", verified: true },
  { id: "brian-chesky", name: "Brian Chesky", company: "Airbnb", industry: "Marketplace", location: "San Francisco, CA", challenges: 5, avatar: "🏠", rating: "4.9", verified: true },
];

const FoundersDirectory = () => {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
            Discover <span className="gradient-text">Founders</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Research the visionaries and companies hiring top talent.</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search companies, founders, industries..." 
            className="pl-10 bg-secondary/20 border-border h-11 focus:border-primary/50" 
          />
        </div>
        <Button variant="outline" className="border-border h-11 px-6 text-foreground gap-2">
          <Filter size={16} /> Filters
        </Button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {founders.map((founder) => (
          <motion.div
            key={founder.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass group hover:border-primary/30 transition-all p-6 relative overflow-hidden flex flex-col"
          >
             {/* Hover Decor */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-2xl border border-primary/10">
                {founder.avatar}
              </div>
              <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-yellow-400/10 text-yellow-500 text-xs font-bold font-heading">
                <Star size={12} fill="currentColor" /> {founder.rating}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {founder.name}
                </h3>
                {founder.verified && <BadgeCheck size={16} className="text-blue-500" />}
              </div>
              <p className="text-sm font-medium text-foreground mb-4">{founder.company} • {founder.industry}</p>
              
              <div className="space-y-3 text-sm text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary" />
                  {founder.location}
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={14} className="text-primary" />
                  {founder.challenges} Active Challenges
                </div>
              </div>
            </div>

            <Link to={`/profile/${founder.id}`} className="mt-auto">
              <Button variant="outline" className="w-full border-border group-hover:bg-primary group-hover:text-primary-foreground transition-all flex items-center justify-center gap-2 group/btn">
                Visit Profile <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FoundersDirectory;
