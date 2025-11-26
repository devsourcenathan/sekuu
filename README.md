# 📱 Training Platform - Frontend React/TypeScript

## 🎯 Vue d'ensemble du projet

Application web moderne pour une plateforme de formations en ligne, développée avec React, TypeScript, et Vite. Interface utilisateur responsive avec trois espaces distincts : Étudiant, Instructeur, et Admin.

## 🏗️ Stack Technique

### Core
- **Framework**: React 18+ avec TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: TanStack Query (React Query) + Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Bibliothèques complémentaires à installer

```bash
# Routing
npm install react-router-dom

# State Management
npm install zustand

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Date Management
npm install date-fns

# Rich Text Editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder

# Video Players
npm install react-player

# File Upload
npm install react-dropzone

# Charts & Analytics
npm install recharts

# PDF Generation
npm install jspdf html2canvas

# Notifications
npm install sonner

# Icons (en plus de lucide-react)
npm install @radix-ui/react-icons

# Utils
npm install clsx tailwind-merge class-variance-authority
```

### Internationalisation (i18n)

Ajout de la configuration d'internationalisation basée sur i18next + react-i18next.

Installez les dépendances suivantes :

```bash
# Runtime + React bindings
npm install i18next react-i18next

# (Optionnel) Typings TypeScript pour react-i18next
npm install -D @types/react-i18next
```

## 📁 Structure du Projet

```
src/
├── app/                          # Configuration de l'application
│   ├── App.tsx
│   ├── main.tsx
│   └── router.tsx
│
├── assets/                       # Images, fonts, etc.
│   ├── images/
│   └── icons/
│
├── components/                   # Composants réutilisables
│   ├── ui/                      # shadcn/ui components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── MainLayout.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ForgotPasswordForm.tsx
│   ├── course/
│   │   ├── CourseCard.tsx
│   │   ├── CourseList.tsx
│   │   ├── CourseFilters.tsx
│   │   ├── ChapterList.tsx
│   │   └── LessonPlayer.tsx
│   ├── test/
│   │   ├── QuestionRenderer.tsx
│   │   ├── TestTimer.tsx
│   │   └── TestSubmission.tsx
│   └── shared/
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       ├── EmptyState.tsx
│       └── ProgressBar.tsx
│
├── features/                     # Fonctionnalités par domaine
│   ├── auth/
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useLogin.ts
│   │   ├── api/
│   │   │   └── authApi.ts
│   │   └── types/
│   │       └── auth.types.ts
│   │
│   ├── courses/
│   │   ├── hooks/
│   │   │   ├── useCourses.ts
│   │   │   ├── useCreateCourse.ts
│   │   │   └── useEnrollment.ts
│   │   ├── api/
│   │   │   └── coursesApi.ts
│   │   ├── types/
│   │   │   └── course.types.ts
│   │   └── components/
│   │       ├── CourseForm.tsx
│   │       └── CourseSettings.tsx
│   │
│   ├── lessons/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── components/
│   │       ├── LessonForm.tsx
│   │       ├── VideoPlayer.tsx
│   │       └── RichTextEditor.tsx
│   │
│   ├── tests/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── components/
│   │       ├── TestBuilder.tsx
│   │       ├── QuestionForm.tsx
│   │       └── TestTaking.tsx
│   │
│   ├── payments/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   └── components/
│   │       ├── CheckoutForm.tsx
│   │       ├── PaymentMethod.tsx
│   │       └── InvoiceDownload.tsx
│   │
│   └── dashboard/
│       ├── student/
│       ├── instructor/
│       └── admin/
│
├── pages/                        # Pages de l'application
│   ├── public/
│   │   ├── Home.tsx
│   │   ├── CourseCatalog.tsx
│   │   └── CourseDetails.tsx
│   │
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ResetPassword.tsx
│   │
│   ├── student/
│   │   ├── Dashboard.tsx
│   │   ├── MyCourses.tsx
│   │   ├── CoursePlayer.tsx
│   │   ├── Certificates.tsx
│   │   └── MyPayments.tsx
│   │
│   ├── instructor/
│   │   ├── Dashboard.tsx
│   │   ├── MyCourses.tsx
│   │   ├── CreateCourse.tsx
│   │   ├── EditCourse.tsx
│   │   ├── Students.tsx
│   │   ├── PendingGradings.tsx
│   │   └── Revenue.tsx
│   │
│   └── admin/
│       ├── Dashboard.tsx
│       ├── Users.tsx
│       ├── Courses.tsx
│       ├── Payments.tsx
│       └── Settings.tsx
│
├── lib/                          # Utilities et helpers
│   ├── api/
│   │   ├── client.ts            # Configuration Axios
│   │   └── endpoints.ts
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useMediaQuery.ts
│   ├── utils/
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── helpers.ts
│   └── constants/
│       ├── routes.ts
│       └── config.ts
│
├── store/                        # Zustand stores
│   ├── authStore.ts
│   ├── uiStore.ts
│   └── courseStore.ts
│
├── types/                        # Types TypeScript globaux
│   ├── api.types.ts
│   ├── common.types.ts
│   └── index.ts
│
└── styles/                       # Styles globaux
    ├── globals.css
    └── themes.css
```

