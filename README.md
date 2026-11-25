# BS-modules

Catalogue des modules de [BACKSTAGE](https://github.com/mprnl/backstage).

L'application lit ce dépôt pour proposer les modules installables, sans que
l'utilisateur ait à connaître une URL. Un module vit dans son propre dépôt
`mprnl/BS-<nom>` ; ce dépôt ne contient que la liste et son schéma.

## Entrées

| id | dépôt | ref | visibilité |
| --- | --- | --- | --- |
| `watch-later` | `mprnl/BS-watch-later` | `v1.0.1` | privé |
| `daily-quote` | `mprnl/BS-daily-quote` | `v1.0.0` | public |

## Règles

- Une entrée pointe vers un **tag ou un commit**, jamais une branche mobile.
- `id` doit être unique, et égal à l'identifiant déclaré par le module.
- `ref` ne se met à jour qu'après une release du dépôt du module.
- Le catalogue n'est pas une source de confiance : l'application revérifie
  l'`id`, la ref figée et la compatibilité du kit avant d'installer.

## Validation

```bash
node scripts/validate.mjs
```

La CI exécute la même commande sur chaque pull request.
