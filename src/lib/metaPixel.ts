export const initMetaPixel = (pixelId: string) => {
  if (!pixelId) return;
  if (typeof window === 'undefined') return;

  // Standard Meta Pixel Code
  /* eslint-disable */
  ;(function(f:any,b:any,e:any,v:any,n?:any,t?:any,s?:any)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  if(s && s.parentNode) s.parentNode.insertBefore(t,s)})(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', pixelId);
  window.fbq('track', 'PageView');
};

export const trackMetaEvent = async (eventName: string, customData: any = {}, eventId: string = Date.now().toString()) => {
  // 1. Client-side tracking (Pixel)
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, customData, { eventID: eventId });
  }

  // 2. Server-side tracking (Conversions API)
  try {
    await fetch('/api/meta-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        eventName, 
        customData, 
        eventId, 
        url: typeof window !== 'undefined' ? window.location.href : '' 
      })
    });
  } catch (e) {
    console.error('Failed to send server-side event', e);
  }
};

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}
