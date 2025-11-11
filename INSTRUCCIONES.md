# 🗳️ Sistema de Votación Escolar

Sistema completo de votación en tiempo real con React, Express y Supabase.

## ✨ Características

- ✅ Votación en tiempo real con límite de 25 segundos
- ✅ Panel de administración protegido
- ✅ Gráficos y estadísticas en vivo
- ✅ Exportación a CSV
- ✅ Diseño responsive y moderno
- ✅ Base de datos en la nube (Supabase)
- ✅ CRUD completo de partidos políticos

## 🚀 Instalación Rápida

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd sistema-votacion-escolar
```

### 2. Instalar dependencias
```bash
npm run install-all
```

### 3. Configurar Supabase

1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear un nuevo proyecto
3. Ejecutar el SQL de configuración (ver `SUPABASE_SETUP.sql`)
4. Obtener las credenciales

### 4. Configurar variables de entorno

**Backend** (`server/.env`):
```env
SUPABASE_URL=tu_url
SUPABASE_ANON_KEY=tu_key
PORT=3001
```

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_ANON_KEY=tu_key
```

### 5. Iniciar la aplicación
```bash
npm run dev
```

O por separado:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend  
npm run client
```

## 📁 Estructura del Proyecto
```
sistema-votacion-escolar/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── api/              # Conexión con API
│   │   ├── components/       # Componentes React
│   │   ├── pages/            # Páginas de la app
│   │   └── App.jsx
│   └── package.json
├── server/                    # Backend Express
│   ├── middleware/           # Middlewares
│   ├── index.js             # Servidor principal
│   └── package.json
├── package.json              # Scripts globales
└── README.md
```

## 🔐 Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Contraseña Admin**: `admin2024`

## 📡 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Estado del servidor |
| GET | `/api/parties` | Obtener todos los partidos |
| GET | `/api/parties/:id` | Obtener un partido |
| POST | `/api/parties` | Crear partido |
| PUT | `/api/parties/:id` | Actualizar partido |
| DELETE | `/api/parties/:id` | Eliminar partido |
| POST | `/api/vote/:id` | Registrar voto |
| POST | `/api/parties/:id/reset` | Resetear votos |
| GET | `/api/stats` | Obtener estadísticas |

## 🛠️ Tecnologías

### Frontend
- React 19
- Vite
- TailwindCSS
- React Router
- TanStack Query
- Recharts
- Framer Motion
- Lucide Icons

### Backend
- Node.js
- Express
- Supabase
- dotenv

## 📝 Licencia

ISC

## 👨‍💻 Autor

EDISSON RONALD PARICAHUA CALLA
