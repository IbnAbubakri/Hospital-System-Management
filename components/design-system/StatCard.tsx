'use client';

import React, { useEffect, useRef, useState } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  bg: string;
  border: string;
  index?: number;
  prefix?: string;
  suffix?: string;
  onClick?: () => void;
}

/**
 * StatCard - Animated statistics display with count-up animation
 *
 * @example
 * <StatCard
 *   label="Total Patients"
 *   value={150}
 *   color="#3B82F6"
 *   bg="linear-gradient(135deg, #DBEAFE 0%, rgba(255,255,255,0.8) 100%)"
 *   border="#93C5FD"
 *   index={0}
 * />
 */
export function StatCard({
  label,
  value,
  color,
  bg,
  border,
  index = 0,
  prefix = '',
  suffix = '',
  onClick,
}: StatCardProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 1000; // 1 second
      const steps = 60;
      const stepValue = value / steps;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setCount(Math.floor(stepValue * currentStep));
        } else {
          setCount(value);
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  return (
    <div
      ref={cardRef}
      className="stat-card"
      style={{
        padding: '12px 16px',
        borderRadius: '12px',
        background: bg,
        border: `1px solid ${border}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        animationDelay: `${index * 0.1}s`,
        opacity: 0,
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 12px 24px -8px ${color}`;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {/* Shimmer Effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }}
      />

      {/* Label */}
      <div
        className="text-xs sm:text-sm font-medium"
        style={{ color: '#64748B', marginBottom: '6px' }}
      >
        {label}
      </div>

      {/* Value */}
      <div
        className="stat-number"
        style={{
          fontSize: 'clamp(1.5rem, 4vw, 1.75rem)', // Responsive: 24px to 28px
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-card {
          animation: fadeInUp 0.5s ease-out forwards;
          position: 'relative';
          overflow: 'hidden';
        }
      `}</style>
    </div>
  );
}
