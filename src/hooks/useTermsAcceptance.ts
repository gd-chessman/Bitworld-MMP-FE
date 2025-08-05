import { useState, useEffect } from 'react';

export const useTermsAcceptance = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra trạng thái đồng ý điều khoản từ localStorage
    const checkTermsAcceptance = () => {
      try {
        const accepted = localStorage.getItem('termsAccepted') === 'true';
        const acceptedDate = localStorage.getItem('termsAcceptedDate');
        
        // Kiểm tra xem có cần hiển thị lại điều khoản không (ví dụ: sau 1 năm)
        if (accepted && acceptedDate) {
          const acceptedTime = new Date(acceptedDate).getTime();
          const currentTime = new Date().getTime();
          const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
          
          // Nếu đã quá 1 năm, yêu cầu đồng ý lại
          if (currentTime - acceptedTime > oneYearInMs) {
            localStorage.removeItem('termsAccepted');
            localStorage.removeItem('termsAcceptedDate');
            setTermsAccepted(false);
          } else {
            setTermsAccepted(true);
          }
        } else {
          setTermsAccepted(false);
        }
      } catch (error) {
        console.error('Error checking terms acceptance:', error);
        setTermsAccepted(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTermsAcceptance();
  }, []);

  const acceptTerms = () => {
    try {
      localStorage.setItem('termsAccepted', 'true');
      localStorage.setItem('termsAcceptedDate', new Date().toISOString());
      setTermsAccepted(true);
    } catch (error) {
      console.error('Error accepting terms:', error);
    }
  };

  const declineTerms = () => {
    try {
      localStorage.removeItem('termsAccepted');
      localStorage.removeItem('termsAcceptedDate');
      setTermsAccepted(false);
    } catch (error) {
      console.error('Error declining terms:', error);
    }
  };

  const resetTermsAcceptance = () => {
    try {
      localStorage.removeItem('termsAccepted');
      localStorage.removeItem('termsAcceptedDate');
      setTermsAccepted(false);
    } catch (error) {
      console.error('Error resetting terms acceptance:', error);
    }
  };

  return {
    termsAccepted,
    isLoading,
    acceptTerms,
    declineTerms,
    resetTermsAcceptance,
  };
}; 