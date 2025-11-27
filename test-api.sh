#!/bin/bash

# Script de pruebas para la API de Turnos

BASE_URL="http://localhost:3000/api"

echo "🧪 Probando API de Turnos"
echo "========================="
echo ""

echo "1️⃣  Crear turno #1"
curl -s -X POST $BASE_URL/turnos \
  -H "Content-Type: application/json" \
  -d '{"cliente":"Juan Pérez","telefono":"555-1234"}' | python3 -m json.tool
echo ""

echo "2️⃣  Crear turno #2"
curl -s -X POST $BASE_URL/turnos \
  -H "Content-Type: application/json" \
  -d '{"cliente":"María García","telefono":"555-5678"}' | python3 -m json.tool
echo ""

echo "3️⃣  Obtener todos los turnos"
curl -s $BASE_URL/turnos | python3 -m json.tool
echo ""

echo "4️⃣  Obtener estadísticas"
curl -s $BASE_URL/admin/estadisticas | python3 -m json.tool
echo ""

echo "5️⃣  Obtener siguiente turno"
curl -s $BASE_URL/turnos/siguiente | python3 -m json.tool
echo ""

echo "✅ Pruebas completadas"
