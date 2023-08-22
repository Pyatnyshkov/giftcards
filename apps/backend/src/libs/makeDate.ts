/**
 * Format date to ISO
 * @param seconds - Seconds
 * @return ISO date
 */
export function makeDate(seconds: string): string {
	const now: Date = new Date();
	now.setSeconds(now.getSeconds() + parseInt(seconds));
	const nowDate = new Date(now);
	return nowDate.toISOString();
}
