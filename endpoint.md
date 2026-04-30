# WhatsApp Bridge Endpoints

This document covers endpoints exposed by the Go WhatsApp bridge service in:

- `c:/Users/Connekt.me/Desktop/ntw/omnichannel-crm/whatsapp-bridge/main.go`

It also includes the related CRM proxy endpoints used by the frontend.

## Bridge Base URL

- Local default: `http://localhost:8090`
- Configured by bridge env var: `PORT`

## Bridge Auth

- If `BRIDGE_API_KEYS` is set in the bridge, send:
  - `Authorization: Bearer <key>`
- Endpoints protected by auth middleware:
  - `/pair`
  - `/send`
  - `/status`
  - `/unpair`
- `/health` is not auth-protected.

## 1) Pair Device

- Method: `POST`
- Path: `/pair`
- Purpose: Start pairing and return a pairing code.

Request body:

```json
{
  "user_id": "123",
  "phone_number": "2348012345678",
  "webhook_url": "http://your-api/api/communication/webhook/whatsmeow/"
}
```

Notes:

- `webhook_url` is optional. If omitted, bridge uses its default `DJANGO_WEBHOOK_URL`.
- `user_id` is used as the logical device key/company key.

Success response (200):

```json
{
  "success": true,
  "code": "ABCD1234"
}
```

Error response (400/500):

```json
{
  "success": false,
  "error": "..."
}
```

## 2) Send Message

- Method: `POST`
- Path: `/send`
- Purpose: Send text/media via an already connected device.

Request body:

```json
{
  "device_id": "123",
  "to": "2348012345678@s.whatsapp.net",
  "text": "Hello",
  "msg_type": "TEXT",
  "media_url": "https://example.com/file.jpg",
  "caption": "Optional caption"
}
```

Field rules:

- `device_id`: required
- `to`: required; can be full JID (`@s.whatsapp.net`, `@lid`) or plain number
- `msg_type`: `TEXT | IMAGE | DOCUMENT | AUDIO | VIDEO`
- For media, include `media_url` (bridge downloads and uploads to WhatsApp)

Success response (200):

```json
{
  "success": true,
  "message_id": "wamid...."
}
```

Error examples:

- `404` device not connected
- `400` invalid JSON/JID
- `413` media too large
- `500` upload/send/download failures

## 3) Unpair Device

- Method: `POST`
- Path: `/unpair`
- Query param: `device_id` (required)
- Purpose: Disconnect client and fully clean up mapping/session records.

Example:

```bash
curl -X POST "http://localhost:8090/unpair?device_id=123" \
  -H "Authorization: Bearer <key>"
```

Success response (200):

```json
{
  "success": true,
  "message": "Device unpaired successfully"
}
```

Error response:

```json
{
  "success": false,
  "error": "device_id required"
}
```

## 4) Connection Status

- Method: `GET`
- Path: `/status`
- Query param: `device_id` (required)
- Purpose: Check whether a mapped device client is currently connected.

Example:

```bash
curl "http://localhost:8090/status?device_id=123" \
  -H "Authorization: Bearer <key>"
```

Connected response (200):

```json
{
  "success": true,
  "connected": true,
  "device_id": "123"
}
```

Not connected response (200):

```json
{
  "success": true,
  "connected": false
}
```

Bad request (400) when `device_id` missing:

```json
{
  "success": false
}
```

## 5) Health Check

- Method: `GET`
- Path: `/health`
- Purpose: Basic liveness and client count.

Response (200):

```json
{
  "status": "ok",
  "clients": 2
}
```

## Inbound Webhook Sent By Bridge

The bridge posts inbound WhatsApp events to Django webhook URL:

- Default target: `DJANGO_WEBHOOK_URL`
- Usually: `POST /api/communication/webhook/whatsmeow/`

Payload shape:

```json
{
  "user_id": "123",
  "from": "2348012345678",
  "from_jid_raw": "2348012345678@lid",
  "from_jid": "2348012345678@s.whatsapp.net",
  "to": "2348099999999",
  "to_jid_raw": "2348099999999@s.whatsapp.net",
  "to_jid": "2348099999999@s.whatsapp.net",
  "group_name": "",
  "text": "hello",
  "content_type": "text",
  "attachment_data": [],
  "message_id": "wamid....",
  "timestamp": 1710000000,
  "is_from_me": false,
  "push_name": "John",
  "is_group": false
}
```

For media, `attachment_data` entries include:

- `file_type`, `file_name`, `file_size`, `mime_type`, `file_content` (base64)

## CRM Proxy Endpoints Used By Frontend

These are not bridge-native; they are Django APIs that call the bridge:

- `POST /api/communication/whatsapp/pair/`
- `GET /api/communication/whatsapp/pair/status/`
- `POST /api/communication/whatsapp/complete-setup/`
- `POST /api/communication/whatsapp/unpair/`

Frontend reference:

- `src/app/components/admin/MainContainer/ConnectWhatsAppModal.jsx`

## Quick cURL Examples

Pair:

```bash
curl -X POST "http://localhost:8090/pair" \
  -H "Authorization: Bearer <key>" \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"123\",\"phone_number\":\"2348012345678\"}"
```

Status:

```bash
curl "http://localhost:8090/status?device_id=123" \
  -H "Authorization: Bearer <key>"
```

Send text:

```bash
curl -X POST "http://localhost:8090/send" \
  -H "Authorization: Bearer <key>" \
  -H "Content-Type: application/json" \
  -d "{\"device_id\":\"123\",\"to\":\"2348012345678@s.whatsapp.net\",\"text\":\"Hello\",\"msg_type\":\"TEXT\"}"
```

Unpair:

```bash
curl -X POST "http://localhost:8090/unpair?device_id=123" \
  -H "Authorization: Bearer <key>"
```

