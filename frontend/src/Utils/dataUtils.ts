// Format date to a human-readable format
export const formatDate = (dateString: string): string => 
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

// Get relative time (e.g., "2h ago")
export const getRelativeTime = (dateString: string): string => {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  return `${Math.floor(hours / 24)}d ago`;
};