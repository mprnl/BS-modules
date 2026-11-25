# BS-modules

Catalogue des modules de [BACKSTAGE](https://github.com/mprnl/backstage).

L'application lit ce dépôt pour connaître l'ensemble des modules, qu'ils soient
integrés au monorepo (`bundled`) ou installables depuis leur propre dépôt
(`external`, `mprnl/BS-<nom>`).

## Modules

| id | source | emplacement | distribue | env |
| --- | --- | --- | --- | --- |
| `accreditations` | bundled | `modules/accreditations` | `v1.0.0` | `GROQ_API_KEY` |
| `calendar` | bundled | `modules/calendar` | — | Google |
| `concerts` | bundled | `modules/concerts` | — | `OPENWEATHERMAP_API_KEY` |
| `daily-brief` | bundled | `modules/daily-brief` | — | — |
| `emails` | bundled | `modules/emails` | — | Google |
| `followups` | bundled | `modules/followups` | — | — |
| `github` | bundled | `modules/github` | — | `GITHUB_TOKEN`, `GITHUB_REPO` |
| `photo` | bundled | `modules/photo` | — | — |
| `reminders` | bundled | `modules/reminders` | — | — |
| `schedule` | bundled | `modules/schedule` | — | `CESAR_USERNAME`, `CESAR_PASSWORD` |
| `weather` | bundled | `modules/weather` | — | `OPENWEATHERMAP_API_KEY` |
| `web` | bundled | `modules/web` | — | `BRAVE_SEARCH_API_KEY` |
| `watch-later` | external | `mprnl/BS-watch-later` `v1.0.1` | oui | — |
| `daily-quote` | external | `mprnl/BS-daily-quote` `v1.0.0` | oui | — |

## Regles

- `source: bundled` : le module vit dans `mprnl/backstage`.
- `source: external` : le module vit dans son dépôt `mprnl/BS-*`.
- `distributable` : `true` quand un dépôt distant existe et porte une ref figée,
  `repo`, `ref` et `visibility` renseignés. Un module peut être `bundled` **et**
  `distributable` : c'est le cas d'`accreditations`, encore chargé par le
  monorepo mais déjà installable depuis son dépôt.
- `ref` ne change qu'après une release du dépôt du module, jamais une branche
  mobile.
- `id` unique, égal à l'identifiant déclaré par le module.
- Le catalogue n'est pas une source de confiance : l'application revérifie
  l'`id`, la ref figée et la compatibilité du kit avant d'installer.

## Validation

```bash
node scripts/validate.mjs
```

La CI exécute la même commande sur chaque pull request.
