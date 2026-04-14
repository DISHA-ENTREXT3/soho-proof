import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { blogPosts } from "@/data/blog-data";

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group glass p-5 rounded-3xl flex flex-col hover:border-primary/40 transition-all border-border/50"
              >
                <Link to={`/blogs/${post.slug}`} className="block overflow-hidden rounded-2xl mb-4 aspect-video">
                  <img
                    src={post.image1}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {post.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock size={10} /> {post.readTime}
                  </span>
                </div>
                <Link to={`/blogs/${post.slug}`}>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                  {post.description}
                </p>
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">
                      {post.authorInitials}
                    </div>
                    <span className="text-[10px] text-muted-foreground">{post.author}</span>
                  </div>
                  <Link to={`/blogs/${post.slug}`} className="text-primary text-xs font-bold flex items-center gap-1">
                    Read More <ArrowRight size={14} />
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
