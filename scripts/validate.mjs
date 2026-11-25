import { readFileSync } from "node:fs";

const REQUIRED = [
  "id",
  "source",
  "path",
  "repo",
  "ref",
  "distributable",
  "description",
  "kit",
  "env",
  "visibility",
];
const SOURCES = new Set(["bundled", "external"]);
const VISIBILITY = new Set(["public", "private"]);
const MOVING_REF = /^(main|master|develop|dev|HEAD)$/;

const entries = JSON.parse(readFileSync(new URL("../catalog.json", import.meta.url), "utf8"));
const errors = [];
const seen = new Set();

if (!Array.isArray(entries)) errors.push("catalog.json doit contenir un tableau");

function checkSource(where, entry) {
  if (!SOURCES.has(entry.source)) errors.push(`${where} : source doit etre bundled ou external`);

  if (entry.source === "bundled" && (typeof entry.path !== "string" || !entry.path.startsWith("modules/"))) {
    errors.push(`${where} : un module bundled declare son path dans modules/`);
  }
  if (entry.source === "external" && entry.path !== null) {
    errors.push(`${where} : un module external n'a pas de path`);
  }
  if (entry.source === "external" && entry.distributable !== true) {
    errors.push(`${where} : un module external est toujours distribuable`);
  }
}

function checkDistribution(where, entry) {
  if (entry.distributable === false) {
    if (entry.repo !== null || entry.ref !== null || entry.visibility !== null) {
      errors.push(`${where} : un module non distribuable n'a ni repo, ni ref, ni visibility`);
    }
    return;
  }

  if (entry.distributable !== true) {
    errors.push(`${where} : distributable doit etre un booleen`);
    return;
  }

  if (typeof entry.repo !== "string" || !entry.repo.startsWith("https://github.com/mprnl/BS-")) {
    errors.push(`${where} : repo doit etre une URL https://github.com/mprnl/BS-*`);
  }
  if (typeof entry.ref !== "string" || entry.ref.length === 0 || MOVING_REF.test(entry.ref)) {
    errors.push(`${where} : ref doit etre un tag ou un commit, pas une branche`);
  }
  if (!VISIBILITY.has(entry.visibility)) errors.push(`${where} : visibility doit etre public ou private`);
}

for (const [index, entry] of entries.entries()) {
  if (typeof entry !== "object" || entry === null) {
    errors.push(`entree ${index} : objet attendu`);
    continue;
  }

  const where = typeof entry.id === "string" && entry.id.length > 0 ? entry.id : `entree ${index}`;

  for (const key of REQUIRED) {
    if (!(key in entry)) errors.push(`${where} : champ manquant ${key}`);
  }

  if (typeof entry.id !== "string" || entry.id.length === 0) errors.push(`${where} : id invalide`);
  else if (seen.has(entry.id)) errors.push(`${where} : id duplique`);
  else seen.add(entry.id);

  checkSource(where, entry);
  checkDistribution(where, entry);

  if (!Array.isArray(entry.env) || entry.env.some((name) => typeof name !== "string")) {
    errors.push(`${where} : env doit etre un tableau de chaines`);
  }
}

const bundled = entries.filter((entry) => entry.source === "bundled").length;
const external = entries.length - bundled;
const distributable = entries.filter((entry) => entry.distributable === true).length;

if (errors.length > 0) {
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `catalog.json valide : ${entries.length} module(s), ${bundled} integres, ${external} externes, ${distributable} distribuable(s)`
);