## 🚀 Roadmap de Développement

### **Phase 1: Configuration & Fondations (Semaine 1)**

#### Jour 1-2: Setup Initial
- [x] Initialisation du projet (déjà fait)
- [ ] Configuration de l'architecture des dossiers
- [ ] Setup de React Router avec routes protégées
- [ ] Configuration d'Axios avec intercepteurs
- [ ] Setup de TanStack Query avec configuration globale
- [ ] Configuration de Zustand pour le state management
- [ ] Setup des variables d'environnement

#### Jour 3-4: Design System
- [ ] Configuration complète de shadcn/ui
- [ ] Création du thème personnalisé (couleurs, typography)
- [ ] Composants de layout (Header, Sidebar, Footer)
- [ ] Composants UI partagés (LoadingSpinner, ErrorBoundary, etc.)
- [ ] Page 404 et pages d'erreur

#### Jour 5-7: Module d'Authentification
- [ ] Types TypeScript pour Auth
- [ ] API Client pour Auth
- [ ] Hooks: useAuth, useLogin, useRegister
- [ ] Store Zustand pour l'authentification
- [ ] Pages: Login, Register, Forgot Password, Reset Password
- [ ] Protected Routes & Role-based routing
- [ ] Token management & refresh logic
- [ ] Persistance de l'auth (localStorage)

---

### **Phase 2: Espace Public & Catalogue (Semaine 2)**

#### Jour 1-3: Page d'Accueil & Navigation
- [ ] Landing page avec hero section
- [ ] Navigation principale responsive
- [ ] Footer avec liens utiles
- [ ] Search bar globale
- [ ] Filtres de cours (catégorie, niveau, prix)

#### Jour 4-7: Catalogue de Cours
- [ ] Types pour les courses
- [ ] API hooks: useCourses, useCourseDetails
- [ ] CourseCard component avec preview
- [ ] CourseList avec pagination
- [ ] CourseFilters component
- [ ] Page Course Details
  - Informations du cours
  - Chapitres et leçons (preview)
  - Instructeur
  - Reviews (placeholder)
  - CTA d'inscription/achat
- [ ] Système de recherche avec debounce
- [ ] Tri des cours (popularité, date, prix)

---

### **Phase 3: Espace Étudiant - Core (Semaine 3)**

#### Jour 1-2: Dashboard Étudiant
- [ ] Layout du dashboard étudiant
- [ ] Vue d'ensemble (stats, cours en cours)
- [ ] Hooks: useStudentDashboard
- [ ] Affichage des cours en cours
- [ ] Progression globale
- [ ] Prochaines échéances

#### Jour 3-5: Mes Cours
- [ ] Liste des cours inscrits
- [ ] Filtres (actifs, terminés, etc.)
- [ ] Hooks: useMyEnrollments
- [ ] Card de cours avec progression
- [ ] Redirection vers le course player

#### Jour 6-7: Course Player
- [ ] Layout du player (sidebar + content)
- [ ] Navigation entre chapitres/leçons
- [ ] VideoPlayer component (react-player)
- [ ] RichTextViewer pour contenu texte
- [ ] Marquage de leçon comme complétée
- [ ] Hooks: useLessonProgress
- [ ] Progression automatique
- [ ] Notes de cours (sidebar)

---

### **Phase 4: Tests & Évaluations (Semaine 4)**

#### Jour 1-3: Passer un Test (Étudiant)
- [ ] Types pour tests et questions
- [ ] Page de démarrage de test
- [ ] TestTimer component
- [ ] QuestionRenderer component
  - Single choice
  - Multiple choice
  - True/False
  - Short answer
  - Long answer
- [ ] Auto-save des réponses (draft)
- [ ] Navigation entre questions
- [ ] Hooks: useTestSubmission
- [ ] Modal de confirmation de soumission
- [ ] Page de résultats

#### Jour 4-7: Créer un Test (Instructeur)
- [ ] Page TestBuilder
- [ ] Formulaire de configuration du test
- [ ] QuestionForm component
- [ ] Gestion des options de réponse
- [ ] Drag & drop pour réordonner
- [ ] Preview du test
- [ ] Hooks: useCreateTest, useUpdateTest
- [ ] Banque de questions (placeholder)

