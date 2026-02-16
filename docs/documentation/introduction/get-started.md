# Installation du widget

Le widget se configure via un **constructeur de Widget**, puis s’intègre par simple copier-coller du code HTML généré.

## Configuration 

Vous pouvez tester et configurer le widget avec le [**constructeur de Widget**](https://geotrekce.github.io/Geotrek-rando-widget/?path=/story/geotrek-rando-widget--app). 

Cette interface propose une configuration plus claire et plus intuitive, avec une **prévisualisation en direct du composant**. Elle permet également de **lier le widget à une instance Geotrek-admin**, afin de récupérer automatiquement les valeurs existantes pour chaque paramètre sous forme de listes déroulantes. 

Cette connexion facilite la configuration en proposant directement les termes disponibles dans l’API (filtres, catégories, pratiques, etc.) et permet de prévisualiser le rendu avec les données réelles de l’instance concernée. Une fois la configuration finalisée, le constructeur génère automatiquement le **code HTML prêt à intégrer** dans votre site.

Le constructeur est développé dans un dépôt dédié :
[https://github.com/GeotrekCE/grw-config/](https://github.com/GeotrekCE/grw-config/)

Il est désormais déployé à la place du Storybook à l’adresse suivante :
[https://geotrekce.github.io/Geotrek-rando-widget/](https://geotrekce.github.io/Geotrek-rando-widget/)

### Étapes à suivre

1. **Vérifiez l'accès à l'API**  
   Avant de commencer, assurez-vous que l’API de votre Geotrek-admin autorise les requêtes provenant de `geotrekce.github.io`.

2. **Renseignez l’instance Geotrek-admin et configurez le composant**
Dans le constructeur :
- renseignez l’URL de l’API de votre Geotrek-admin
- sélectionnez le composant à intégrer
- configurez les paramètres (couleurs, langue, fond de carte, filtres, etc.)
- utilisez la prévisualisation pour valider le rendu et les données affichées

3. **Générez le code HTML**
Une fois la configuration finalisée, générez et copiez le **code HTML** fourni par le constructeur : c’est ce code que vous intégrerez dans votre site web.

<center>
  <a title="Storybook"><img src="/introduction/builder.png" alt="Constructeur de Widget"></a>
</center>
 
::: tip Astuces
- Assurez-vous que les objets (itinéraires, contenus, événements, etc.) sont **publiés** dans Geotrek-admin pour apparaître dans le widget.
:::

## Intégration sur votre site web

1. **Autorisez l'accès à l'API**  
   L’API de Geotrek-admin doit être configurée pour autoriser l’accès aux données soit à tout le monde, soit spécifiquement au domaine de votre site.

2. **Ajoutez le widget dans la section `<head>` de votre site**  
   Copiez et collez les balises HTML ci-dessous dans la section `<head>` de votre site web

   ```html
   <link rel="stylesheet" href="https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.css" />
   <script type="module" src="https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.esm.js"></script>
   <script nomodule src="https://rando-widget.geotrek.fr/latest/dist/geotrek-rando-widget/geotrek-rando-widget.js"></script>
   ```

::: tip Conseil de version
   - Le tag `latest` garantit que vous utiliserez toujours la version la plus récente du widget.
   - Si vous souhaitez figer une version spécifique (ex. : `https://rando-widget.geotrek.fr/0.13.0/...`), remplacez `latest` par le numéro de version pour conserver un comportement stable et éviter les breaking changes.
:::

3. **Insérez le code généré**
Collez dans la section de votre site où vous souhaitez afficher le widget le code HTML généré depuis le **constructeur de Widget**.
