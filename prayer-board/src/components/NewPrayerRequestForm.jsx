import React, { useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { X, Globe, AlertCircle, ChevronRight, ChevronLeft, User, UserCheck } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, m } from 'framer-motion';
import { requestsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import AnimatedCandle from './AnimatedCandle';
import { InteractiveHoverButton } from './ui/InteractiveHoverButton';
import './NewPrayerRequestForm.css';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.96, x: "-50%", y: "-40%" },
  visible: {
    opacity: 1,
    scale: 1,
    x: "-50%",
    y: "-50%",
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    x: "-50%",
    y: "-40%",
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const mobileContentVariants = {
  hidden: { opacity: 0, x: 0, y: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { type: 'spring', damping: 30, stiffness: 350 },
  },
  exit: {
    opacity: 0,
    x: 0,
    y: '100%',
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: (direction) => ({
    x: direction < 0 ? 20 : -20,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' }
  })
};

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 640 : false
  );
  React.useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)');
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return isMobile;
};

const NewPrayerRequestForm = ({ isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const closeButtonRef = useRef(null);
  const isMobile = useIsMobile();
  
  // Wizard State
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for back
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    setValue,
    formState: { errors, isValid, isSubmitting },
    clearErrors,
    trigger,
  } = useForm({
    defaultValues: { body: '', isAnonymous: true },
    mode: 'onChange',
  });

  const bodyContent = useWatch({ control, name: 'body', defaultValue: '' });
  const isAnonymousValue = useWatch({ control, name: 'isAnonymous', defaultValue: true });
  const maxLength = 1000;

  const onSubmit = async (data) => {
    clearErrors('root');

    try {
      const result = await requestsAPI.create(
        { body: data.body.trim(), isAnonymous: data.isAnonymous },
        isAuthenticated ? user : null
      );

      handleReset();
      onSuccess(result.request);
      onClose();
    } catch (err) {
      if (err.statusCode === 429) {
        setError('root', { type: 'manual', message: t('auth.errors.rateLimit') });
      } else {
        setError('root', { type: 'manual', message: t('errors.creating') });
      }
    }
  };

  const handleReset = () => {
    reset();
    setStep(1);
    setDirection(0);
    clearErrors();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      handleReset();
      onClose();
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      const isStep1Valid = await trigger('body');
      if (!isStep1Valid) return;
    }
    
    if (step < totalSteps) {
      setDirection(1);
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(prev => prev - 1);
    }
  };

  const activeContentVariants = isMobile ? mobileContentVariants : contentVariants;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {isOpen && (
            <>
              <Dialog.Overlay asChild forceMount>
                <m.div
                  className="modal-overlay"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>
              <Dialog.Content
                asChild
                forceMount
                onInteractOutside={(e) => { if (isSubmitting) e.preventDefault(); }}
                onEscapeKeyDown={(e) => { if (isSubmitting) e.preventDefault(); }}
                aria-describedby={undefined}
              >
                <m.div
                  className="modal-content"
                  variants={activeContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  style={{ overflow: 'hidden' }} // Keep transitions inside
                >
                    <div className="modal-header">
                      <Dialog.Title asChild>
                        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <AnimatedCandle size={26} />
                          {t('newRequest.title')}
                        </h2>
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button
                          ref={closeButtonRef}
                          type="button"
                          className="close-btn"
                          aria-label={t('newRequest.close')}
                          disabled={isSubmitting}
                        >
                          <X size={20} />
                        </button>
                      </Dialog.Close>
                    </div>

                    {/* Progress Indicator */}
                    <div className="wizard-progress" role="navigation" aria-label="Creation steps">
                      <div className="wizard-steps">
                        {[1, 2, 3].map((num) => (
                          <div 
                            key={num} 
                            className={`wizard-step ${step === num ? 'active' : ''} ${step > num ? 'completed' : ''}`}
                            aria-current={step === num ? 'step' : undefined}
                          >
                            <div className="step-number" aria-hidden="true">{step > num ? '✓' : num}</div>
                            <span className="step-label">{t(`newRequest.wizard.step${num}`)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="wizard-status-text">
                        {t('newRequest.wizard.status', { current: step, total: totalSteps })}
                      </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="wizard-step-container">
                      <AnimatePresence mode="wait" custom={direction}>
                        <m.div
                          key={step}
                          custom={direction}
                          variants={stepVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          className="wizard-step-content"
                        >
                          {step === 1 && (
                            <div className="form-group">
                              <label htmlFor="prayer-body" className="sr-only">
                                {t('newRequest.prayerBodyLabel')}
                              </label>
                              <textarea
                                id="prayer-body"
                                {...register('body', {
                                  required: t('newRequest.minCharsError'),
                                  minLength: { value: 10, message: t('newRequest.minCharsError') },
                                  maxLength: maxLength
                                })}
                                placeholder={t('newRequest.placeholder')}
                                rows={8}
                                disabled={isSubmitting}
                                autoFocus
                                aria-invalid={errors.body ? "true" : "false"}
                                aria-describedby={errors.body ? "prayer-body-error" : undefined}
                              />
                              <div className="char-count" aria-live="polite">
                                {t('newRequest.charCount', { count: bodyContent?.length || 0, max: maxLength })}
                              </div>
                              {errors.body && (
                                <div id="prayer-body-error" className="error-message error-message-field" role="alert">
                                  {errors.body.message}
                                </div>
                              )}
                            </div>
                          )}

                        {step === 2 && (
                          <div className="identity-selection">
                            <h4 className="step-title">{t('newRequest.wizard.visibilityTitle')}</h4>
                            <p className="step-description">{t('newRequest.anonymousHint')}</p>
                            
                            <div className="identity-options">
                              {isAuthenticated ? (
                                <>
                                  <button
                                    type="button"
                                    className={`identity-card ${!isAnonymousValue ? 'active' : ''}`}
                                    onClick={() => setValue('isAnonymous', false)}
                                  >
                                    <div className="identity-radio"></div>
                                    <div className="identity-info">
                                      <span className="identity-name">{t('newRequest.wizard.namedLabel', { name: user.displayName })}</span>
                                      <span className="identity-desc">{t('newRequest.wizard.namedDesc', { name: user.displayName })}</span>
                                    </div>
                                  </button>
                                  
                                  <button
                                    type="button"
                                    className={`identity-card ${isAnonymousValue ? 'active' : ''}`}
                                    onClick={() => setValue('isAnonymous', true)}
                                  >
                                    <div className="identity-radio"></div>
                                    <div className="identity-info">
                                      <span className="identity-name">{t('newRequest.wizard.anonymousLabel')}</span>
                                      <span className="identity-desc">{t('newRequest.wizard.anonymousDesc')}</span>
                                    </div>
                                  </button>
                                </>
                              ) : (
                                <div className="identity-card active disabled">
                                  <div className="identity-radio"></div>
                                  <div className="identity-info">
                                    <span className="identity-name">{t('newRequest.wizard.guestLabel')}</span>
                                    <span className="identity-desc">{t('newRequest.wizard.guestDesc')}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {!isAuthenticated && (
                              <p className="guest-notice" style={{ marginTop: '24px' }}>
                                <Trans i18nKey="newRequest.guestNoticeWithLink">
                                  You are posting as a guest. <Link to="/register">Create an account</Link> to post with your name.
                                </Trans>
                              </p>
                            )}
                          </div>
                        )}

                        {step === 3 && (
                          <div className="review-step">
                            <h4 className="step-title">{t('newRequest.wizard.reviewTitle')}</h4>
                            <p className="step-description">{t('newRequest.wizard.reviewDesc')}</p>
                            
                            <div className="review-summary">
                              <div className="review-item">
                                <span className="review-label">{t('newRequest.wizard.summary')}</span>
                                <div className="review-text">{bodyContent}</div>
                              </div>
                              
                              <div className="review-item">
                                <span className="review-label">{t('newRequest.wizard.identity')}</span>
                                <div className="review-identity">
                                  {isAnonymousValue ? (
                                    <>
                                      <div className="identity-avatar anonymous"><User size={16} /></div>
                                      <span className="identity-name">{t('prayerCard.anonymous')}</span>
                                    </>
                                  ) : (
                                    <>
                                      <div className="identity-avatar"><UserCheck size={16} /></div>
                                      <span className="identity-name">{user.displayName}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <p className="privacy-notice" style={{ marginTop: '20px' }}>
                              <Globe size={16} className="icon-inline" aria-hidden="true" />
                              {t('newRequest.privacyNotice')}
                            </p>

                            {errors.root && (
                              <div className="error-message" role="alert" style={{ marginTop: '16px' }}>
                                <AlertCircle size={16} className="icon-inline" aria-hidden="true" />
                                {errors.root.message}
                              </div>
                            )}
                          </div>
                        )}
                      </m.div>
                    </AnimatePresence>

                    <div className="wizard-footer">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={step === 1 ? handleClose : prevStep}
                        disabled={isSubmitting}
                      >
                        {step === 1 ? (
                          t('newRequest.cancel')
                        ) : (
                          <><ChevronLeft size={18} /> {t('newRequest.wizard.back')}</>
                        )}
                      </button>

                      {step < totalSteps ? (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={nextStep}
                          disabled={!bodyContent?.trim() || !!errors.body}
                        >
                          {t('newRequest.wizard.next')} <ChevronRight size={18} />
                        </button>
                      ) : (
                        <InteractiveHoverButton
                          text={isSubmitting ? t('newRequest.submitting') : t('newRequest.submit')}
                          type="submit"
                          disabled={!isValid || isSubmitting}
                          aria-busy={isSubmitting}
                          className="submit-prayer-btn"
                        />
                      )}
                    </div>
                  </form>
                </m.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default NewPrayerRequestForm;
