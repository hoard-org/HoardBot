import { readdir } from 'node:fs/promises';

export function formatNumber(number: number | string): string {
  return number.toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

const methods = [
  { name: 'Days', count: 86400 },
  { name: 'Hours', count: 3600 },
  { name: 'Minutes', count: 60 },
  { name: 'Seconds', count: 1 },
];

export function parseUptime(time: number): string {
  const timeStr = [
    Math.floor(time / methods[0].count)
      .toString() + methods[0].name,
  ];
  for (let i = 0; i < 3; i++) {
    timeStr.push(
      `${Math.floor((time % methods[i].count) / methods[i + 1].count)
        .toString()} ${methods[i + 1].name}`
    );
  }
  return timeStr.filter((f) => !f.startsWith('0'))
    .join(' ');
}

export const loadFiles = async <T>(path: string): Promise<T[]> => {
  const files = await readdir(new URL(path, import.meta.url), {
    withFileTypes: true
  });
  const modules = [];
  for(const file of files) {
    const filePath = `${path}/${file.name}`;
    if(file.isDirectory()) {
      modules.push(...(await loadFiles<T>(filePath)));
    }
    else if(filePath.endsWith('.js')) {
      const imported = await import(filePath);
      modules.push(imported.default ?? imported);
    }
  }
    
  return modules;
};

export const logger = {
  info: (str: string) => {
    process.stdout.write(`\u001b[35m[INFO] \u001b[37m|| ${str}\n`);
  }
}