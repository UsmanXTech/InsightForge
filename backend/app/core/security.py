import base64
import hashlib
import hmac
import json
import time

from app.core.config import settings


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def _b64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def create_access_token(email: str) -> str:
    payload = {
        "sub": email,
        "exp": int(time.time()) + (settings.TOKEN_EXPIRE_HOURS * 3600),
    }
    payload_encoded = _b64url_encode(
        json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    )
    signature = hmac.new(
        settings.SECRET_KEY.encode("utf-8"),
        payload_encoded.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return f"{payload_encoded}.{_b64url_encode(signature)}"


def verify_access_token(token: str) -> str | None:
    try:
        payload_encoded, signature_encoded = token.split(".", 1)
        expected_signature = hmac.new(
            settings.SECRET_KEY.encode("utf-8"),
            payload_encoded.encode("utf-8"),
            hashlib.sha256,
        ).digest()
        provided_signature = _b64url_decode(signature_encoded)
        if not hmac.compare_digest(expected_signature, provided_signature):
            return None

        payload = json.loads(_b64url_decode(payload_encoded))
        if int(payload.get("exp", 0)) < int(time.time()):
            return None
        return payload.get("sub")
    except Exception:
        return None
