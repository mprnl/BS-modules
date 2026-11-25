# BS-modules

Catalogue des modules de [BACKSTAGE](https://github.com/mprnl/backstage).

L'application lit ce dépôt pour connaître l'ensemble des modules, qu'ils soient
integrés au monorepo (`bundled`) ou installables depuis leur propre dépôt
(`external`, `mprnl/BS-<nom>`).

## Modules

| id | source | emplacement | env |
| --- | --- | --- | --- |
| `accreditations` | bundled | `modules/accreditations` | `GROQ_API_KEY` |
| `calendar` | bundled | `modules/calendar` | Google |
| `concerts` | bundled | `modules/concerts` | `OPENWEATHERMAP_API_KEY` |
| `daily-brief` | bundled | `modules/daily-brief` | — |
| `emails` | bundled | `modules/emails` | Google |
| `followups` | bundled | `modules/followups` | — |
| `github` | bundled | `modules/github` | `GITHUB_TOKEN`, `GITHUB_REPO` |
| `photo` | bundled | `modules/photo` | — |
| `reminders` | bundled | `modules/reminders` | — |
| `schedule` | bundled | `modules/schedule` | `CESAR_USERNAME`, `CESAR_PASSWORD` |
| `weather` | bundled | `modules/weather` | `OPENWEATHERMAP_API_KEY` |
| `web` | bundled | `modules/web` | `BRAVE_SEARCH_API_KEY` |
| `watch-later` | external | `mprnl/BS-watch-later` `v1.0.1` | — |
| `daily-quote` | external | `mprnl/BS-daily-quote` `v1.0.0` | — |

## Regles

- `bundled` : le module vit dans `mprnl/backstage`, il se désactive mais ne
  s'installe pas.
- `external` : le module vit dans son dépôt `mprnl/BS-*` et s'installe avec une
  ref figée (tag ou commit), jamais une branche mobile.
- `id` unique, égal à l'identifiant déclaré par le module.
- `ref` ne change qu'après une release du dépôt du module.
- Le catalogue n'est pas une source de confiance : l'application revérifie
  l'`id`, la ref figée et la compatibilité du kit avant d'installer.
- Un module `bundled` qui importe `@/lib/*` n'est pas distribuable : il ne
  bascule pas en `external` avant que ce point soit tranché (#255).

## Validation

```bash
node scripts/validate.mjs
```

La CI exécute la même commande sur chaque pull request.
