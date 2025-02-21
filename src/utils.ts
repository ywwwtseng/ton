export const filter_undefined = <T>(obj: Record<string, T>): Record<string, T> => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => 
        [key, value && typeof value === 'object' ? filter_undefined(value as Record<string, T>) : value]
      )
  ) as Record<string, T>;
};

export function get_time_slot(date: number | Date, interval = 5000) {
  date = typeof date === 'number' ? new Date(date) : date;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  const total_milliseconds = 
    (hours * 60 * 60 * 1000) +
    (minutes * 60 * 1000) +
    (seconds * 1000) +
    milliseconds;

  const slot = Math.floor(total_milliseconds / interval);

  const start_of_slot_milliseconds = slot * interval;
  const end_of_slot_milliseconds = (slot + 1) * interval;

  const start_timestamp = date.setHours(0, 0, 0, 0) + start_of_slot_milliseconds;
  const end_timestamp = date.setHours(0, 0, 0, 0) + end_of_slot_milliseconds - 1;

  const start_utime = Math.floor(start_timestamp / 1000);
  const end_utime = Math.floor(end_timestamp / 1000);

  return {
    start: start_utime,
    end: end_utime,
  };
}