# 🐱 Cat Explorer

A modern, elegant cat management application built with **Angular 21** — showcasing the latest Angular features including Signals, Zoneless Change Detection, and Standalone Architecture.

> Built as part of the DATAI2I Senior Frontend Developer Assignment

---

## 🚀 Live Demo

[https://github.com/Varma0313/Cat-Explorer](https://github.com/Varma0313/Cat-Explorer)

---

## ✨ Features

### Core Requirements

- ✅ **Angular 21** — latest stable, leveraging newest features throughout
- ✅ **Material Design** — MatCard, MatDialog, MatSnackBar, MatFormField
- ✅ **Fully Standalone** — zero NgModules anywhere
- ✅ **Signals throughout** — signal(), computed(), input(), output()
- ✅ **Zoneless Change Detection** — provideZonelessChangeDetection()
- ✅ **Strict TypeScript** — zero `any` usage, all interfaces typed
- ✅ **All 5 API endpoints used** — GET /list, GET /list?id, POST /create, PUT /update, DELETE /delete
- ✅ **No tables in UI** — card-based expandable layout

### Beyond Requirements

- 📊 **Dashboard** — 4 live stat cards (Total Cats, Avg Age, Youngest, Oldest) — all computed signals
- 🔍 **Real-time search** — filters by name and description using computed signal
- 📥 **Export CSV** — client-side generation using Blob API, no library needed
- 💀 **Skeleton loading** — shimmer animation while API fetches
- ⚡ **Optimistic updates** — instant UI feedback on edit
- 🐱 **Cat animation** — running cat GIF during form submission
- 🔔 **Snackbar notifications** — success/error feedback for all operations
- 📱 **Fully responsive** — mobile bottom nav, tablet and desktop layouts
- 🎨 **Colored avatars** — deterministic color per cat based on name

---

## 🏗️ Architecture

```
src/app/
├── core/
│   ├── models/           # Cat, ApiResponse, CatPayload interfaces
│   └── services/         # CatApiService — all 5 HTTP endpoints
├── features/
│   ├── dashboard/        # Dashboard page — stats + recent cats + export
│   └── cats/
│       ├── store/        # CatsStore — root-level signal state
│       ├── pages/        # CatsPage — search + grid + CRUD
│       └── components/   # CatCard + CreateCatDialog
└── environments/         # Dev and production API config
```

### Key Design Decisions

**Root-level CatsStore** — Both Dashboard and CatsPage share one singleton store instance. One API call, one signal, both pages stay in sync automatically.

**Computed signals for stats** — `totalCats`, `avgAge`, `youngestCat`, `oldestCat` are all `computed()` signals derived from the cats array. Auto-update with zero extra code.

**Optimistic updates** — Edit updates the signal immediately without waiting for API response. Zero loading flicker.

**Lazy-loaded routes** — Each page is a separate JS chunk via `loadComponent`. Better initial load performance.

---

## 🛠️ Tech Stack

| Technology       | Version | Usage            |
| ---------------- | ------- | ---------------- |
| Angular          | 21      | Framework        |
| Angular Material | 21      | UI Components    |
| TypeScript       | 5.9     | Strict mode      |
| RxJS             | 7.8     | HTTP observables |

---

## 📡 API Endpoints

Base URL: `https://gps6cdg7h9.execute-api.eu-central-1.amazonaws.com/prod`

| Method | Endpoint          | Used In                       |
| ------ | ----------------- | ----------------------------- |
| GET    | /list             | Load all cats on page load    |
| GET    | /list?id={uuid}   | Fetch single cat (getCatById) |
| POST   | /create           | Create cat via dialog         |
| PUT    | /update?id={uuid} | Edit cat via dialog           |
| DELETE | /delete?id={uuid} | Delete cat from card          |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI 21: `npm install -g @angular/cli`

### Installation

```bash
# Clone the repository
git clone https://github.com/Varma0313/Cat-Explorer.git
cd Cat-Explorer

# Install dependencies
npm install

# Start development server
ng serve

# Open browser
open http://localhost:4200
```

### Production Build

```bash
ng build --configuration production
```

---

## 🧠 Angular 21 Features Showcase

### Signals

```typescript
// Writable signal
readonly cats = signal<Cat[]>([]);

// Computed signal — auto-updates when cats() changes
readonly totalCats = computed(() => this.cats().length);
readonly filteredCats = computed<Cat[]>(() => {
  const q = this.searchQuery().toLowerCase();
  return this.cats().filter(c => c.name.toLowerCase().includes(q));
});
```

### Signal Inputs/Outputs

```typescript
// input.required — TypeScript error if parent doesn't pass it
readonly cat = input.required<Cat>();

// output — no EventEmitter needed
readonly edit = output<Cat>();
```

### Zoneless Change Detection

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), // No zone.js
    provideHttpClient(withFetch()), // Native Fetch API
  ],
};
```

### New Control Flow

```html
@for (cat of store.filteredCats(); track cat.id) {
<app-cat-card [cat]="cat" (edit)="editCat($event)" />
} @switch (loadingState()) { @case ('loading') { <app-skeleton /> } @case ('error') {
<app-error-state /> } }
```

---

## 👤 Author

**Ravivarma D**

- 📧 ravivarma0513@gmail.com
- 🔗 [github.com/Varma0313](https://github.com/Varma0313)
- 💼 [linkedin.com/in/ravivarma-d-76b191233](https://www.linkedin.com/in/ravivarma-d-76b191233)

---

_Built with ❤️ for the DATAI2I Senior Frontend Developer Assignment — 2026_
