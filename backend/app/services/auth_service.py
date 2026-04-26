from app.schemas.auth import LoginRequest, RegisterRequest, AuthResponse

def login_user(req: LoginRequest) -> AuthResponse:
    # Extremely simple mock authentication
    return AuthResponse(
        message="Login successful",
        email=req.email,
        token="mock-jwt-token"
    )

def register_user(req: RegisterRequest) -> AuthResponse:
    return AuthResponse(
        message="Registration successful",
        email=req.email,
        token="mock-jwt-token-new"
    )