---

### **Phase 5: Paiements & Inscriptions (Semaine 5)**

#### Jour 1-3: Système de Paiement
- [ ] Types pour payments
- [ ] Page de checkout
- [ ] Intégration Stripe (checkout session)
- [ ] Intégration PayPal (bouton)
- [ ] Hooks: usePayment, useCreatePayment
- [ ] Codes promo
- [ ] Calcul du total avec réductions
- [ ] Modal de confirmation

#### Jour 4-5: Historique des Paiements
- [ ] Page MyPayments
- [ ] Liste des paiements
- [ ] Hooks: useMyPayments
- [ ] Téléchargement de facture (PDF)
- [ ] Demande de remboursement
- [ ] Statut des paiements

#### Jour 6-7: Certificats
- [ ] Page MyCertificates
- [ ] Hooks: useMyCertificates
- [ ] Affichage des certificats
- [ ] Téléchargement PDF
- [ ] Partage sur LinkedIn (link)
- [ ] Page publique de vérification

---

### **Phase 6: Espace Instructeur - Gestion des Cours (Semaine 6)**

#### Jour 1-3: Dashboard Instructeur
- [ ] Layout instructeur
- [ ] Vue d'ensemble (stats, revenus)
- [ ] Hooks: useInstructorDashboard
- [ ] Graphiques (recharts)
- [ ] Cours récents
- [ ] Notifications

#### Jour 4-7: Créer/Éditer un Cours
- [ ] Formulaire multi-étapes
  - Informations générales
  - Contenu (chapitres/leçons)
  - Paramètres d'accès
  - Tarification
  - Publication
- [ ] CourseForm component
- [ ] ChapterForm component
- [ ] LessonForm component
- [ ] Upload d'images (cover)
- [ ] Intégration vidéo (YouTube/Vimeo URL)
- [ ] Rich Text Editor (TipTap)
- [ ] Hooks: useCreateCourse, useUpdateCourse
- [ ] Preview du cours
- [ ] Publier/Dépublier

---

### **Phase 7: Espace Instructeur - Gestion Avancée (Semaine 7)**

#### Jour 1-3: Gestion des Étudiants
- [ ] Liste des étudiants inscrits
- [ ] Filtres par cours
- [ ] Hooks: useMyStudents
- [ ] Progression individuelle
- [ ] Communication (placeholder pour messaging)
- [ ] Export des données

#### Jour 4-5: Évaluation des Tests
- [ ] Page PendingGradings
- [ ] Queue des tests à corriger
- [ ] Hooks: usePendingGradings
- [ ] Interface de notation
- [ ] Feedback par question
- [ ] Note globale et mention
- [ ] Commentaires de l'instructeur
- [ ] Validation/Publication des résultats

#### Jour 6-7: Analytics & Revenus
- [ ] Page Analytics par cours
- [ ] Graphiques de progression
- [ ] Taux d'achèvement
- [ ] Sections problématiques
- [ ] Page Revenue
- [ ] Hooks: useInstructorRevenue
- [ ] Historique des ventes
- [ ] Graphiques de revenus

---

### **Phase 8: Espace Admin (Semaine 8)**

#### Jour 1-2: Dashboard Admin
- [ ] Layout admin
- [ ] Vue d'ensemble globale
- [ ] KPIs (utilisateurs, revenus, cours)
- [ ] Hooks: useAdminDashboard
- [ ] Graphiques de tendances

#### Jour 3-4: Gestion des Utilisateurs
- [ ] Liste des utilisateurs
- [ ] Filtres (rôle, statut)
- [ ] Hooks: useManageUsers
- [ ] Édition de profil
- [ ] Attribution de rôles
- [ ] Suspension/Activation
- [ ] Recherche

#### Jour 5-6: Gestion des Cours
- [ ] Liste de tous les cours
- [ ] Filtres (statut, instructeur)
- [ ] Hooks: useManageCourses
- [ ] Validation des nouveaux cours
- [ ] Modération du contenu
- [ ] Archivage

#### Jour 7: Gestion des Paiements
- [ ] Liste de toutes les transactions
- [ ] Filtres (statut, date, montant)
- [ ] Hooks: useManagePayments
- [ ] Gestion des remboursements
- [ ] Rapports financiers

---

### **Phase 9: Fonctionnalités Avancées (Semaine 9)**

#### Jour 1-2: Gestion des Ressources
- [ ] Upload de fichiers (react-dropzone)
- [ ] Types de ressources supportés (PDF, images, ZIP)
- [ ] Preview des ressources
- [ ] Hooks: useUploadResource
- [ ] Téléchargement sécurisé
- [ ] Limite de téléchargements

