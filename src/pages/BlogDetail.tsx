import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, User, Share2, ChevronRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blog-data";
import { useEffect } from "react";

const BlogDetail = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  // Scroll to top on load
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

  // If not enough related posts in same category, just take random ones
  if (relatedPosts.length < 3) {
    const extra = blogPosts
      .filter(p => p.slug !== slug && !relatedPosts.includes(p))
      .slice(0, 3 - relatedPosts.length);
    relatedPosts.push(...extra);
  }

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <Link to="/blogs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all mb-8">
            <ArrowLeft size={16} /> Back to Blogs
          </Link>

          <div className="max-w-4xl mx-auto">
            {/* Meta */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded">
                {post.category}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock size={14} /> {post.readTime}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar size={14} /> {post.date}
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-8 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 mb-10 pb-10 border-b border-border">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-lg">
                {post.authorInitials}
              </div>
              <div>
                <p className="font-bold text-foreground">{post.author}</p>
                <p className="text-xs text-muted-foreground">Tech Evangelist at Soho Space</p>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full border border-border">
                  <Share2 size={18} />
                </Button>
              </div>
            </div>

            {/* Featured Image 1 */}
            <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-2xl">
              <img src={post.image1} alt={post.title} className="w-full h-full object-cover" />
            </div>

            {/* Content Section 1 */}
            <div className="prose prose-invert max-w-none mb-12">
              <div dangerouslySetInnerHTML={{ __html: post.content1 }} />
            </div>

            {/* Featured Image 2 */}
            <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-2xl">
              <img src={post.image2} alt={post.title} className="w-full h-full object-cover" />
            </div>

            {/* Content Section 2 */}
            <div className="prose prose-invert max-w-none mb-16">
              <div dangerouslySetInnerHTML={{ __html: post.content2 }} />
            </div>

            {/* FAQs */}
            <div className="glass p-8 rounded-3xl mb-20 border-primary/20">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <MessageSquare className="text-primary" /> Frequently Asked Questions
              </h3>
              <div className="space-y-6">
                {post.faqs.map((faq, i) => (
                  <div key={i} className="space-y-2">
                    <h4 className="font-bold text-foreground text-lg">{faq.question}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Blogs */}
            <div className="pt-20 border-t border-border">
              <h3 className="text-3xl font-bold mb-10">Related Articles</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((r) => (
                  <Link key={r.slug} to={`/blogs/${r.slug}`} className="group block">
                    <div className="aspect-video rounded-xl overflow-hidden mb-4 border border-border">
                      <img src={r.image1} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{r.title}</h4>
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
