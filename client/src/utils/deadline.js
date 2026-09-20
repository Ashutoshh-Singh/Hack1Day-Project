/**
 * Dynamic Deadline Evaluation Utility
 * Evaluates scholarship closing dates relative to the current local time.
 */

export function getDeadlineStatus(deadlineDateStr) {
  if (!deadlineDateStr) {
    return {
      daysLeft: null,
      status: 'normal',
      label: 'Rolling Basis',
      badgeClasses: 'bg-slate-100 text-slate-700 border-slate-200'
    };
  }

  const deadline = new Date(deadlineDateStr);
  const now = new Date();
  
  // Set to start of day for accurate day-diff calculation
  deadline.setHours(23, 59, 59, 999);
  now.setHours(0, 0, 0, 0);

  const diffMs = deadline.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      daysLeft,
      status: 'expired',
      label: 'Deadline Passed',
      isExpired: true,
      badgeClasses: 'bg-rose-50 text-rose-700 border-rose-200'
    };
  }

  if (daysLeft === 0) {
    return {
      daysLeft: 0,
      status: 'urgent',
      label: 'Closes Today!',
      isExpired: false,
      badgeClasses: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
    };
  }

  if (daysLeft <= 7) {
    return {
      daysLeft,
      status: 'urgent',
      label: `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`,
      isExpired: false,
      badgeClasses: 'bg-red-50 text-red-700 border-red-200 font-semibold'
    };
  }

  if (daysLeft <= 30) {
    return {
      daysLeft,
      status: 'warning',
      label: `${daysLeft} days left`,
      isExpired: false,
      badgeClasses: 'bg-amber-50 text-amber-800 border-amber-200'
    };
  }

  return {
    daysLeft,
    status: 'normal',
    label: `${daysLeft} days left`,
    isExpired: false,
    badgeClasses: 'bg-blue-50 text-blue-700 border-blue-200'
  };
}

export function formatDate(dateStr) {
  if (!dateStr) return 'Not Specified';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}
