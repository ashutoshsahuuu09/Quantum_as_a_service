import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pymongo import ReturnDocument

from app.api.deps import get_current_user
from app.db.mongo import projects_collection
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate

router = APIRouter()


def to_project_response(doc: dict) -> ProjectResponse:
    return ProjectResponse(
        id=doc["_id"],
        name=doc["name"],
        description=doc.get("description", ""),
        code=doc.get("code", ""),
        owner_id=doc["owner_id"],
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )


@router.get("", response_model=list[ProjectResponse])
async def list_projects(current_user=Depends(get_current_user)):
    items = []
    async for doc in projects_collection().find({"owner_id": current_user["_id"]}).sort(
        "updated_at", -1
    ):
        items.append(to_project_response(doc))
    return items


@router.post("", response_model=ProjectResponse)
async def create_project(payload: ProjectCreate, current_user=Depends(get_current_user)):
    now = datetime.now(timezone.utc)
    doc = {
        "_id": str(uuid.uuid4()),
        "owner_id": current_user["_id"],
        "name": payload.name,
        "description": payload.description,
        "code": payload.code,
        "created_at": now,
        "updated_at": now,
    }
    await projects_collection().insert_one(doc)
    return to_project_response(doc)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, current_user=Depends(get_current_user)):
    doc = await projects_collection().find_one({"_id": project_id, "owner_id": current_user["_id"]})
    if not doc:
        raise HTTPException(status_code=404, detail="Project not found")
    return to_project_response(doc)


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str, payload: ProjectUpdate, current_user=Depends(get_current_user)
):
    result = await projects_collection().find_one_and_update(
        {"_id": project_id, "owner_id": current_user["_id"]},
        {
            "$set": {
                "name": payload.name,
                "description": payload.description,
                "code": payload.code,
                "updated_at": datetime.now(timezone.utc),
            }
        },
        return_document=ReturnDocument.AFTER,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Project not found")
    return to_project_response(result)


@router.delete("/{project_id}")
async def delete_project(project_id: str, current_user=Depends(get_current_user)):
    result = await projects_collection().delete_one({"_id": project_id, "owner_id": current_user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"deleted": True}
