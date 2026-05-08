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
    if (window.__monkfeed_cleanup) {
      try {
        window.__monkfeed_cleanup();
      } catch (e) {
        console.error("MonkFeed cleanup failed:", e);
      }
    }

    // Ensure the script is loaded
    const scriptId = 'monkfeed-widget-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://upvote.entrext.com/widget.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [userId, email]);

  return (
    <div key={remountKey} id="monkfeed-container">
      <div 
        className="monkfeed-widget upvote-widget"
        data-application-id="69baa800f2b9c4ec3d6aea89"
        data-user-id={userId || ''}
        data-email={email || ''}
        data-position="right"
        data-primary-color="#4f46e5"
        data-secondary-color="#000000"
        data-bg-color="#ffffff"
        data-text-color="#18181b"
        data-launcher-color="#4f46e5"
        data-launcher-active-color="#ef4444"
        data-logo-url="/logo.png"
        data-product-overview="Soho Space: The Proof-of-Execution Hiring Platform."
        data-about-text="We help founders hire based on real-world challenges and builders show off their execution."
        data-faqs='[{"question":"What is Soho Space?","answer":"It is a hiring platform based on proof-of-execution."}, {"question":"How do I earn XP?","answer":"By completing and winning challenges posted by founders."}]'
      >
      </div>
    </div>
  );
}
