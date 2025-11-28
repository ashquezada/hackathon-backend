#!/bin/bash

# Script para probar el envío de email con código QR
# Uso: ./test-email-qr.sh tu-email@example.com

# Color para outputs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que se pasó el email
if [ -z "$1" ]; then
  echo -e "${YELLOW}Uso: ./test-email-qr.sh tu-email@example.com${NC}"
  exit 1
fi

EMAIL=$1
DNI="12345678"

echo -e "${GREEN}📧 Enviando email de prueba con QR...${NC}"
echo -e "Email destino: ${YELLOW}$EMAIL${NC}"
echo -e "DNI para QR: ${YELLOW}$DNI${NC}"
echo ""

# Hacer la petición
curl -X POST http://localhost:3000/api/admin/test-email-qr \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"dni\":\"$DNI\"}" \
  -w "\n\n"

echo -e "\n${GREEN}✅ Petición enviada. Revisa tu bandeja de entrada (y spam).${NC}"
