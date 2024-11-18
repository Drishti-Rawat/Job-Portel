// utils/timeUtils.js

export const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
  
    if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    } else if (months > 0) {
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  };
  
  // Optional: If you need the exact time difference in specific units
  export const getTimeDifference = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    return {
      seconds: Math.floor((now - date) / 1000),
      minutes: Math.floor((now - date) / (1000 * 60)),
      hours: Math.floor((now - date) / (1000 * 60 * 60)),
      days: Math.floor((now - date) / (1000 * 60 * 60 * 24)),
      months: Math.floor((now - date) / (1000 * 60 * 60 * 24 * 30)),
      years: Math.floor((now - date) / (1000 * 60 * 60 * 24 * 365))
    };
  };