import { resolve } from "path";

export const projRoot = resolve(__dirname, "..", "..");
export const pkgRoot = resolve(projRoot, "packages");
export const compRoot = resolve(pkgRoot, "components");
export const hookRoot = resolve(pkgRoot, "hooks");
export const utilRoot = resolve(pkgRoot, "utils");
