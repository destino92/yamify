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
Assurez-vous d'avoir ces variables dans votre `.env.local` :

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/verify-email
```

## 🔧 Configuration dans Clerk

### 1. Configurer l'URL de redirection
1. Allez dans le [Tableau de bord Clerk](https://dashboard.clerk.dev)
2. Naviguez vers "Email & SMS" > "Email Templates"
3. Sélectionnez "Reset password"
4. Dans "Redirect URL", entrez : `https://votredomaine.com/auth/reset-password/verify`

### 2. Personnaliser l'email (optionnel)
1. Dans le même écran, personnalisez :
   - Expéditeur (From)
   - Objet (Subject)
   - Contenu du message

### Variables disponibles dans le template
- `{{link}}` : Lien de réinitialisation sécurisé
- `{{identifier}}` : Email de l'utilisateur
- `{{expires_in}}` : Durée de validité du lien

## 🎨 Composants

### `page.tsx`
- Gère le formulaire de demande de réinitialisation
- Affiche l'animation de chargement
- Affiche la confirmation d'envoi

### `ResetPassword.css`
- Styles spécifiques à la page
- Animations et transitions
- Mise en page responsive

## ✨ Fonctionnalités

### Page de demande
- Validation de l'email
- Gestion des erreurs
- Animation pendant l'envoi

### Page de confirmation
- Affichage de l'email de destination
- Boutons pour ouvrir Gmail/Outlook
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
1. Connexion → `/sign-in`
2. Inscription → `/sign-up`
3. Vérification email → `/auth/verify-email`
4. Réinitialisation mot de passe → `/reset-password`
5. Tableau de bord → `/dashboard`

## 📝 Notes importantes
- Les liens de réinitialisation expirent après 24h
- L'utilisateur peut demander un nouveau lien si nécessaire
- L'interface est entièrement responsive
- Les animations sont optimisées pour les performances

## 🔒 Sécurité
- Utilisation de tokens JWT sécurisés
- Protection contre les attaques par force brute
- Validation côté serveur de tous les champs
- Messages d'erreur génériques pour éviter le fishing