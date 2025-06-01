import { cacheDataType, cacheFunctionStructure } from '../types';
import fs from 'fs';
import path from 'path';

export class FileMemory implements cacheFunctionStructure {
    private baseDir: string;

    constructor(folderName: string = 'cache') {
        this.baseDir = path.resolve(folderName);

        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir, { recursive: true });
        }
    }

    private getFilePath(key: string): string {
        return path.resolve(this.baseDir, `${key}.json`);
    }

    set(key: string, data: cacheDataType): void {
        fs.writeFileSync(this.getFilePath(key), JSON.stringify(data));
    }

    get(key: string): cacheDataType | null {
        try {
            const data = fs.readFileSync(this.getFilePath(key), 'utf8');
            return JSON.parse(data);
        } catch {
            return null;
        }
    }

    has(key: string): boolean {
        return fs.existsSync(this.getFilePath(key));
    }

    delete(key: string): void {
        const filePath = this.getFilePath(key);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    clear(): void {
        const files = fs.readdirSync(this.baseDir);
        for (const file of files) {
            if (file.endsWith('.json')) {
                fs.unlinkSync(path.join(this.baseDir, file));
            }
        }
    }
}
