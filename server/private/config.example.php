<?php
// Copier en config.php sur le serveur (tasks/private/config.php) — JAMAIS dans le depot.
return [
    'token' => 'GENERER_UN_SECRET_ALEATOIRE',   // garde d'acces ?token=...
    'll2_limit' => 50,                          // taille de page LL2 (quota)
    'keep' => 12,                               // lots d'archives conserves
    'github_token' => '',                       // PAT fine-grained contents:write (optionnel)
    'github_repo' => 'leosand/Space_program',
    'github_branch' => 'master',
    'require_github_commit' => true,            // ne pas supprimer avant publication GitHub
];
