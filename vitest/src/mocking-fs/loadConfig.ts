import { readFileSync } from "fs";
import { resolve } from "path";

export function loadConfig(
  filePath: string = "./src/mocking/config.json"
): Record<string, any> {
  const fullPath = resolve(filePath);

  try {
    const data = readFileSync(fullPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(` Failed to load config file: ${fullPath}`);
    console.error(error);

    return {};
  }
}
