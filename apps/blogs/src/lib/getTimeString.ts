export function getTimeString(timestamp: string) {
    const utcDate = new Date(timestamp);
    const istDate = new Date(utcDate.getTime());
    return istDate.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        year: '2-digit',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }).replaceAll(",", " ");
}