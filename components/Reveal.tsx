import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Scroll reveal : opacity 0 -> 1, translateY 24px -> 0, 600ms ease.
 * Pas de spring — le rythme reste calme, comme le reste de la page.
 */
const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, ease: 'easeOut', delay }}
  >
    {children}
  </motion.div>
);

export default Reveal;
