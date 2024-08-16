import { Injectable } from '@angular/core';
import { GetResult, Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  async setString(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  };

  async getString(key: string): Promise<string> {
    const result: GetResult = await Preferences.get({ key });
    return (result.value || '');
  };

  async setObject(key: string, value: any) {
    await Preferences.set({ key, value: JSON.stringify(value) });
  };

  async getObject(key: string): Promise<{ value: any }> {
    const { value }: any = await Preferences.get({ key });
    return JSON.parse(value);
  };

  async removeItem(key: string): Promise<void> {
    await Preferences.remove({ key });
  };

  async clear(): Promise<void> {
    await Preferences.clear();
  }
}
