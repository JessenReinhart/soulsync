
import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footerContent?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footerContent }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-cardLight dark:bg-cardDark rounded-xl shadow-soft-xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <div className="flex items-center justify-between p-6 border-b border-primaryLight/30 dark:border-primaryDark/30">
              <h3 className="text-xl font-semibold text-textLight dark:text-textDark">{title}</h3>
              <button
                onClick={onClose}
                className="text-textLight/70 dark:text-textDark/70 hover:text-primaryDark dark:hover:text-primaryLight transition-colors"
                aria-label="Close modal"
              >
                <Icon name="close" size={24} />
              </button>
            </div>
            <div className="p-6 text-sm text-textLight dark:text-textDark opacity-90">
              {children}
            </div>
            {footerContent && (
              <div className="px-6 py-4 bg-backgroundLight dark:bg-backgroundDark/50 border-t border-primaryLight/30 dark:border-primaryDark/30 flex justify-end space-x-3">
                {footerContent}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;