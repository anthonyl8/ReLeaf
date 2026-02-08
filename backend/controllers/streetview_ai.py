"""
Street View AI controller — endpoint for transforming Street View images with AI greenery.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.streetview_ai import streetview_ai_service

router = APIRouter(prefix="/streetview-ai", tags=["Street View AI"])


class TreePosition(BaseModel):
    species: str
    bearing: float  # Bearing from viewpoint to tree
    distance: float  # Distance in meters
    lat: float
    lng: float


class TransformRequest(BaseModel):
    lat: float
    lng: float
    heading: float = 0  # 0-360, 0=North
    pitch: float = 0  # -90 to 90, 0=horizontal
    fov: float = 90  # Field of view
    trees: list[TreePosition] = []  # Visible planted trees


@router.post("/transform")
async def transform_street_view(request: TransformRequest):
    """
    Transform a Street View image by compositing planted trees at exact coordinates.
    
    Fetches the Street View image at the specified location and viewing angle,
    then uses Gemini AI to add ONLY the specific planted trees at their exact positions.
    
    Returns both the original and transformed images as base64-encoded JPEGs.
    """
    try:
        # Convert trees to dict format
        trees_data = [tree.model_dump() for tree in request.trees] if request.trees else []
        
        result = await streetview_ai_service.transform_street_view(
            lat=request.lat,
            lng=request.lng,
            heading=request.heading,
            pitch=request.pitch,
            fov=request.fov,
            trees=trees_data,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"[StreetViewAI Controller] Error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Street View AI transformation failed: {str(e)}",
        )
