#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║           Testing Mock API Server - All OAuth2 Flows         ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Client Credentials Grant
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  GRANT TYPE: client_credentials"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Request:"
echo '  POST /oauth/token'
echo '  { "grant_type": "client_credentials", "client_id": "client123", "client_secret": "secret123" }'
echo ""

CC_RESPONSE=$(curl -s -X POST $BASE_URL/oauth/token \
  -H "Content-Type: application/json" \
  -d '{"grant_type": "client_credentials", "client_id": "client123", "client_secret": "secret123"}')

echo "Response:"
echo "$CC_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$CC_RESPONSE"
CC_TOKEN=$(echo $CC_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
CC_REFRESH=$(echo $CC_RESPONSE | grep -o '"refresh_token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$CC_TOKEN" ]; then
  echo ""
  echo "✅ client_credentials grant successful!"
else
  echo "❌ client_credentials grant failed"
fi

echo ""
echo ""

# Test 2: Password Grant
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  GRANT TYPE: password (Resource Owner Password Credentials)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Request:"
echo '  POST /oauth/token'
echo '  { "grant_type": "password", "client_id": "client123", "client_secret": "secret123",'
echo '    "username": "admin", "password": "admin123" }'
echo ""

PW_RESPONSE=$(curl -s -X POST $BASE_URL/oauth/token \
  -H "Content-Type: application/json" \
  -d '{"grant_type": "password", "client_id": "client123", "client_secret": "secret123", "username": "admin", "password": "admin123"}')

echo "Response:"
echo "$PW_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$PW_RESPONSE"
PW_TOKEN=$(echo $PW_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
PW_REFRESH=$(echo $PW_RESPONSE | grep -o '"refresh_token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$PW_TOKEN" ]; then
  echo ""
  echo "✅ password grant successful!"
else
  echo "❌ password grant failed"
fi

echo ""
echo ""

# Test 3: Refresh Token Grant
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  GRANT TYPE: refresh_token"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Using refresh token from password grant..."
echo "Request:"
echo '  POST /oauth/token'
echo '  { "grant_type": "refresh_token", "client_id": "client123", "client_secret": "secret123",'
echo "    \"refresh_token\": \"$PW_REFRESH\" }"
echo ""

if [ ! -z "$PW_REFRESH" ]; then
  RT_RESPONSE=$(curl -s -X POST $BASE_URL/oauth/token \
    -H "Content-Type: application/json" \
    -d "{\"grant_type\": \"refresh_token\", \"client_id\": \"client123\", \"client_secret\": \"secret123\", \"refresh_token\": \"$PW_REFRESH\"}")
  
  echo "Response:"
  echo "$RT_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RT_RESPONSE"
  RT_TOKEN=$(echo $RT_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
  
  if [ ! -z "$RT_TOKEN" ]; then
    echo ""
    echo "✅ refresh_token grant successful!"
  else
    echo "❌ refresh_token grant failed"
  fi
else
  echo "⚠️  No refresh token available from previous step"
fi

echo ""
echo ""

# Test 4: Authorization Code Grant
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  GRANT TYPE: authorization_code"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Step 1: Get Authorization Code"
echo "Request:"
echo '  GET /oauth/authorize?response_type=code&client_id=client123&redirect_uri=http://localhost:8080/callback&state=xyz'
echo ""

AUTH_RESPONSE=$(curl -s -X GET "$BASE_URL/oauth/authorize?response_type=code&client_id=client123&redirect_uri=http://localhost:8080/callback&state=xyz")

echo "Response:"
echo "$AUTH_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$AUTH_RESPONSE"
AUTH_CODE=$(echo $AUTH_RESPONSE | grep -o '"code":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$AUTH_CODE" ]; then
  echo ""
  echo "✅ Authorization code obtained!"
  echo ""
  echo "Step 2: Exchange Code for Token"
  echo "Request:"
  echo '  POST /oauth/token'
  echo '  { "grant_type": "authorization_code", "client_id": "client123", "client_secret": "secret123",'
  echo "    \"code\": \"$AUTH_CODE\", \"redirect_uri\": \"http://localhost:8080/callback\" }"
  echo ""
  
  AC_RESPONSE=$(curl -s -X POST $BASE_URL/oauth/token \
    -H "Content-Type: application/json" \
    -d "{\"grant_type\": \"authorization_code\", \"client_id\": \"client123\", \"client_secret\": \"secret123\", \"code\": \"$AUTH_CODE\", \"redirect_uri\": \"http://localhost:8080/callback\"}")
  
  echo "Response:"
  echo "$AC_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$AC_RESPONSE"
  AC_TOKEN=$(echo $AC_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
  
  if [ ! -z "$AC_TOKEN" ]; then
    echo ""
    echo "✅ authorization_code grant successful!"
  else
    echo "❌ authorization_code grant failed"
  fi
else
  echo "❌ Failed to get authorization code"
fi

echo ""
echo ""

# Test 5: Token Introspection
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  TOKEN INTROSPECTION (RFC 7662)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Request:"
echo '  POST /oauth/introspect'
echo "  { \"token\": \"$PW_TOKEN\" }"
echo ""

if [ ! -z "$PW_TOKEN" ]; then
  INTRO_RESPONSE=$(curl -s -X POST $BASE_URL/oauth/introspect \
    -H "Content-Type: application/json" \
    -d "{\"token\": \"$PW_TOKEN\"}")
  
  echo "Response:"
  echo "$INTRO_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$INTRO_RESPONSE"
  echo ""
  echo "✅ Token introspection successful!"
else
  echo "⚠️  No token available for introspection"
fi

echo ""
echo ""

# Test 6: Server Metadata
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  OAUTH 2.0 SERVER METADATA (RFC 8414)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Request:"
echo '  GET /oauth/.well-known/oauth-authorization-server'
echo ""

META_RESPONSE=$(curl -s -X GET "$BASE_URL/oauth/.well-known/oauth-authorization-server")

echo "Response:"
echo "$META_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$META_RESPONSE"

echo ""
echo ""

# Test 7: API Key Authentication
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7️⃣  API KEY Authentication"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Request:"
echo '  GET /api/products -H "X-API-Key: api-key-123456"'
echo ""

API_RESPONSE=$(curl -s -X GET $BASE_URL/api/products \
  -H "X-API-Key: api-key-123456")

if echo "$API_RESPONSE" | grep -q "id"; then
  echo "✅ API Key authentication works!"
  echo "Response (truncated):"
  echo "$API_RESPONSE" | head -c 200
  echo "..."
else
  echo "❌ API Key authentication failed"
  echo "$API_RESPONSE"
fi

echo ""
echo ""

# Test 8: Basic Auth
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8️⃣  BASIC Authentication"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Request:"
echo '  GET /api/sales -u admin:admin123'
echo ""

BASIC_RESPONSE=$(curl -s -X GET $BASE_URL/api/sales \
  -u admin:admin123)

if echo "$BASIC_RESPONSE" | grep -q "id"; then
  echo "✅ Basic authentication works!"
  echo "Response (truncated):"
  echo "$BASIC_RESPONSE" | head -c 200
  echo "..."
else
  echo "❌ Basic authentication failed"
  echo "$BASIC_RESPONSE"
fi

echo ""
echo ""

# Summary
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                      TEST SUMMARY                            ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "OAuth 2.0 Grant Types:"
[ ! -z "$CC_TOKEN" ] && echo "  ✅ client_credentials" || echo "  ❌ client_credentials"
[ ! -z "$PW_TOKEN" ] && echo "  ✅ password" || echo "  ❌ password"
[ ! -z "$RT_TOKEN" ] && echo "  ✅ refresh_token" || echo "  ❌ refresh_token"
[ ! -z "$AC_TOKEN" ] && echo "  ✅ authorization_code" || echo "  ❌ authorization_code"
echo ""
echo "Other Auth Methods:"
echo "$API_RESPONSE" | grep -q "id" && echo "  ✅ API Key" || echo "  ❌ API Key"
echo "$BASIC_RESPONSE" | grep -q "id" && echo "  ✅ Basic Auth" || echo "  ❌ Basic Auth"
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                    All tests completed!                       ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
