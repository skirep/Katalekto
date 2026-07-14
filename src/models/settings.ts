export type FontFamily = 'standard' | 'dyslexia';
export type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
export type ColorScheme = 'default' | 'high-contrast' | 'warm' | 'cool';
export type SkinId = 'original' | 'pokemon' | 'pikachu-ash' | 'team-rocket';

export interface AppSettings {
  profileId: string;
  speed: number;
  fontSize: FontSize;
  fontFamily: FontFamily;
  colorScheme: ColorScheme;
  skin: SkinId;
  dyslexiaMode: boolean;
  timeBetweenWords: number;
  fullscreen: boolean;
}

export const DEFAULT_SETTINGS: Omit<AppSettings, 'profileId'> = {
  speed: 2,
  fontSize: 'large',
  fontFamily: 'standard',
  colorScheme: 'default',
  skin: 'original',
  dyslexiaMode: false,
  timeBetweenWords: 0,
  fullscreen: false,
};
