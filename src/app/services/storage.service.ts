
import {Injectable} from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root',
})
export class StorageService {

    constructor(private storage: Storage) {
        this.init();
    }

    init(): void {
        this.storage.create();
    }

    setData<T>(key: string, value: T): Promise<T> | undefined {
        return this.storage?.set(key, value);
    }

    getData<T>(key: string): Promise<T> | undefined {
        return this.storage?.get(key);
    }

    removeData<T>(key: string): Promise<T> {
        return this.storage?.remove(key);
    }

    clearStorage(): void {
        this.storage?.clear();
    }
}