#### Jour 3-4: Système de Notifications
- [ ] Toast notifications (sonner)
- [ ] Centre de notifications
- [ ] Hooks: useNotifications
- [ ] Marquage comme lu
- [ ] Types de notifications

#### Jour 5-7: Optimisations
- [ ] Lazy loading des composants
- [ ] Optimisation des images
- [ ] Infinite scroll pour listes
- [ ] Debouncing des recherches
- [ ] Cache strategies pour React Query
- [ ] Error boundaries
- [ ] Loading states everywhere

---

### **Phase 10: Polish & Tests (Semaine 10)**

#### Jour 1-3: Responsive Design
- [ ] Mobile layout pour toutes les pages
- [ ] Tablet optimizations
- [ ] Sidebar collapsible
- [ ] Touch gestures
- [ ] Mobile navigation

#### Jour 4-5: Accessibilité (A11y)
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Screen reader support
- [ ] Color contrast

#### Jour 6-7: Tests & Documentation
- [ ] Tests unitaires (Vitest)
- [ ] Tests d'intégration
- [ ] Documentation des composants
- [ ] Storybook setup (optionnel)
- [ ] README complet

---

## 🎨 Design Guidelines

### Palette de Couleurs
```css
/* Primary */
--primary: 222.2 47.4% 11.2%;
--primary-foreground: 210 40% 98%;

/* Secondary */
--secondary: 210 40% 96.1%;
--secondary-foreground: 222.2 47.4% 11.2%;

/* Accent */
--accent: 210 40% 96.1%;
--accent-foreground: 222.2 47.4% 11.2%;

/* Success */
--success: 142.1 76.2% 36.3%;

/* Warning */
--warning: 38 92% 50%;

/* Error */
--destructive: 0 84.2% 60.2%;
```

### Typography
- **Headings**: Font Weight 600-700
- **Body**: Font Weight 400
- **Small**: Font Size 0.875rem
- **Base**: Font Size 1rem

### Spacing
- Utiliser le système de spacing de Tailwind (4px base)
- Padding des containers: `px-4 md:px-6 lg:px-8`
- Gaps: `gap-4` pour la plupart des layouts

---

## 🔧 Configuration Importantes

### Axios Client
```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
    }
    return Promise.reject(error);
  }
);
```

### TanStack Query Setup
```typescript
// app/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### Protected Routes
```typescript
// components/auth/ProtectedRoute.tsx
const ProtectedRoute = ({ 
  children, 
  allowedRoles 
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};
```

---

## 📝 Conventions de Code

### Naming
- **Components**: PascalCase (`CourseCard.tsx`)
- **Hooks**: camelCase avec préfixe `use` (`useCourses.ts`)
- **Types**: PascalCase avec suffix (`CourseType`, `ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE

### File Organization
- Un composant = un fichier
- Co-locate types avec composants quand possible
- Export named exports par défaut

### Comments
- JSDoc pour fonctions publiques
- Commenter la logique complexe
- TODO pour futures améliorations

---

## 🚦 Priorités de Développement

### 🔴 Critique (Must Have)
1. Authentification complète
2. Catalogue de cours public
3. Inscription aux cours
4. Course player basique
5. Paiement Stripe
6. Dashboard étudiant
7. Création de cours (instructeur)

### 🟡 Important (Should Have)
1. Tests et évaluations
2. Certificats
3. Analytics instructeur
4. Admin dashboard
5. PayPal integration
6. Gestion des ressources

### 🟢 Nice to Have
1. Notifications en temps réel
2. Forum/Q&A
3. Messagerie
4. Mode sombre
5. PWA features
6. Gamification

---

## 📊 Métriques de Performance

### Objectifs
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: > 90
- **Bundle Size**: < 500KB (initial)

### Stratégies
- Code splitting par route
- Lazy loading des images
- Compression des assets
- CDN pour médias statiques

---

## 🔒 Sécurité Frontend

- [ ] Validation côté client (zod schemas)
- [ ] XSS prevention (sanitize HTML)
- [ ] CSRF tokens
- [ ] Secure token storage
- [ ] Input sanitization
- [ ] Rate limiting visual feedback
- [ ] Secure file uploads validation

---

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

---

## 🎯 Next Steps

1. **Semaine 1**: Commencer par la Phase 1 (Fondations)
2. **Chaque jour**: Commit réguliers sur Git
3. **Chaque semaine**: Review du code et refactoring
4. **Fin de chaque phase**: Tests manuels complets

**Durée estimée totale**: 10 semaines (2.5 mois)

---

*Cette roadmap est flexible et peut être ajustée en fonction des priorités business et des retours utilisateurs.*