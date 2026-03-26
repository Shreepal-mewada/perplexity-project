import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export const AnimatedAuthCard = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-md relative z-10 mx-auto"
      style={{ perspective: 1500 }}
    >
      <motion.div
        className="relative"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ z: 10 }}
      >
        <div className="relative group/authcard">
          <motion.div 
            className="absolute -inset-[1px] rounded-[2rem] opacity-30 transition-opacity duration-700 pointer-events-none"
            animate={{
              boxShadow: [
                "0 0 10px 2px rgba(255,255,255,0.03)",
                "0 0 15px 5px rgba(255,255,255,0.05)",
                "0 0 10px 2px rgba(255,255,255,0.03)"
              ],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
          />

          <div className="absolute -inset-[1px] rounded-[2rem] overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-70"
              initial={{ filter: "blur(2px)" }}
              animate={{ left: ["-50%", "100%"], opacity: [0.3, 0.7, 0.3], filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"] }}
              transition={{ left: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }, opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror" }, filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror" } }}
            />
            <motion.div 
              className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-primary/80 to-transparent opacity-70"
              initial={{ filter: "blur(2px)" }}
              animate={{ top: ["-50%", "100%"], opacity: [0.3, 0.7, 0.3], filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"] }}
              transition={{ top: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 0.6 }, opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 0.6 }, filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 0.6 } }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-70"
              initial={{ filter: "blur(2px)" }}
              animate={{ right: ["-50%", "100%"], opacity: [0.3, 0.7, 0.3], filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"] }}
              transition={{ right: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.2 }, opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.2 }, filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.2 } }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-primary/80 to-transparent opacity-70"
              initial={{ filter: "blur(2px)" }}
              animate={{ bottom: ["-50%", "100%"], opacity: [0.3, 0.7, 0.3], filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"] }}
              transition={{ bottom: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.8 }, opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.8 }, filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.8 } }}
            />
            
            <motion.div className="absolute top-0 left-0 h-[5px] w-[5px] rounded-full bg-primary/60 blur-[1px]" animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }} />
            <motion.div className="absolute top-0 right-0 h-[8px] w-[8px] rounded-full bg-primary/80 blur-[2px]" animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2.4, repeat: Infinity, repeatType: "mirror", delay: 0.5 }} />
            <motion.div className="absolute bottom-0 right-0 h-[8px] w-[8px] rounded-full bg-primary/80 blur-[2px]" animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2.2, repeat: Infinity, repeatType: "mirror", delay: 1 }} />
            <motion.div className="absolute bottom-0 left-0 h-[5px] w-[5px] rounded-full bg-primary/60 blur-[1px]" animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2.3, repeat: Infinity, repeatType: "mirror", delay: 1.5 }} />
          </div>

          <div className="absolute -inset-[0.5px] rounded-[2rem] bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 opacity-40 pointer-events-none" />
          
          <div className="relative bg-background/60 backdrop-blur-xl rounded-[2rem] px-8 py-10 border border-white/[0.05] shadow-[0_0_50px_rgba(202,56,20,0.1)] w-full">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none rounded-[2rem]" 
              style={{
                backgroundImage: `linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)`,
                backgroundSize: '30px 30px'
              }}
            />
            <div className="relative z-10 w-full space-y-8">
                {children}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const AnimatedAuthBackground = () => {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background pointer-events-none z-0" />
      
      <div className="absolute inset-0 opacity-[0.03] mix-blend-soft-light pointer-events-none z-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-primary/10 blur-[80px] pointer-events-none z-0" />
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-primary/5 blur-[80px] pointer-events-none z-0"
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-primary/5 blur-[80px] pointer-events-none z-0"
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "mirror", delay: 1 }}
      />

      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse opacity-40 pointer-events-none z-0" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse delay-1000 opacity-40 pointer-events-none z-0" />
    </>
  );
};
