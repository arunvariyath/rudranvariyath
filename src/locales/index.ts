import { en, type Translation } from './en';
import { ml } from './ml';

export type LanguageCode = 'en' | 'ml';

export const translations: Record<LanguageCode, Translation> = { en, ml };

export const languageOrder: LanguageCode[] = ['en', 'ml'];

export type { Translation };
export { en, ml };
