import { readFileSync } from "node:fs";

const REQUIRED = ["id", "source", "path", "repo", "ref", "description", "kit", "env", "visibility"];
const SOURCES = new Set(["bundled", "external"]);
const VISIBILITY = new Set(["public", "private"]);
const MOVING_REF = /^(main|master|develop|dev|HEAD)$/;

const entries = JSON.parse(readFileSync(new URL("../catalog.json", import.meta.url), "utf8"));
const errors = [];
const seen = new Set();

if (!Array.isArray(entries)) errors.push("catalog.json doit contenir un tableau");

for (const [index, entry] of entries.entries()) {
  const where = entry?.id ? `${entry.id}` : `entree ${index}`;

  if (typeof entry !== "object" || entry === null) {
    errors.push(`${where} : objet attendu`);
    continue;
  }

  for (const key of REQUIRED) {
    if (!(key in entry)) errors.push(`${where} : champ manquant ${key}`);
  }

  if (typeof entry.id !== "string" || entry.id.length === 0) errors.push(`${where} : id invalide`);
  else if (seen.has(entry.id)) errors.push(`${where} : id duplique`);
  else seen.add(entry.id);

  if (!SOURCES.has(entry.source)) errors.push(`${where} : source doit etre bundled ou external`);

  if (entry.source === "bundled") {
    if (typeof entry.path !== "string" || !entry.path.startsWith("modules/")) {
      errors.push(`${where} : un module bundled declare son path dans modules/`);
    }
    if (entry.repo !== null || entry.ref !== null) errors.push(`${where} : un module bundled n'a ni repo ni ref`);
    if (entry.visibility !== null) errors.push(`${where} : un module bundled a visibility null`);
  }

  if (entry.source === "external") {
    if (entry.path !== null) errors.push(`${where} : un module external n'a pas de path`);
    if (typeof entry.repo !== "string" || !entry.repo.startsWith("https://github.com/mprnl/BS-")) {
      errors.push(`${where} : repo doit etre une URL https://github.com/mprnl/BS-*`);
    }
    if (typeof entry.ref !== "string" || entry.ref.length === 0 || MOVING_REF.test(entry.ref)) {
      errors.push(`${where} : ref doit etre un tag ou un commit, pas une branche`);
    }
    if (!VISIBILITY.has(entry.visibility)) errors.push(`${where} : visibility doit etre public ou private`);
  }

  if (!Array.isArray(entry.env) || entry.env.some((name) => typeof name !== "string")) {
    errors.push(`${where} : env doit etre un tableau de chaines`);
  }
}

const bundled = entries.filter((entry) => entry.source === "bundled").length;
const external = entries.length - bundled;

if (errors.length > 0) {
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`catalog.json valide : ${entries.length} module(s), ${bundled} integres, ${external} externes`);
