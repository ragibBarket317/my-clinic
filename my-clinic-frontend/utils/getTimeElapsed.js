export const getTimeElapsed = (createdAt) => {
    const now = new Date();
    const createdAtDate = new Date(createdAt);
    const timeDifference = now - createdAtDate;
    
    const minutes = Math.floor(timeDifference / (1000 * 60));
    if (minutes < 60) {
      return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
  
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    if (hours < 24) {
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
  
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (days < 30) {
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  
    const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
    return `${months} month${months === 1 ? '' : 's'} ago`;
  };