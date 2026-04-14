import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, useScroll, useSpring } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, Clock, Calendar, Share2, 
  MessageSquare, Bookmark, CheckCircle2, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blogData";
import { useEffect } from "react";

const BlogDetail = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blogs"><Button>Back to Blogs</Button></Link>
        </div>
      </div>
    );
  }

  const relatedPosts = blogPosts
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden font-body">
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="container mx-auto px-6">
          {/* Top Metadata */}
          <div className="max-w-4xl mx-auto mb-12">
            <Link to="/blogs" className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all mb-8">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Insights
            </Link>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-wider text-primary">
                {post.category}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.15] text-foreground"
            >
              {post.title}
            </motion.h1>

            <div className="flex items-center justify-between py-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm border border-border">
                  {post.authorInitials}
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{post.author}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Platform Insights</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full border border-border">
                  <Bookmark size={16} />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full border border-border">
                  <Share2 size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Boxed Content Structure */}
            <div className="space-y-12">
              
              {/* What You'll Learn Box (Reference: OpinVox "Key Takeaways") */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-primary/5 border border-primary/20 rounded-2xl p-8"
              >
                <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                  <CheckCircle2 size={20} /> What You'll Learn
                </h3>
                <ul className="space-y-4">
                  {[
                    "Strategic advantages of performance-based hiring.",
                    "Reducing organizational friction through verifiable proof.",
                    "Repeatable frameworks for measuring technical excellence."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-foreground/80 font-medium">
                      <ChevronRight size={16} className="text-primary mt-0.5" /> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Main Text Section 1 (Boxed) */}
              <div className="prose prose-lg prose-rose dark:prose-invert max-w-none">
                <div 
                  className="space-y-10" 
                  dangerouslySetInnerHTML={{ __html: post.content1 }} 
                />
              </div>

              {/* Boxed Quote / Spotlight */}
              <div className="relative p-12 rounded-[2rem] bg-secondary/30 border border-border overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <h3 className="font-heading text-2xl font-bold mb-4 text-foreground relative z-10">
                  "The unit of value is no longer the credential; it is the validated output."
                </h3>
                <p className="text-muted-foreground relative z-10 italic">
                  — Soho Space Editorial Team
                </p>
              </div>

              {/* Main Text Section 2 (Boxed) */}
              <div className="prose prose-lg prose-rose dark:prose-invert max-w-none">
                <div 
                  className="space-y-10" 
                  dangerouslySetInnerHTML={{ __html: post.content2 }} 
                />
              </div>

              {/* FAQ Section (Reference Style) */}
              <div className="pt-20 border-t border-border">
                <h2 className="font-heading text-3xl font-bold mb-10 flex items-center gap-3">
                  <MessageSquare className="text-primary" /> Technical Q&A
                </h2>
                <div className="grid gap-6">
                  {post.faqs.map((faq, i) => (
                    <div key={i} className="group glass p-8 rounded-2xl border-border hover:border-primary/30 hover:bg-primary/[0.02] transition-all duration-300">
                      <h4 className="font-heading font-bold text-lg mb-4 text-foreground flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">Q</span>
                        {faq.question}
                      </h4>
                      <div className="flex gap-3 pl-11">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Related Contents */}
            <div className="mt-32 pt-20 border-t border-border">
              <div className="flex items-center justify-between mb-10">
                <h3 className="font-heading text-2xl font-bold">Related Insights</h3>
                <Link to="/blogs" className="text-primary text-sm font-bold flex items-center gap-1">
                  View Archive <ChevronRight size={16} />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((r, i) => (
                  <Link key={r.slug} to={`/blogs/${r.slug}`} className="group block glass p-6 rounded-2xl border-border hover:border-primary/30 transition-all duration-300">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{r.category}</span>
                    <h4 className="font-heading font-bold text-base mt-2 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {r.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetail;
