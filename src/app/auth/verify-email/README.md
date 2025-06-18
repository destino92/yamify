# Vérification d'Email

Ce module gère la vérification de l'adresse email après l'inscription d'un utilisateur via Clerk.

## 📋 Fonctionnement

### Flux Utilisateur
1. L'utilisateur s'inscrit avec son email
2. Redirection automatique vers `/auth/verify-email`
3. Réception d'un code à 6 chiffres par email
4. Saisie du code dans l'interface
5. Redirection vers le tableau de bord ou l'onboarding après validation

## ⚙️ Configuration complète

### Prérequis
- Compte Clerk configuré
- Variables d'environnement définies dans `.env`

### Variables d'Environnement
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_******
CLERK_SECRET_KEY=sk_test_******
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/verify-email
```

## 🔧 Configuration de la vérification d'email dans Clerk

### 1. Activer la vérification d'email
1. Allez dans le [Tableau de bord Clerk](https://dashboard.clerk.dev)
2. Naviguez vers **User & Authentication > Email, Phone, Username**
3. Dans la section **Email address**, assurez-vous que l'option **Require email verification** est activée

### 2. Configurer le template d'email
1. Allez dans **Customization > Email Templates**
2. Sélectionnez **Verification code**
3. Personnalisez :
   - Expéditeur (From)
   - Objet (Subject)
   - Contenu du message

### Variables disponibles dans le template
- `{{{code}}}` : Code de vérification à 6 chiffres
- `{{{user.email_address}}}` : Email de l'utilisateur
- `{{{application.name}}}` : Nom de l'application
- `{{{code_expiration_minutes}}}` : Durée de validité du code en minutes

## 🛠 Développement

### Composants
- `page.tsx` : Page principale de vérification avec animation
- `loading.tsx` (optionnel) : État de chargement

### 🔨 Intégration avec Clerk

La page utilise les hooks de Clerk pour gérer la vérification d'email :

```typescript
import { useSignUp } from "@clerk/nextjs";

// Dans le composant
const { isLoaded, signUp, setActive } = useSignUp();

// Vérification du code
const verifyCode = async (code: string) => {
  if (!isLoaded || !signUp) return;
  
  try {
    const completeSignUp = await signUp.attemptEmailAddressVerification({
      code,
    });
    
    if (completeSignUp.status === "complete") {
      await setActive({ session: completeSignUp.createdSessionId });
      router.push("/dashboard");
    }
  } catch (err) {
    // Gestion des erreurs
  }
};

// Renvoi du code
const resendCode = async () => {
  if (!isLoaded || !signUp) return;
  
  try {
    await signUp.prepareEmailAddressVerification();
    // Afficher confirmation
  } catch (err) {
    // Gestion des erreurs
  }
};
```

### Animation de Vérification
Après soumission réussie du code, une animation de vérification s'affiche :
- Barre de progression animée
- Messages de statut dynamiques
- Redirection automatique après complétion
- Design cohérent avec l'identité visuelle de Yamify

### Fonctionnalités
- Saisie du code sur 6 champs avec navigation automatique
- Support du copier-coller
- Renvoi de code
- Gestion des erreurs

## 🧪 Tests

### Test manuel
1. Inscrivez un nouvel utilisateur avec une adresse email valide
2. Vérifiez la réception de l'email contenant le code
3. Saisissez le code reçu dans l'interface
4. Vérifiez la redirection après validation

### Test des cas d'erreur
1. Testez avec un code incorrect
2. Testez avec un code expiré
3. Testez la fonctionnalité de renvoi de code
4. Vérifiez les messages d'erreur appropriés

## 🔒 Sécurité et middleware

Assurez-vous que le middleware de votre application autorise l'accès à cette page sans authentification complète :

```typescript
export default authMiddleware({
  publicRoutes: [
    // Autres routes publiques
    "/auth/verify-email(.*)",
  ],
});
```

## 🔄 Flux d'Authentification Complet
1. Connexion → `/auth/sign-in`
2. Inscription → `/auth/sign-up`
3. Vérification Email → `/auth/verify-email`
4. Réinitialisation mot de passe → `/auth/reset-password`
5. Création nouveau mot de passe → `/auth/new-password`
6. Tableau de bord → `/dashboard`

## 📝 Notes importantes
- Le code est valable 10 minutes par défaut (configurable dans Clerk)
- L'utilisateur peut demander un nouveau code via le bouton de renvoi
- L'interface est responsive et adaptée aux appareils mobiles
- Les animations sont optimisées pour les performances
- Les messages d'erreur sont affichés de manière claire pour guider l'utilisateur
