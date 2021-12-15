import { writable, derived } from "svelte/store";
import { Service } from "$lib/service";

export const api = writable(new Service(null))
export const isLoading = writable(false);
export const isAuthenticated = writable(false);
export const canWrite = writable(false);
export const user = writable({});
export const popupOpen = writable(false);
export const error = writable();
export const token = writable();
export const selectedArea = writable();

export const storeRules = writable([]
  // [
  //   {
  //     areaId: '1',
  //     code: 'R001',
  //     status: 'Implemented',
  //     tags: null,
  //     text: 'Testing',
  //     title: 'Regra 001',
  //     id: '1'
  //   },
  //   {
  //     areaId: '2',
  //     code: 'R002',
  //     status: 'Implemented',
  //     tags: null,
  //     text: 'Testing for rules',
  //     title: 'Regra 002',
  //     id: '2'
  //   }
  // ]
);
export const storeAreas = writable([]
  // [
  //   {
  //     currentNumber: 1,
  //     name: 'test',
  //     prefix: 'ar',
  //     startNumber: 1,
  //     _hasChild: null,
  //     id: '1'
  //   },
  //   {
  //     currentNumber: 1,
  //     name: 'Contas a',
  //     prefix: 'ar',
  //     startNumber: 1,
  //     _hasChild: null,
  //     id: '2'
  //   },
  //   {
  //     currentNumber: 1,
  //     name: 'Contas a',
  //     prefix: 'ar',
  //     startNumber: 1,
  //     _hasChild: null,
  //     id: '3'
  //   },
  //   {
  //     currentNumber: 1,
  //     name: 'Contas a',
  //     prefix: 'ar',
  //     startNumber: 1,
  //     _hasChild: null,
  //     id: '4'
  //   }
  // ]
);
