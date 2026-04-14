import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { blogPosts } from "@/data/blogData";

const BlogList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="max-w-2xl mb-16">
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Insights for <span className="gradient-text">Alpha Builders</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Stay ahead with the latest in proof-of-work hiring, startup scaling, and the builder economy.
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search topics, keywords..."
                className="pl-10 h-12 bg-secondary/30 border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post, idx) => (
              <motion.article
                 key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.5, ease: "easeOut" }}
                className="group relative flex flex-col p-8 glass rounded-[2.5rem] border border-border/40 hover:border-primary/30 transition-all duration-500"
              >

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    {post.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-1.5">
                    <Clock size={12} className="text-primary/60" /> {post.readTime}
                  </span>
                </div>

                <Link to={`/blogs/${post.slug}`} className="block group/title">
                  <h2 className="text-2xl font-bold mb-4 group-hover/title:text-primary transition-colors leading-[1.2] decoration-primary/30 underline-offset-4 group-hover/title:underline">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-muted-foreground text-sm mb-8 line-clamp-2 leading-relaxed font-body">
                  {post.description}
                </p>

                <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-foreground overflow-hidden">
                      {post.authorInitials}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-foreground leading-none mb-1">{post.author}</p>
                      <p className="text-[9px] uppercase tracking-tighter text-muted-foreground font-semibold">Technical Lead</p>
                    </div>
                  </div>
                  <Link to={`/blogs/${post.slug}`} className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300">
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No blogs found matching your search.</p>
              <Button variant="ghost" className="mt-4" onClick={() => setSearchTerm("")}>Clear Search</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogList;
