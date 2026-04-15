const API_KEY = "AIzaSyBAO3kDdm5D3BYEUrqoCclpZYBKGgXcZt0";

export async function fetchDriveImages(folderId: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${API_KEY}&fields=files(id,mimeType,name)`
    );
    if (!response.ok) {
      console.error("Failed to fetch folder", folderId, await response.text());
      return [];
    }
    const data = await response.json();
    const files = data.files || [];
    
    // Filter out non-image files if needed, and map to Drive universal view URL
    return files
      .filter((file: any) => file.mimeType.startsWith("image/"))
      .map((file: any) => `https://drive.google.com/uc?export=view&id=${file.id}`);
  } catch (error) {
    console.error("Error fetching drive images", error);
    return [];
  }
}
