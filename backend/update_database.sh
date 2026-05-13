#!/bin/bash

# Script para actualizar la base de datos LALAND Football
# Ejecutar desde el directorio backend/

echo "🔄 Actualizando base de datos LALAND Football..."
echo ""

# Verificar si estamos en el directorio correcto
if [ ! -f "laland_football_update.sql" ]; then
    echo "❌ Error: Ejecutar desde el directorio backend/"
    echo "   cd /home/ing-ospino/LALAND FOOTBALL/backend"
    exit 1
fi

# Ejecutar actualización
echo "📝 Ejecutando actualización..."
mysql -u root -p -S /opt/lampp/var/mysql/mysql.sock laland_football < laland_football_update.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Actualización completada exitosamente!"
    echo ""
    echo "🔍 Verificando estado de la base de datos..."
    echo ""
    mysql -u root -p -S /opt/lampp/var/mysql/mysql.sock laland_football < check_database.sql
else
    echo ""
    echo "❌ Error durante la actualización"
    exit 1
fi

echo ""
echo "🎯 Próximos pasos:"
echo "1. Reinicia el backend: npm run dev"
echo "2. Prueba las nuevas funcionalidades"
echo "3. Si necesitas más tablas, dime qué agregar"