# Page de création d'un nouveau mot de passe

Cette page permet aux utilisateurs de créer un nouveau mot de passe après avoir reçu un lien de réinitialisation par email. Elle fait partie du flux de réinitialisation de mot de passe de l'application Yamify.

## Fonctionnalités

- Formulaire de création de nouveau mot de passe
- Validation des champs (longueur minimale, correspondance des mots de passe)
- Intégration avec l'API Clerk pour la réinitialisation du mot de passe
- Gestion des états de chargement et des erreurs
- Affichage/masquage du mot de passe
- Redirection après succès
- Design cohérent avec le reste de l'application

## Configuration Clerk

### Prérequis

Pour que cette page fonctionne correctement, vous devez avoir configuré Clerk avec les variables d'environnement appropriées dans votre fichier `.env` :

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_******
CLERK_SECRET_KEY=sk_test_******
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### Configuration du flux de réinitialisation

Dans le tableau de bord Clerk :

1. Accédez à **User & Authentication > Email, Phone, Username**
2. Assurez-vous que l'authentification par email est activée
3. Dans la section **Password reset**, activez l'option **Enable password reset**
4. Configurez le modèle d'email de réinitialisation avec un lien qui redirige vers `/auth/new-password?token={{{token}}}`

### Middleware

Assurez-vous que le middleware de votre application autorise l'accès à cette page sans authentification :

```typescript
export default authMiddleware({
  publicRoutes: [
    // Autres routes publiques
    "/auth/reset-password(.*)",
    "/auth/new-password(.*)",
  ],
});
```

## Utilisation de l'API Clerk

Cette page utilise le hook `useSignIn` de Clerk pour gérer la réinitialisation du mot de passe :

```typescript
const { isLoaded, signIn, setActive } = useSignIn();

// Récupération du token depuis l'URL
const searchParams = useSearchParams();
const token = searchParams.get("token");

// Réinitialisation du mot de passe
const resetPassword = async () => {
  if (!isLoaded || !signIn || !token) return;
  
  try {
    const result = await signIn.attemptFirstFactor({
      strategy: "reset_password_email_code",
      code: token,
      password,
    });
    
    if (result.status === "complete") {
      await setActive({ session: result.createdSessionId });
      router.push("/dashboard");
    }
  } catch (err) {
    // Gestion des erreurs
  }
};
```

## Personnalisation

Vous pouvez personnaliser cette page en modifiant :

- Le style dans `NewPassword.css`
- Les messages d'erreur et de succès
- Les règles de validation du mot de passe
- Le comportement de redirection après succès