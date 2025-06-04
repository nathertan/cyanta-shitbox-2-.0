import fs from 'fs';
import path from 'path'

export function loadFiles<T>(dir: string): Map<string, T> {
    const commands = new Map<string, T>();
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of files) {
        const filePath = path.join(dir, file);
        const command = require(filePath).default as T;
        const name = (command as any).data?.name || (command as any).name;
        if (name) {
            commands.set(name, command);
        }
    }

    return commands;
}