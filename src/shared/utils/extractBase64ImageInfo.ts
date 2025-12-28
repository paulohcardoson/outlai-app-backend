export const extractBase64ImageInfo = (uri: string) => {
  let [mimeType, data] = uri.split(";base64,");

  if (!mimeType || !data) {
    throw new Error("Imagem inválida");
  }

  mimeType = mimeType.replace("data:", "");

  if (!mimeType.startsWith("image/")) {
    throw new Error("Imagem inválida");
  }

  return { mimeType, data };
}
