export const calculateAgeFromDate = (dob) => {
    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    return age;
  };
  
 export  const formatDateFix = (dob) => {
    try {
      const date = new Date(dob);
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };