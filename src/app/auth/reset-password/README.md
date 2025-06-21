# Réinitialisation de mot de passe

Ce module permet aux utilisateurs de réinitialiser leur mot de passe en cas d'oubli, en utilisant un lien sécurisé envoyé par email.

## 📋 Fonctionnement

### Flux Utilisateur
1. L'utilisateur clique sur "Mot de passe oublié ?"
2. Il entre son adresse email
3. Un email avec un lien de réinitialisation lui est envoyé
4. L'utilisateur clique sur le lien dans l'email
5. Il est redirigé vers une page pour définir un nouveau mot de passe

## ⚙️ Configuration requise

### Variables d'environnement
Assurez-vous d'avoir ces variables dans votre fichier `.env` :

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_******
CLERK_SECRET_KEY=sk_test_******
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 🔧 Configuration dans Clerk

### 1. Configurer le flux de réinitialisation
1. Allez dans le [Tableau de bord Clerk](https://dashboard.clerk.dev)
2. Naviguez vers **User & Authentication > Email, Phone, Username**
3. Assurez-vous que l'authentification par email est activée
4. Dans la section **Password reset**, activez l'option **Enable password reset**

### 2. Configurer l'URL de redirection
1. Dans la même section **Password reset**
2. Configurez le modèle d'email de réinitialisation avec un lien qui redirige vers `/auth/new-password?token={{{token}}}`

### 3. Personnaliser l'email (optionnel)
1. Dans le même écran, personnalisez :
   - Expéditeur (From)
   - Objet (Subject)
   - Contenu du message

### Variables disponibles dans le template
- `{{{token}}}` : Token de réinitialisation sécurisé
- `{{{user.email_address}}}` : Email de l'utilisateur
- `{{{user.first_name}}}` : Prénom de l'utilisateur (si disponible)
- `{{{application.name}}}` : Nom de l'application

## 🎨 Composants

### `page.tsx`
- Gère le formulaire de demande de réinitialisation
- Utilise le hook `useSignIn` de Clerk pour envoyer l'email
- Affiche l'animation de chargement pendant l'envoi
- Affiche la confirmation d'envoi avec options pour accéder aux emails

### `ResetPassword.css`
- Styles spécifiques à la page
- Animations et transitions
- Mise en page responsive

## ✨ Fonctionnalités

### Intégration Clerk
```typescript
const { isLoaded, signIn } = useSignIn();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!isLoaded || !signIn) return;
  
  setLoading(true);
  setError("");
  setSending(true);
  
  try {
    // Envoyer l'email de réinitialisation via Clerk
    await signIn.create({
      strategy: "reset_password_email_code",
      identifier: email,
    });
    
    setSuccess(true);
  } catch (err: any) {
    const errorMessage = err.errors?.[0]?.message || "An error occurred. Please try again.";
    toast.error(errorMessage);
  } finally {
    setLoading(false);
    setSending(false);
  }
};
```

### Page de demande
- Validation de l'email
- Gestion des erreurs avec toast notifications
- Animation pendant l'envoi
- Gestion des états (loading, success, error)

### Page de confirmation
- Affichage de l'email de destination
- Boutons pour ouvrir Gmail/Outlook directement
- Option pour renvoyer le lien
- Bouton de retour à la connexion

## 🧪 Tests

1. Accédez à `/sign-in`
2. Cliquez sur "Mot de passe oublié ?"
3. Entrez une adresse email valide
4. Vérifiez la réception de l'email
5. Testez les boutons Gmail/Outlook
6. Vérifiez la redirection après réinitialisation

## 🔄 Flux d'authentification complet
1. Connexion → `/auth/sign-in`
2. Inscription → `/auth/sign-up`
3. Vérification email → `/auth/verify-email`
4. Réinitialisation mot de passe → `/auth/reset-password`
5. Création nouveau mot de passe → `/auth/new-password`
6. Tableau de bord → `/dashboard`

## 🔒 Sécurité et middleware

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

## 📝 Notes importantes
- Les liens de réinitialisation expirent après 24h par défaut (configurable dans Clerk)
- L'utilisateur peut demander un nouveau lien si nécessaire via le bouton "Click to resend"
- L'interface est entièrement responsive et adaptée aux appareils mobiles
- Les animations sont optimisées pour les performances
- Les messages d'erreur sont affichés via des toasts pour une meilleure expérience utilisateur