export type Day = { id: string; name: string; short: string; num: number };
export type FestivalEvent = {
  cat: string;
  time: string;
  title?: string;
  names?: string[];
  lines?: string[];
  people?: string[];
  place?: string;
  descrizione?: string[];
};
export type NowInfo = { day: string; minutes: number; label: string };

export function parseRange(value: string): [number, number] {
  const times = value.match(/\d{1,2}:\d{2}/g) ?? [];
  const toMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  return [times[0] ? toMinutes(times[0]) : 0, times[1] ? toMinutes(times[1]) : 24 * 60];
}

export function sortEvents(events: FestivalEvent[]): FestivalEvent[] {
  return [...events].sort((a, b) => parseRange(a.time)[0] - parseRange(b.time)[0]);
}

export function getRomeNow(days: Day[], date = new Date()): NowInfo | null {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(date).map((part) => [part.type, part.value])
  );
  if (parts.year !== '2026' || parts.month !== '10') return null;
  const day = days.find((item) => item.num === Number(parts.day));
  if (!day) return null;
  return {
    day: day.id,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
    label: `${day.name} ${parts.hour}:${parts.minute}`
  };
}

export function isEventNow(event: FestivalEvent, dayId: string, now: NowInfo | null): boolean {
  if (!now || now.day !== dayId) return false;
  const [start, end] = parseRange(event.time);
  return now.minutes >= start && now.minutes < end;
}

export function eventsAtPlace(events: FestivalEvent[], place: string): FestivalEvent[] {
  return sortEvents(events).filter((event) => {
    switch (place) {
      case 'palco': return event.cat === 'live';
      case 'areaL': return event.place?.startsWith('Area L');
      case 'teatro': return event.place?.startsWith('Teatro');
      case 'bambini': return event.cat === 'bambini';
      case 'stand': return event.place === 'Gazebo di Corto Circuito Flegreo' || event.place === 'Sotto lo stand Arteteka';
      default: return false;
    }
  });
}
