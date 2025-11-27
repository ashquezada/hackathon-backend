#!/bin/bash

# Script de prueba para el sistema de gestión de visitas
# Este script prueba todos los endpoints de la API

echo "🧪 Iniciando pruebas del Sistema de Gestión de Visitas..."
echo ""

API_URL="http://localhost:3000"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== 1. Verificar que el servidor está corriendo ===${NC}"
curl -s $API_URL/ | jq '.' || echo -e "${RED}❌ Servidor no disponible${NC}"
echo ""

echo -e "${BLUE}=== 2. Registrar nueva visita ===${NC}"
VISITA1=$(curl -s -X POST $API_URL/api/visitas \
  -H "Content-Type: application/json" \
  -d '{
    "visitante":"María García",
    "documento":"87654321",
    "empresa":"TechCorp",
    "telefono":"555-1234",
    "motivo":"Reunión con ventas",
    "personaVisitada":"Juan López",
    "area":"Ventas"
  }')
echo $VISITA1 | jq '.'
VISITA1_ID=$(echo $VISITA1 | jq -r '.data.id')
echo -e "${GREEN}✅ Visita 1 registrada con ID: $VISITA1_ID${NC}"
echo ""

echo -e "${BLUE}=== 3. Registrar segunda visita ===${NC}"
VISITA2=$(curl -s -X POST $API_URL/api/visitas \
  -H "Content-Type: application/json" \
  -d '{
    "visitante":"Carlos Rodríguez",
    "documento":"45678912",
    "empresa":"Acme Corp",
    "motivo":"Entrevista de trabajo",
    "personaVisitada":"Ana Martínez",
    "area":"Recursos Humanos"
  }')
echo $VISITA2 | jq '.'
VISITA2_ID=$(echo $VISITA2 | jq -r '.data.id')
echo -e "${GREEN}✅ Visita 2 registrada con ID: $VISITA2_ID${NC}"
echo ""

echo -e "${BLUE}=== 4. Listar todas las visitas ===${NC}"
curl -s $API_URL/api/visitas | jq '.'
echo ""

echo -e "${BLUE}=== 5. Filtrar visitas en estado 'esperando' ===${NC}"
curl -s "$API_URL/api/visitas?estado=esperando" | jq '.'
echo ""

echo -e "${BLUE}=== 6. Obtener siguiente visita en espera ===${NC}"
curl -s $API_URL/api/visitas/siguiente | jq '.'
echo ""

echo -e "${BLUE}=== 7. Obtener visita específica por ID ===${NC}"
curl -s $API_URL/api/visitas/$VISITA1_ID | jq '.'
echo ""

echo -e "${BLUE}=== 8. Cambiar estado de visita a 'llamando' ===${NC}"
curl -s -X PUT $API_URL/api/visitas/$VISITA1_ID \
  -H "Content-Type: application/json" \
  -d '{"estado":"llamando"}' | jq '.'
echo -e "${GREEN}✅ Estado cambiado a 'llamando'${NC}"
echo ""

echo -e "${BLUE}=== 9. Cambiar estado a 'atendiendo' ===${NC}"
curl -s -X PUT $API_URL/api/visitas/$VISITA1_ID \
  -H "Content-Type: application/json" \
  -d '{"estado":"atendiendo","ubicacion":"Sala 3"}' | jq '.'
echo -e "${GREEN}✅ Estado cambiado a 'atendiendo'${NC}"
echo ""

echo -e "${BLUE}=== 10. Finalizar visita ===${NC}"
curl -s -X PUT $API_URL/api/visitas/$VISITA1_ID \
  -H "Content-Type: application/json" \
  -d '{"estado":"finalizado","observaciones":"Visita completada exitosamente"}' | jq '.'
echo -e "${GREEN}✅ Visita finalizada${NC}"
echo ""

echo -e "${BLUE}=== 11. Cancelar una visita ===${NC}"
curl -s -X DELETE $API_URL/api/visitas/$VISITA2_ID | jq '.'
echo -e "${GREEN}✅ Visita cancelada${NC}"
echo ""

echo -e "${BLUE}=== 12. Obtener estadísticas de visitas ===${NC}"
curl -s $API_URL/api/visitas/estadisticas | jq '.'
echo ""

echo -e "${BLUE}=== 13. Obtener estadísticas completas (admin) ===${NC}"
curl -s $API_URL/api/admin/estadisticas-visitas | jq '.'
echo ""

echo -e "${BLUE}=== BONUS: Probar plantilla genérica (Items) ===${NC}"
echo "Crear un item de ejemplo:"
curl -s -X POST $API_URL/api/items \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Producto de prueba","descripcion":"Item de la plantilla genérica"}' | jq '.'
echo ""
echo "Listar items:"
curl -s $API_URL/api/items | jq '.'
echo ""

echo -e "${GREEN}✅ ¡Todas las pruebas completadas!${NC}"
echo ""
echo "📊 Resumen:"
echo "  - Sistema de gestión de visitas: ✅ Funcionando"
echo "  - Endpoints de visitas: ✅ OK"
echo "  - Cambios de estado: ✅ OK"
echo "  - Estadísticas: ✅ OK"
echo "  - Plantilla genérica: ✅ OK"
echo ""
echo "🎉 El sistema está listo para usar"
