# Documentation

Installation en mode développement :

## Prérequis

**1. Cloner le dépot**

```bash
git clone git@github.com:GeotrekCE/Geotrek-rando-widget.git
```

**2. Installer npm**

```bash
npm install
```

## Démarrer l'application

Une fois npm installé, démarrer le serveur en mode développement en lançant cette commande :

```bash
npm run docs:dev
```
Rendez vous ensuite sur cette URL :

```bash
http://localhost:5173/
```

## Contribuer

**1. Contribuer les fichiers existants**

Vous pouvez commencer à contribuer la documentation de Geotrek-rando-widget en mettant à jour les fichiers markdown présents dans le dossier **docs/documentation** :

```bash
cd /docs/documentation
```

Chaque sous-dossier présent dans /docs concerne une section de la documentation (Introduction, Thème, Composants, etc.).

**2. Traduire la documentation en anglais**

Pour mettre à jour la documentation en anglais, rendez vous dans le dossier **docs/en/documentation** :

```bash
cd /docs/en/documentation
```

**3. Ajouter de nouvelles sections**

Pour ajouter une nouvelle section, il faut créer un nouveau dossier ainsi que les fichiers markdown **docs/.vitepress/config/fr.ts** :

```bash
cd /docs/.vitepress/config/fr.ts
```

Exemple de création de nouvelle section :

```js
    {
        text: 'Nouvelle Section',
        collapsed: true,
        items: [
          { text: 'Partie 1', link: '/documentation/newsection/partie1' },
          { text: 'Partie 2', link: '/documentation/newsection/partie2' },
        ],
      }
```