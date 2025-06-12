// MUI/cache.ts
'use client';

import createEmotionCache from '@emotion/cache';

// Puedes personalizar el "key" si quieres (por defecto suele ser "css")
const cache = createEmotionCache({ key: 'mui' });

export default cache;
