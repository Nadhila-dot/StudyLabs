import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useIsland } from '@/hooks/useIsland';

export const Island: React.FC = () => {
    const { state } = useIsland();
    const controls = useAnimation();
    const prevMessageRef = useRef<any>(state.message);
    const [isHovered, setIsHovered] = useState(false);
    
    // Effect to trigger pop animation when message changes
    useEffect(() => {
        if (prevMessageRef.current !== state.message) {
            // More pronounced pop animation
            controls.start({
                scale: [1, 1.15, 1], // More dramatic scale increase
                transition: { 
                    duration: 0.5,  
                    times: [0, 0.3, 1] // Peak at 0.3 seconds (30% of duration)
                }
            });
            prevMessageRef.current = state.message;
        }
    }, [state.message, controls]);

    return (
        <AnimatePresence>
            {state.message && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={[
                        { y: 0, opacity: 1 },
                        controls
                    ]}
                    exit={{ y: -100, opacity: 0 }}
                    layout
                    layoutDependency={[state.message, state.icon, isHovered]}
                    className="fixed top-5 left-0 right-0 mx-auto w-fit max-w-[90vw] z-50 flex items-center justify-center gap-2.5"
                    style={{
                        backgroundColor: state.backgroundColor || '#000',
                        color: state.textColor || '#fff',
                        padding: '12px 24px',
                        borderRadius: '20px',
                        fontSize: '16px',
                        fontWeight: 500,
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                        transformOrigin: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    whileHover={{
                        scale: 1.1,
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                        transition: { duration: 0.3 }
                    }}
                >
                    <AnimatePresence mode="wait">
                        {state.icon && (
                            <motion.div
                                key={state.icon ? 'icon-present' : 'icon-absent'}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.5, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {state.icon}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${isHovered ? 'hovered-' : ''}${typeof state.message === 'string' ? state.message : 'content-' + Math.random()}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut"
                            }}
                        >
                            {isHovered ? (
                                <div className="flex flex-col items-center gap-1">
                                    <span>{state.message}</span>
                                    <span className="text-xs opacity-80 font-bold">Studylabs Dynamic Island</span>
                                </div>
                            ) : (
                                state.message
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
};