"""
Street View AI Transformation Service.
Fetches a Street View image and uses Gemini to add greenery.
"""

import base64
import httpx
from io import BytesIO
from PIL import Image
from google import genai
from google.genai import types
from core.config import settings


class StreetViewAIService:
    """Service for transforming Street View images with AI-generated greenery."""

    def __init__(self):
        if settings.GEMINI_API_KEY:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        else:
            self.client = None

    async def transform_street_view(
        self, lat: float, lng: float, heading: float, pitch: float, fov: float = 90, trees: list = None
    ) -> dict:
        """
        Fetch a Street View image and composite planted trees at exact coordinates.

        Args:
            lat: Latitude of viewpoint
            lng: Longitude of viewpoint
            heading: Camera heading (0-360°, 0=North)
            pitch: Camera pitch (-90 to 90, 0=horizontal)
            fov: Field of view (default 90°)
            trees: List of planted trees with position and species

        Returns:
            dict with 'original_image' and 'transformed_image' as base64 strings
        """
        if not self.client:
            raise ValueError("Gemini API key not configured")

        if not settings.GOOGLE_MAPS_API_KEY:
            raise ValueError("Google Maps API key not configured")

        # Fetch Street View Static image
        try:
            street_view_url = (
                f"https://maps.googleapis.com/maps/api/streetview"
                f"?size=800x600"
                f"&location={lat},{lng}"
                f"&heading={heading}"
                f"&pitch={pitch}"
                f"&fov={fov}"
                f"&key={settings.GOOGLE_MAPS_API_KEY}"
            )

            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.get(street_view_url)
                response.raise_for_status()
                original_image_bytes = response.content

            # Convert to PIL Image
            original_image = Image.open(BytesIO(original_image_bytes))

            # Convert to base64 for response
            original_b64 = self._image_to_base64(original_image)

            # Only transform if there are trees to add
            if trees and len(trees) > 0:
                transformed_b64 = await self._transform_with_gemini(original_image, trees, lat, lng, heading)
            else:
                # No trees - return original image
                transformed_b64 = original_b64

            return {
                "original_image": original_b64,
                "transformed_image": transformed_b64,
                "location": {"lat": lat, "lng": lng, "heading": heading, "pitch": pitch},
                "trees_added": len(trees) if trees else 0,
            }

        except Exception as e:
            print(f"[StreetViewAI] Error: {e}")
            raise

    async def _transform_with_gemini(self, image: Image.Image, trees: list, viewpoint_lat: float, viewpoint_lng: float, heading: float) -> str:
        """Composite specific planted trees into the street view image at exact positions."""
        
        # Convert PIL Image to bytes
        img_buffer = BytesIO()
        image.save(img_buffer, format="JPEG", quality=95)
        img_bytes = img_buffer.getvalue()

        # Build precise prompt based on exact tree positions
        tree_descriptions = []
        for i, tree in enumerate(trees, 1):
            species = tree.get("species", "maple").title()
            bearing = tree.get("bearing", 0)
            distance = tree.get("distance", 0)
            
            # Convert bearing relative to heading to position in frame
            relative_bearing = (bearing - heading + 360) % 360
            if relative_bearing > 180:
                relative_bearing -= 360
            
            # Determine position description
            if relative_bearing < -60:
                position = "far left edge"
            elif relative_bearing < -20:
                position = "left side"
            elif relative_bearing < 20:
                position = "center"
            elif relative_bearing < 60:
                position = "right side"
            else:
                position = "far right edge"
            
            # Determine size based on distance
            if distance < 10:
                size_desc = "very close (large, prominent)"
            elif distance < 25:
                size_desc = "close (medium size)"
            else:
                size_desc = "distant (smaller)"
            
            tree_descriptions.append(
                f"Tree {i}: {species} tree positioned in the {position} of the frame, {size_desc}, approximately {distance:.0f}m away"
            )

        trees_text = "\n".join(tree_descriptions)
        
        prompt = f"""Add ONLY the following specific tree(s) to this street view image, keeping everything else EXACTLY identical:

{trees_text}

CRITICAL INSTRUCTIONS:
1. Add ONLY these {len(trees)} tree(s) - nothing else
2. Place each tree at the EXACT position specified (bearing and distance)
3. Keep ALL buildings, roads, cars, people, signs, and other elements COMPLETELY unchanged
4. Match the existing lighting, shadows, and perspective perfectly
5. Make the trees look naturally integrated but clearly visible
6. Use realistic {trees[0].get('species', 'maple')} tree appearance for the species specified
7. Do NOT add any other vegetation, modifications, or enhancements
8. The tree should look like it's actually planted there (on sidewalk, grass, etc.)

This is a precise visualization of ONLY the planted intervention(s) - not a general transformation."""

        try:
            response = self.client.models.generate_image(
                model="gemini-2.0-flash-exp-image-generation",
                prompt=prompt,
                reference_images=[types.Image.from_bytes(img_bytes)],
            )

            if response.images and len(response.images) > 0:
                generated_image = response.images[0]
                # Convert to base64
                return base64.b64encode(generated_image.image.data).decode("utf-8")
            else:
                raise ValueError("No image generated by Gemini")

        except Exception as e:
            print(f"[StreetViewAI] Gemini transformation failed: {e}")
            raise

    def _image_to_base64(self, image: Image.Image) -> str:
        """Convert PIL Image to base64 string."""
        buffer = BytesIO()
        image.save(buffer, format="JPEG", quality=95)
        return base64.b64encode(buffer.getvalue()).decode("utf-8")


# Singleton instance
streetview_ai_service = StreetViewAIService()
