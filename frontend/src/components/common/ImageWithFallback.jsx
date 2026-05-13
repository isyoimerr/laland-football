import { useState, useEffect, useRef } from 'react';
import { Trophy, User, Zap } from 'lucide-react';

const ASSETS_BASE = '/assets';

export default function ImageWithFallback({
  src,
  alt = 'Image',
  className = '',
  type = 'team',
  initials = '',
  fallbackColor = 'from-blue-600 to-blue-800',
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const prevSrcRef = useRef(src);

  useEffect(() => {
    if (src !== prevSrcRef.current) {
      prevSrcRef.current = src;
      setHasError(false);
      setIsLoading(true);
    }
  }, [src]);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const resolveSrc = () => {
    if (!src) return null;
    if (src.startsWith('/assets/')) return src;
    if (src.startsWith('assets/')) return `/${src}`;
    if (src.startsWith('/LALAND_FOOTBALL_ASSETS/')) {
      return src.replace('/LALAND_FOOTBALL_ASSETS/', '/assets/');
    }
    if (src.startsWith('/')) return src;
    return `${ASSETS_BASE}/${src}`;
  };

  const renderFallback = () => {
    const baseClasses = `flex items-center justify-center w-full h-full ${fallbackColor} bg-gradient-to-br text-white`;
    const iconProps = { size: 32, strokeWidth: 1.5 };

    switch (type) {
      case 'player':
        return <div className={baseClasses}><User {...iconProps} /></div>;
      case 'league':
        return <div className={baseClasses}><Trophy {...iconProps} /></div>;
      case 'stadium':
        return <div className={baseClasses}><Zap {...iconProps} /></div>;
      case 'team':
      default:
        return (
          <div className={baseClasses}>
            {initials ? <span className="text-xl font-bold">{initials}</span> : <Trophy {...iconProps} />}
          </div>
        );
    }
  };

  const resolvedSrc = resolveSrc();

  return (
    <div className={`relative overflow-hidden bg-gray-900 ${className}`}>
      {!hasError && resolvedSrc ? (
        <>
          {isLoading && <div className="absolute inset-0 bg-gray-800 animate-pulse" />}
          <img
            src={resolvedSrc}
            alt={alt}
            onError={handleError}
            onLoad={handleLoad}
            className="w-full h-full object-cover"
          />
        </>
      ) : (
        renderFallback()
      )}
    </div>
  );
}
