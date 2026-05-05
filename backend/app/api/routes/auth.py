import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import PyMongoError

from app.api.deps import get_current_user
from app.core.security import create_access_token, hash_password, verify_password
from app.db.mongo import users_collection
from app.schemas.auth import AuthResponse, LoginRequest, SignupRequest, UserResponse

router = APIRouter()


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: SignupRequest):
    try:
        existing = await users_collection().find_one({"email": payload.email.lower()})
    except PyMongoError:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable. Start MongoDB and try again.",
        )
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    try:
        await users_collection().insert_one(
            {
                "_id": user_id,
                "email": payload.email.lower(),
                "name": payload.name,
                "password_hash": hash_password(payload.password),
            }
        )
    except PyMongoError:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable. Start MongoDB and try again.",
        )
    return AuthResponse(access_token=create_access_token(user_id))


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    try:
        user = await users_collection().find_one({"email": payload.email.lower()})
    except PyMongoError:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable. Start MongoDB and try again.",
        )
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return AuthResponse(access_token=create_access_token(user["_id"]))


@router.get("/me", response_model=UserResponse)
async def me(current_user=Depends(get_current_user)):
    return UserResponse(
        id=current_user["_id"], email=current_user["email"], name=current_user["name"]
    )
