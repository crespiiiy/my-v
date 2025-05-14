import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalyticsAndSecurityProps {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

/**
 * Component for handling all analytics and security scripts
 * 
 * IMPORTANT: Before going live, you need to:
 * 1. Set up Google Analytics and get your measurement ID
 * 2. Set up Facebook Pixel if needed
 * 3. Configure proper CSP (Content Security Policy) headers
 * 4. Add SSL certificate to your domain
 */
export default function AnalyticsAndSecurity({ 
  googleAnalyticsId = 'G-XXXXXXXX', // Replace with real ID in production
  facebookPixelId = '000000000000', // Replace with real ID in production
}: AnalyticsAndSecurityProps) {
  const location = useLocation();
  
  // Google Analytics page view tracking
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', googleAnalyticsId, {
        page_path: location.pathname + location.search
      });
    }
  }, [location, googleAnalyticsId]);
  
  // This initializes the analytics scripts when the component is first mounted
  useEffect(() => {
    // Don't load analytics in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics not loaded in development mode');
      return;
    }
    
    // Google Analytics
    if (!window.gtag) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
      document.head.appendChild(gaScript);
      
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', googleAnalyticsId);
    }
    
    // Facebook Pixel
    if (!window.fbq && facebookPixelId) {
      const fbScript = document.createElement('script');
      fbScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${facebookPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbScript);
      
      // Add FB pixel no-script fallback
      const fbNoscript = document.createElement('noscript');
      fbNoscript.innerHTML = `
        <img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${facebookPixelId}&ev=PageView&noscript=1" />
      `;
      document.body.appendChild(fbNoscript);
    }
    
    // Cleanup function
    return () => {
      // This is only for development to avoid script duplication
      // In production, analytics scripts should remain loaded
      if (process.env.NODE_ENV === 'development') {
        document.querySelectorAll('script[src*="googletagmanager.com"]').forEach(el => el.remove());
        document.querySelectorAll('script[src*="facebook.net"]').forEach(el => el.remove());
      }
    };
  }, [googleAnalyticsId, facebookPixelId]);
  
  // Add security-related meta tags
  useEffect(() => {
    // Add CSP meta tag (ideally this should be a HTTP header)
    let cspTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!cspTag) {
      cspTag = document.createElement('meta');
      cspTag.setAttribute('http-equiv', 'Content-Security-Policy');
      cspTag.setAttribute('content', "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.facebook.com");
      document.head.appendChild(cspTag);
    }
    
    // Add X-Frame-Options meta tag (ideally this should be a HTTP header)
    let xfoTag = document.querySelector('meta[http-equiv="X-Frame-Options"]');
    if (!xfoTag) {
      xfoTag = document.createElement('meta');
      xfoTag.setAttribute('http-equiv', 'X-Frame-Options');
      xfoTag.setAttribute('content', 'DENY');
      document.head.appendChild(xfoTag);
    }
  }, []);
  
  // This component doesn't render anything visible
  return null;
}

// Add type definitions for global window object
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: any;
  }
} 