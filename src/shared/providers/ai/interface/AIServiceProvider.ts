export interface AIServiceProvider {
  ask(prompt: string): Promise<string | undefined>;
  /*
    * Asks a question about an image.

    * @param prompt The question to ask about the image.
    * @param image The image data in base64 format.
    * @returns The answer to the question about the image.
  */
  askAboutImage(prompt: string, data: AIImageData): Promise<string | undefined>;
}

export interface AIImageData {
  mimeType: string;
  data: string;
}
