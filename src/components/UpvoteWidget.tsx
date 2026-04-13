import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

declare global {
  interface Window {
    __upvote_cleanup?: () => void;
  }
}

export default function UpvoteWidget() {
  const { user } = useAuth();
  const userId = user?.uid; // Firebase uses uid, not id
  const email = user?.email;

  useEffect(() => {
    // Cleanup existing script if it exists
    const existingScript = document.querySelector('script[src*="upvote.entrext.com/widget.js"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Proactive cleanup of existing floating elements
    if (window.__upvote_cleanup) {
      try {
        window.__upvote_cleanup();
      } catch (e) {
        console.error('Upvote cleanup error:', e);
      }
    }

    // Create and append the script
    const script = document.createElement('script');
    script.src = "https://upvote.entrext.com/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (window.__upvote_cleanup) window.__upvote_cleanup();
    };
  }, [userId, email]);

  return (
    <div 
      className="upvote-widget"
      data-application-id="69baa800f2b9c4ec3d6aea89"
      data-user-id={userId || ''}
      data-email={email || ''}
      data-position="right"
      data-theme="light"
      data-logo-url="/logo.png"
      data-product-overview="Soho Space: The Proof-of-Execution Hiring Platform."
      data-about-text="We help founders hire based on real-world challenges and builders show off their execution."
      data-faqs='[{"question":"What is Soho Space?","answer":"It is a hiring platform based on proof-of-execution."}, {"question":"How do I earn XP?","answer":"By completing and winning challenges posted by founders."}]'
    />
  );
}



