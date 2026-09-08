# Guide de contribution

Merci de contribuer a Space Program. Le projet privilegie la clarte, l'accessibilite, la securite des donnees externes et une experience rapide sur mobile.

## Avant de commencer

- Consultez les issues ouvertes et evitez de dupliquer un travail en cours.
- Ouvrez une issue avant un changement important d'architecture ou de perimetre.
- Lisez le [README](README.md), la [politique de securite](SECURITY.md) et les fichiers concernes avant de coder.

## Processus

1. Forkez le depot et creez une branche depuis `master`.
2. Utilisez un nom explicite : `feat/description-courte`, `fix/description-courte` ou `docs/description-courte`.
3. Implementez une modification limitee, lisible et testable.
4. Verifiez le comportement sur mobile, au clavier et avec une connexion reseau degradee.
5. Executez les verifications locales.
6. Ouvrez une pull request qui explique le probleme, la solution et la facon de tester.

```bash
npx htmlhint *.html
npx eslint js/*.js --no-eslintrc --env browser,es2021 --rule 'no-undef: off'
```

## Standards de code

### HTML et accessibilite

- Utilisez des elements HTML semantiques : `main`, `nav`, `section`, `article`, `button` et `table`.
- Chaque image informative doit avoir un texte alternatif utile.
- Les controles interactifs doivent etre accessibles au clavier et avoir un nom accessible.
- Respectez un contraste conforme a WCAG 2.1 AA et `prefers-reduced-motion`.

### JavaScript et securite

- Preferez `document.createElement`, `textContent` et `setAttribute` pour toute donnee externe.
- N'utilisez pas `innerHTML` pour interpoler une donnee venant d'une API, d'un RSS ou d'un parametre URL.
- Validez les URLs avant de les utiliser dans `href` ou `src`.
- Gerez les erreurs reseau, les delais d'expiration et les etats vides.
- Ne commitez jamais de cle, jeton, mot de passe ou information personnelle.

### CSS et performance

- Reutilisez les variables et composants existants dans `css/styles.css`.
- Evitez les dependances supplementaires lorsque du CSS ou JavaScript natif suffit.
- Preservez le chargement differe des images et limitez le travail JavaScript au chargement.

## Pull requests

Une pull request doit inclure :

- Un titre concis et descriptif
- Une description du changement et de son impact
- Les etapes de validation effectuees
- Des captures d'ecran pour tout changement visuel significatif
- Une note explicite sur les risques ou compromis eventuels

Les PRs qui modifient la securite, la confidentialite, le rendu de donnees externes ou l'accessibilite doivent etre signalees clairement dans leur description.

## Signalement de bogues

Incluez autant que possible :

- Le resultat attendu et le resultat observe
- Les etapes de reproduction
- Le navigateur, le systeme d'exploitation et la taille d'ecran
- Les messages d'erreur de la console, sans informations sensibles

## Code de conduite

Soyez respectueux, precis et constructif. Les contributions qui ameliorant l'exactitude, l'accessibilite ou la securite sont particulierement appreciees.
