import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

declare global {
  interface Window {
    __monkfeed_cleanup?: () => void;
  }
}

export default function MonkFeedWidget() {
  const { user } = useAuth();
  const userId = user?.uid;
  const email = user?.email;
  const [remountKey, setRemountKey] = useState(0);

  useEffect(() => {
    // Force hard remount for cleanup when identity changes
    setRemountKey(k => k + 1);
    
    // Proactive cleanup of existing floating elements
    if (window.__monkfeed_cleanup) window.__monkfeed_cleanup();
  }, [userId, email]);

  return (
    <div key={remountKey}>
      <div 
        className="monkfeed-widget"
        data-application-id="69baa800f2b9c4ec3d6aea89"
        data-user-id={userId || ''}
        data-email={email || ''}
        data-position="right"
        data-logo-url="/logo.png"
        data-product-overview="Soho Space: The Proof-of-Execution Hiring Platform."
        data-about-text="We help founders hire based on real-world challenges and builders show off their execution."
        data-faqs='[{"question":"What is Soho Space?","answer":"It is a hiring platform based on proof-of-execution."}, {"question":"How do I earn XP?","answer":"By completing and winning challenges posted by founders."}]'
      >
      </div>
      <script src="https://upvote.entrext.com/widget.js" async />
    </div>
  );
}
