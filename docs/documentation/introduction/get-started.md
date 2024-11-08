# Installation du widget

## Configuration dans Storybook

Vous pouvez tester et configurer le widget Geotrek-Rando dans un outil interactif appelé [**Storybook**](https://geotrekce.github.io/Geotrek-rando-widget/?path=/story/geotrek-rando-widget--app). 

Dans Storybook, vous pouvez personnaliser l’apparence et le comportement du widget avant de l’intégrer à votre site web. Storybook se base sur les identifiants d'objets dans Geotrek-admin, permet d'appliquer des filtres potentiels et d'ajuster le style selon les besoins.

### Étapes à suivre

1. **Vérifiez l'accès à l'API**  
   Avant de commencer, assurez-vous que l’API de votre Geotrek-admin autorise les requêtes provenant de `geotrekce.github.io`.

2. **Personnalisez le widget**  
   Dans Storybook, utilisez les options de configuration (appelées "controls") pour :
   - Modifier le fond de plan (carte de base)
   - Changer les couleurs, la langue, et les informations d’attribution
   - Configurer les paramètres d'API et les filtres (villes, secteurs, etc.)

3. **Générez le code**  
   Allez dans l'onglet "Docs" de Storybook et cliquez sur **Show code** pour obtenir le code HTML. Vous l'intégrerez ensuite dans votre site.

<center>
  <a title="Storybook"><img src="/introduction/storybook.jpg" alt="Storybook"></a>
</center>
 
::: tip Astuces
- Pour les champs de filtre (villes, secteurs, structures, etc.), utilisez les identifiants des objets, pas leur nom.
- Vous pouvez consulter l’API pour obtenir les identifiants (exemple pour les secteurs : https://randoadmin.parc-haut-jura.fr/api/v2/district/).
- Assurez-vous que l'itinéraire est publié dans Geotrek-admin pour qu'il apparaisse dans le widget.
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
   Collez le code source du widget généré depuis Storybook dans la section de votre site où vous souhaitez afficher le widget.
