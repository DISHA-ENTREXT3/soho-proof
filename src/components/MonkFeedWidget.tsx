import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

declare global {
  interface Window {
    __monkfeed_cleanup?: () => void;
  }
}

interface MonkFeedWidgetProps {
  userId?: string;
  email?: string;
}

export default function MonkFeedWidget({ userId: propUserId, email: propEmail }: MonkFeedWidgetProps = {}) {
  const { user } = useAuth();
  const userId = propUserId ?? user?.uid;
  const email = propEmail ?? user?.email;
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

    // Ensure the script is loaded after initial paint
    const loadWidget = () => {
      const scriptId = 'monkfeed-widget-script';
      let script = document.getElementById(scriptId) as HTMLScriptElement;
      
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = "https://www.monkfeed.com//widget.js";
        script.async = true;
        document.body.appendChild(script);
      } else if (script.src !== "https://www.monkfeed.com//widget.js") {
        script.src = "https://www.monkfeed.com//widget.js";
      }
    };

    if ("requestIdleCallback" in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(loadWidget, { timeout: 3000 });
      return () => {
        if ("cancelIdleCallback" in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(loadWidget, 2000);
      return () => clearTimeout(timer);
    }
  }, [userId, email]);

  return (
    <div key={remountKey} id="monkfeed-container">
      <div 
        className="monkfeed-widget upvote-widget"
        data-application-id="6ac8bde0678428a346d22bdf"
        data-feedback-enabled="true"
        data-show-feedback="true"
        data-user-id={userId || ''}
        data-email={email || ''}
        data-require-identity="false"
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
      />
    </div>
  );
}
