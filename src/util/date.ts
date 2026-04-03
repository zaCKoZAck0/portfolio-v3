export function timeSince(date: Date) {
  const years = Math.floor(
    (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365),
  );
  const months = Math.floor(
    (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30),
  );

  if (years > 0) {
    return years + (years === 1 ? " year" : " years");
  }

  if (months > 0) {
    return months + (months === 1 ? " month" : " months");
  }

  return "< 1 month";
}
