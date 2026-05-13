#!/bin/bash
# ═══════════════════════════════════════════════════════════════
#  LALAND FOOTBALL — Setup GitHub en 1 paso
#  Corre este script UNA SOLA VEZ para crear el repo y subir todo
#  Uso: bash setup-github.sh
# ═══════════════════════════════════════════════════════════════
set -e

GH_BIN="/tmp/gh_2.50.0_linux_amd64/bin/gh"

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   LALAND FOOTBALL — GitHub Setup         ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# 1) Verificar / descargar gh CLI
if [ ! -f "$GH_BIN" ]; then
  echo "→ Descargando GitHub CLI..."
  curl -sL https://github.com/cli/cli/releases/download/v2.50.0/gh_2.50.0_linux_amd64.tar.gz \
    -o /tmp/gh.tar.gz
  tar -xzf /tmp/gh.tar.gz -C /tmp/
fi
echo "✓ GitHub CLI listo"

# 2) Login (abre el navegador automáticamente)
echo ""
echo "→ Autenticando con GitHub..."
echo "  Se abrirá el navegador. Iniciá sesión con tu cuenta GitHub."
echo ""
$GH_BIN auth login --web --git-protocol https

# 3) Crear repo PÚBLICO en GitHub
echo ""
echo "→ Creando repositorio 'laland-football' en GitHub..."
$GH_BIN repo create laland-football \
  --public \
  --description "Plataforma web de fútbol en tiempo real — estadísticas, live scores, panel admin" \
  --source="/home/ing-ospino/LALAND FOOTBALL" \
  --remote=origin \
  --push

# 4) Subir el tag v0.5.0
cd "/home/ing-ospino/LALAND FOOTBALL"
git push origin v0.5.0

# 5) Crear release en GitHub con notas
$GH_BIN release create v0.5.0 \
  --title "v0.5.0 — Fases 0-5 completas" \
  --notes "## Primera versión estable

### Incluye
- **Fase 0**: Estructura, configuración, base de datos MySQL
- **Fase 1**: Landing page, navegación, componentes UI
- **Fase 2**: Autenticación JWT con roles (user/admin/super_admin)
- **Fase 3**: API REST — equipos, jugadores, ligas, partidos, estadios, técnicos
- **Fase 4**: Panel Admin con 7 managers (teams, players, matches, leagues, stadiums, videos, dashboard)
- **Fase 5**: Páginas de detalle — partido, equipo, jugador, técnico, estadio, competición
- **Fase 5+**: Búsqueda global, Socket.io en tiempo real, estadísticas de jugadores

### Fixes críticos incluidos
- MatchEvent.eventType (field: event_type) — conflicto Sequelize
- Seeder usa event_type correctamente
- Stadiums controller usa image_path
- SearchBar y StadiumDetail con respuesta API correcta
- Competition tabla solo cuenta partidos finished
- MatchDetail incluye nombres de jugadores en eventos" \
  --repo laland-football

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  ✓ LISTO! Repositorio creado y subido    ║"
echo "╚══════════════════════════════════════════╝"
echo ""
$GH_BIN repo view laland-football --web
