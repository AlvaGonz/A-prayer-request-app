"use client"

import React, { useEffect, useState, useRef } from "react"
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from "framer-motion"
import {
  Check,
  ChevronDown,
  Globe,
} from "lucide-react"
import { useTranslation } from 'react-i18next';

import { cn } from "../../lib/utils"

const languageIcons = {
  en: Globe,
  es: Globe,
}

const languageConfigs = {
  en: { label: 'English', code: 'EN' },
  es: { label: 'Español', code: 'ES' },
}

export const Theme = ({
  variant = "dropdown",
  size = "md",
  showLabel = false,
  languages = ["en", "es"],
  className,
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const triggerRef = useRef(null)
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 })

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true)
  }, [])

  const currentLanguage = i18n.language || 'en';

  const sizeClasses = {
    sm: "language-selector-sm",
    md: "language-selector-md",
    lg: "language-selector-lg",
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  if (!isMounted) return null

  // DROPDOWN VARIANT
  if (variant === "dropdown") {
    const safeLanguage = languages.includes(currentLanguage) ? currentLanguage : "en"
    const Icon = languageIcons[safeLanguage]

    return (
      <div className="language-theme-dropdown">
        <button
          ref={triggerRef}
          onClick={() => {
            if (!isOpen && triggerRef.current) {
              const rect = triggerRef.current.getBoundingClientRect();
              setMenuPos({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
              });
            }
            setIsOpen(!isOpen);
          }}
          className={cn(
            "language-theme-trigger",
            sizeClasses[size],
            showLabel && "language-theme-trigger-with-label",
            className
          )}
        >
          <div className="language-theme-trigger-content">
            <Icon size={iconSizes[size]} />
            {showLabel && (
              <span className="language-theme-label">
                {languageConfigs[safeLanguage].label}
              </span>
            )}
            {!showLabel && (
              <span className="language-theme-code">
                {languageConfigs[safeLanguage].code}
              </span>
            )}
          </div>
          <ChevronDown 
            size={iconSizes[size]} 
            className={cn("language-theme-chevron", isOpen && "language-theme-chevron-open")}
          />
        </button>

        {createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <div 
                  className="language-theme-backdrop" 
                  onClick={() => setIsOpen(false)}
                />
                <motion.div
                  style={{ top: menuPos.top, left: menuPos.left }}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="language-theme-menu language-theme-menu--portal"
                >
                  {languages.map((langOption) => {
                    const Icon = languageIcons[langOption]
                    const isSelected = currentLanguage === langOption

                    return (
                      <button
                        key={langOption}
                        onClick={() => changeLanguage(langOption)}
                        className={cn(
                          "language-theme-item",
                          isSelected && "language-theme-item-selected"
                        )}
                      >
                        <div className="language-theme-item-content">
                          <Icon size={iconSizes[size]} />
                          <span className="language-theme-item-label">
                            {languageConfigs[langOption].label}
                          </span>
                        </div>
                        {isSelected && <Check size={iconSizes[size]} />}
                      </button>
                    )
                  })}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    )
  }

  // BUTTON VARIANT (cycles through languages)
  if (variant === "button") {
    const safeLanguage = languages.includes(currentLanguage) ? currentLanguage : "en"
    const Icon = languageIcons[safeLanguage]
    const nextLanguage = languages[(languages.indexOf(safeLanguage) + 1) % languages.length]

    return (
      <motion.button
        onClick={() => changeLanguage(nextLanguage)}
        className={cn(
          "language-theme-button",
          sizeClasses[size],
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          key={safeLanguage}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Icon size={iconSizes[size]} />
        </motion.div>
        {showLabel && (
          <span className="language-theme-label">
            {languageConfigs[safeLanguage].label}
          </span>
        )}
      </motion.button>
    )
  }

  return null
}
