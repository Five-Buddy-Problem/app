export function calculateRemainingTime(finishTime: Date) {
  const now = new Date();
  const remainingTime = finishTime.getTime() - now.getTime();
  const remainingSeconds = Math.floor(remainingTime / 1000);
  const remainingMinutes = Math.floor(remainingSeconds / 60);
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingDays = Math.floor(remainingHours / 24);

  if (remainingDays > 0) {
    return `${remainingDays} days, ${remainingHours % 24} hours`;
  } else if (remainingHours > 0) {
    return `${remainingHours} hours, ${remainingMinutes % 60} minutes`;
  } else if (remainingMinutes > 0) {
    return `${remainingMinutes} minutes`;
  } else {
    return `${remainingSeconds} seconds`;
  }
}
