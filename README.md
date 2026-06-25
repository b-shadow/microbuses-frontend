# frontend-admin

Panel administrativo web para SIG Microbuses.

## Stack
- React + TypeScript + Vite
- Tailwind CSS
- React Router
- Leaflet / React-Leaflet

## Variables
Crear `.env` basado en `.env.example`.

Ejemplo:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_ENV=development
```

## Ejecutar
```bash
npm install
npm run dev
```

Si PowerShell bloquea `npm.ps1`:
```bash
npm.cmd run dev
```

## Build
```bash
npm.cmd run build
```
