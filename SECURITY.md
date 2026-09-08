# Politique de securite

## Versions prises en charge

La branche `master` est la seule version actuellement prise en charge pour les correctifs de securite.

## Signaler une vulnerabilite

Merci de ne pas publier une vulnerabilite exploitable dans une issue publique.

1. Ecrivez a [contact@example.com](mailto:contact@example.com) avec l'objet `Security: Space Program`.
2. Decrivez le probleme, les fichiers ou pages concernes et les etapes de reproduction.
3. Incluez un impact estime et, si possible, une proposition de correctif.
4. Ne joignez aucun secret reel ni donnee personnelle au rapport.

Un accuse de reception devrait etre envoye dans les 7 jours. Le mainteneur evaluera la gravite, preparera un correctif et coordonnera la divulgation lorsqu'une mise a jour sera disponible.

## Perimetre

Les sujets particulierement importants sont :

- Injection XSS par les donnees de Launch Library 2, SNAPI, NASA APOD, RSS ou parametres URL
- Validation des URLs externes utilisees dans les liens et les images
- Exposition accidentelle de secrets dans le code, les actions GitHub ou la documentation
- Dependances CDN et controle d'integrite des sous-ressources
- Stockage local des favoris et comportements de notification navigateur

## Bonnes pratiques du projet

- Les donnees externes sont rendues avec les API DOM natives lorsque possible.
- Les URLs doivent etre limitees a `http` et `https` avant leur affectation a `href` ou `src`.
- Les cles privees, jetons et identifiants ne doivent jamais etre ajoutes au depot.
- Les changements sensibles doivent etre testes avec des donnees malveillantes ou inattendues avant fusion.

Merci de contribuer a la securite de Space Program.
