import { writable } from 'svelte/store';

interface Device {
  name: string;
  type: string;
  identifier: string;
  heaterMap: string;
  roomMap: string;
  enabled?: boolean;
}

export const deviceList = writable<Device[]>([]);