import { writable, derived } from "svelte/store";
import { Service } from "$lib/service";
import { AuthService } from "$lib/auth-service";

export const isAuthenticated = writable(false);
export const api = writable(new Service(null));

export const isLoading = writable(false);
export const canWrite = writable(false);
export const user = writable({});
export const popupOpen = writable(false);
export const error = writable();
export const token = writable();
export const selectedArea = writable();

export const storeRules = writable([]);
export const storeAreas = writable([]);
