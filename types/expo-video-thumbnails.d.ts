declare module 'expo-video-thumbnails' {
  export interface ThumbnailResult {
    uri: string;
  }

  export interface ThumbnailOptions {
    time?: number;
  }

  export default {
    getThumbnailAsync(
      uri: string,
      options?: ThumbnailOptions
    ): Promise<ThumbnailResult>;
  };
}
