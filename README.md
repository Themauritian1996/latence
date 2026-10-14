# Latence

Lecture assistée des conductions nerveuses (NCS), plan d'EMG à l'aiguille et rapport d'électrodiagnostic — pour physiatres.

1. **Photo** du tableau de conductions (recadrage pour masquer l'identité du patient)
2. **Lecture** des valeurs par Gemini, vérifiables et corrigeables
3. **Normes** : chaque valeur est jugée par l'application (pas par l'IA) selon les normes du laboratoire — par défaut Preston & Shapiro, adultes — avec études comparatives (palmaire, D4, pouce, CSI), bloc de conduction, ralentissement focal ulnaire/fibulaire, zone démyélinisante, asymétries, température
4. **Analyse** : conclusion préliminaire selon la clinique, différentiel, conductions à ajouter, muscles à tester (avec innervation)
5. **EMG** : saisie rapide par muscle (ou photo du tableau)
6. **Rapport** complet, modifiable, copiable dans le DME, envoyé en PDF dans Google Drive : `Latence – Rapports EMG / AAAA-MM-JJ / NOM Prénom – dossier /`

L'historique des cas reste sur l'appareil (et peut être récupéré depuis Drive sur un autre appareil).

## Installer

- **Android** : télécharge `Latence.apk` dans l'onglet **Releases** du dépôt, ouvre-le sur le téléphone.
- **Site** (iPhone, ordinateur) : `https://<ton-compte>.github.io/latence/` — sur iPhone, Partager › Sur l'écran d'accueil.

Les deux sont construits automatiquement par GitHub Actions à chaque mise à jour (`.github/workflows/build.yml`).
Première fois seulement : dans le dépôt, **Settings › Pages › Source : GitHub Actions**.

## Configurer (dans l'app, Réglages)

- **Gemini** : clé API de https://aistudio.google.com/apikey. Pour des données de patients, active la facturation sur le projet de la clé (au niveau payant, Google n'utilise pas les requêtes pour entraîner ses modèles).
- **Google Drive** : Générer le mot de passe › Copier le script › coller dans https://script.google.com (nouveau projet) › Déployer en *Application Web* (Exécuter : Moi · Accès : Tout le monde) › coller l'URL `/exec` dans l'app › Tester. Le script est aussi dans `drive/Code.gs`.

## Confidentialité

Nom, date de naissance et numéro de dossier ne sont jamais envoyés à Gemini (seulement âge, sexe, taille, clinique, valeurs). Recadre les photos pour retirer l'en-tête. Les données restent sur l'appareil et dans ton propre Google Drive.

## Structure

- `www/` : l'application (HTML/JS sans dépendance, fonctionne hors ligne sauf l'IA)
  - `js/data.js` : normes, muscles, consignes à Gemini · `js/core.js` : moteur de normes, Gemini, rapport, Drive · `js/app.js` : interface
- `drive/Code.gs` : script Google Drive
- `assets/` : icône et écran de démarrage · `signing/` : clé de signature fixe (mises à jour sans perte de données)

Outil d'aide à la lecture : le médecin révise et signe le rapport.

## Comptes (v2)

- Connexion Google (site web) ou courriel + mot de passe (site et app Android), **sur invitation** : l'administrateur ajoute les courriels dans Réglages › Utilisateurs invités.
- Données de chaque compte (cas sans photos + réglages, dont la clé Gemini) dans Firestore, région Montréal (`northamerica-northeast1`), projet Firebase « EMGlatence ». Règles : `firebase/firestore.rules`.
- Rapports : « Mon Drive » (connexion Google, accès limité aux fichiers créés par l'app) ou « Script » (Apps Script, fonctionne aussi dans l'APK). Format Word (.docx) par défaut.
- Profils IA : Rapide (3.5 Flash-Lite), Équilibré (3.6 Flash), Approfondi (3.8 Flash), Personnalisé.
