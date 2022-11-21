
let callbacks = new Map<string, (data: any) => void>();

export function registerCallback(id: string, callback: (data: any) => any) {
  callbacks.set(id, callback);
}

export function callCallback(id: string, data: any): any {
  if (callbacks.has(id)) {
    return callbacks.get(id)!(data);
  }
  return null;
}

export function removeCallback(id: string) {
  callbacks.delete(id);
}