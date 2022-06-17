export function formatDuration(duration: number) {
  let formattedDuration;
  if (duration < 24) {
    formattedDuration = `${Math.floor(duration)}h`;
    if (duration % 1 > 0) {
      formattedDuration += `${60 * (duration % 1)}min`;
    }
  } else {
    formattedDuration = `${duration / 24}j`;
  }
  return formattedDuration;
}

export function formatLength(length: number) {
  return `${Math.round(length / 1000)} km`;
}

export function formatAscent(ascent: number) {
  return `${ascent} m`;
}
