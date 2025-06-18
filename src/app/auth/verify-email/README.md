# Vérification d'Email OTP

Ce module gère la vérification en deux étapes (2FA) après l'inscription d'un utilisateur via Clerk.

## 📋 Fonctionnement

### Flux Utilisateur
1. L'utilisateur s'inscrit avec son email
2. Redirection automatique vers `/auth/verify-email`
3. Réception d'un code à 6 chiffres par email
4. Saisie du code dans l'interface
5. Redirection vers `/auth/onboarding` après validation

## ⚙️ Configuration

### Prérequis
- Compte Clerk configuré
- Variables d'environnement définies dans `.env`

### Variables d'Environnement
```env
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/auth/verify-email
NEXT_PUBLIC_CLERK_AFTER_VERIFICATION_URL=/auth/onboarding
```

## 🔧 Configuration des Emails

### 1. Dans le Tableau de Bord Clerk
1. Allez dans **Email & SMS** > **Email Templates**
2. Sélectionnez "Email address verification"
3. Personnalisez :
   - Expéditeur (From)
   - Objet (Subject)
   - Contenu du message

### Variables Disponibles
- `{{code}}` : Code de vérification à 6 chiffres
- `{{identifier}}` : Email de l'utilisateur
- `{{expires_in}}` : Durée de validité du code

## 🛠 Développement

### Composants
- `page.tsx` : Page principale de vérification avec animation
- `loading.tsx` (optionnel) : État de chargement

### Animation de Vérification
Après soumission réussie du code OTP, une animation de vérification s'affiche :
- Barre de progression animée
- Messages de statut dynamiques
- Redirection automatique après 10 secondes
- Design cohérent avec l'identité visuelle de Yamify

#### Messages d'Animation
1. "Verifying code..."
2. "Validating your identity..."
3. "Preparing your workspace..."
4. "Configuration completed !"

### Fonctionnalités
- Saisie du code sur 6 champs avec navigation automatique
- Support du copier-coller
- Renvoi de code
- Gestion des erreurs
- Redirection après vérification

## 🧪 Tests
1. Inscrivez un nouvel utilisateur
2. Vérifiez la réception de l'email
3. Saisissez le code reçu
4. Vérifiez la redirection vers l'onboarding

## 🔄 Flux d'Authentification Complet
1. Inscription → `/auth/sign-up`
2. Vérification Email → `/auth/verify-email`
3. Onboarding → `/auth/onboarding`
4. Tableau de bord → `/dashboard`

## 📝 Notes
- Le code est valable 10 minutes par défaut
- L'utilisateur peut demander un nouveau code
- L'interface est responsive et accessible
