import { writable } from 'svelte/store';

interface Device {
  name: string;
  type: string;
  identifier: string;
  heaterMap: string;
  roomMap: string;
  enabled?: boolean;
  inputRef: HTMLInputElement
}

export const deviceList = writable<Device[]>([]);