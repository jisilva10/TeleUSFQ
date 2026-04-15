const API_KEY = "AIzaSyBAO3kDdm5D3BYEUrqoCclpZYBKGgXcZt0";

export async function fetchDriveImages(folderId: string): Promise<string[]> {
  console.log(`[Drive] Fetching folder: ${folderId}`);
  try {
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${query}&key=${API_KEY}&fields=files(id,mimeType,name)&pageSize=100`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Drive] Error fetching folder ${folderId}:`, errorText);
      return [];
    }
    
    const data = await response.json();
    const files = data.files || [];
    console.log(`[Drive] Found ${files.length} files in folder ${folderId}`);
    
    // Filter to common image types. If user has weird extensions, we might need to expand this.
    const imageFiles = files.filter((file: any) => 
      file.mimeType.startsWith("image/") || 
      file.name.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i)
    );
    
    console.log(`[Drive] ${imageFiles.length} images recognized in folder ${folderId}`);
    
    return imageFiles.map((file: any) => `https://drive.google.com/uc?export=view&id=${file.id}`);
  } catch (error) {
    console.error("[Drive] Exception during fetch:", error);
    return [];
  }
}
