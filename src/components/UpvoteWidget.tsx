import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function UpvoteWidget() {
  const { user } = useAuth();
  const [remountKey, setRemountKey] = useState(0);

  const userId = user?.id;
  const email = user?.email;

  useEffect(() => {
    // Force hard remount for cleanup when identity changes
    setRemountKey(k => k + 1);
    
    // Proactive cleanup of existing floating elements
    // @ts-expect-error: window.__upvote_cleanup might not be defined initially
    if (window.__upvote_cleanup) window.__upvote_cleanup();
  }, [userId, email]);

  return (
    <div key={remountKey}>
      <div 
        className="upvote-widget"
        data-application-id="69baa800f2b9c4ec3d6aea89"
        data-user-id={userId || ''}
        data-email={email || ''}
        data-position="right"
        data-theme="light" // Strictly light as requested
        data-logo-url="/logo.png"
        data-product-overview="Soho Space: The Proof-of-Execution Hiring Platform."
        data-about-text="We help founders hire based on real-world challenges and builders show off their execution."
        data-faqs='[{"question":"What is Soho Space?","answer":"It is a hiring platform based on proof-of-execution."}, {"question":"How do I earn XP?","answer":"By completing and winning challenges posted by founders."}]'
      />
      <script src="https://upvote.entrext.com/widget.js" async />
    </div>
  );
}
