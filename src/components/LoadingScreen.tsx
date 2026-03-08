import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
              <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-secondary" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
              <div className="absolute inset-4 animate-spin rounded-full border-2 border-transparent border-t-accent" style={{ animationDuration: "2s" }} />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="font-display text-lg tracking-wider text-muted-foreground"
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
