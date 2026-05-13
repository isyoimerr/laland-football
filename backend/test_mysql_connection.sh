#!/bin/bash

# Script para probar diferentes formas de conectarse a MySQL en XAMPP

echo "🔍 Probando conexiones a MySQL..."

# Método 1: Sin contraseña (XAMPP por defecto)
echo "1. Probando sin contraseña..."
mysql -u root -S /opt/lampp/var/mysql/mysql.sock -e "SELECT 'CONEXION EXITOSA' as resultado;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ ¡Conexión sin contraseña funciona!"
    echo "   Ejecuta: mysql -u root -S /opt/lampp/var/mysql/mysql.sock laland_football"
    exit 0
fi

# Método 2: Con contraseña común
echo "2. Probando contraseñas comunes..."
for pass in "" "root" "admin" "password" "123456" "Admin123!"; do
    echo "   Probando contraseña: '$pass'"
    result=$(mysql -u root -p"$pass" -S /opt/lampp/var/mysql/mysql.sock -e "SELECT 'OK' as status;" 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo "✅ ¡Contraseña encontrada: '$pass'!"
        echo "   Ejecuta: mysql -u root -p'$pass' -S /opt/lampp/var/mysql/mysql.sock laland_football"
        exit 0
    fi
done

echo "❌ No se pudo conectar con métodos comunes"
echo ""
echo "💡 Soluciones:"
echo "1. Verifica que XAMPP esté ejecutándose: sudo /opt/lampp/lampp status"
echo "2. Revisa la contraseña en: /opt/lampp/phpmyadmin/config.inc.php"
echo "3. O resetea la contraseña siguiendo los pasos anteriores"