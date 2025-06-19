# Dashboard Architecture

## Vue d'ensemble

Le dashboard de Yamify a été refactorisé pour adopter une architecture plus maintenable et modulaire basée sur un layout partagé et un système de contexte React. Cette nouvelle architecture résout plusieurs problèmes présents dans la version précédente :

- **Duplication de code** : Chaque page importait et réinstanciait les mêmes composants (LeftPanel, dialogs, etc.)
- **États inconsistants** : Les états comme `expandRightPanel` ou `workspaces` étaient gérés séparément dans chaque page
- **Multiples requêtes réseau** : Chaque page récupérait sa propre liste de workspaces
- **Maintenance difficile** : Les modifications du sidebar ou des dialogs nécessitaient des changements dans plusieurs fichiers

## Structure principale

La nouvelle architecture repose sur trois éléments clés :

1. **DashboardContext** : Un context React central qui gère les états partagés
2. **Layout partagé** : Un fichier `layout.tsx` qui englobe toutes les pages du dashboard
3. **Pages simplifiées** : Des pages qui se concentrent uniquement sur leur contenu spécifique

### DashboardContext

Le fichier `context/DashboardContext.tsx` centralise les états et la logique partagés :

```tsx
// États partagés gérés par le contexte
- expandRightPanel : Gestion de l'expansion du panneau latéral
- showYamDialog : Affichage/masquage du dialog de création de Yam
- showWorkspaceDialog : Affichage/masquage du dialog de création de Workspace
- workspaces : Liste des workspaces récupérée une seule fois
- loading : État de chargement des données
- error : Gestion des erreurs
- showAiModal : Affichage/masquage de la modal IA
```

### Layout partagé

Le fichier `layout.tsx` :
- Englobe toutes les sous-routes du dashboard grâce à la structure de Next.js
- Intègre le `LeftPanel` une seule fois
- Gère les dialogs et modals communs
- Enveloppe toutes les pages dans le `DashboardProvider` pour leur donner accès au contexte

## Comment l'utiliser

### Accéder au contexte dans un composant ou une page

```tsx
import { useDashboard } from "../context/DashboardContext";

export default function MaPage() {
  const { 
    expandRightPanel, 
    setShowAiModal,
    workspaces,
    // autres états ou fonctions nécessaires
  } = useDashboard();

  return (
    <MonComposant
      expandRightPanel={expandRightPanel}
      setShowAiModal={setShowAiModal}
    />
  );
}
```

### Ajouter un nouvel état partagé

1. Mettre à jour le type `DashboardContextType` dans `context/DashboardContext.tsx`
2. Ajouter le nouvel état dans le `DashboardProvider`
3. Inclure le nouvel état dans la valeur fournie par le provider

```tsx
// Exemple d'ajout d'un nouvel état
const [monNouvelEtat, setMonNouvelEtat] = useState(valeurInitiale);

// Inclure dans la valeur du provider
value={{
  // états existants
  monNouvelEtat,
  setMonNouvelEtat
}}
```

## Structures des fichiers

```
dashboard/
├── _components/            # Composants partagés du dashboard
│   ├── LeftPanel.tsx       # Sidebar commun
│   ├── AiChatModal.tsx
│   └── ...
├── context/                # Contextes React
│   └── DashboardContext.tsx # État global du dashboard
├── layout.tsx              # Layout partagé avec LeftPanel et modals
├── page.tsx                # Page principale du dashboard (simplifiée)
└── [sous-routes]/          # Sous-pages du dashboard
    ├── page.tsx            # Contenu spécifique sans duplication
    └── ...
```

## Bonnes pratiques

1. **Toujours utiliser le contexte** pour accéder aux états partagés plutôt que de les redéfinir localement
2. **Éviter d'importer LeftPanel** directement dans les pages du dashboard, il est déjà inclus dans le layout
3. **Limiter les composants de pages** au contenu du panneau droit (`RightPanel` et ses variantes)
4. **Maintenir le périmètre du contexte** : n'ajoutez que les états réellement partagés entre plusieurs pages
5. **Préférer les composants autonomes** qui reçoivent leurs dépendances via les props

## Notes techniques

- Le DashboardProvider gère automatiquement le chargement des workspaces au montage
- Les textes de chargement pour les dialogs sont définis dans le layout
- La classe CSS `dashboard` a été déplacée du niveau des pages au niveau du layout

---

Cette architecture suit le pattern "Context + Layout" de Next.js pour partager l'état et l'UI entre les pages appartenant à la même section de l'application, tout en respectant le principe de responsabilité unique.
