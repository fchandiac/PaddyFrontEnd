This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Pruebas E2E

Este proyecto incluye pruebas E2E utilizando WebdriverIO. Puedes ejecutar las pruebas y visualizarlas en tu navegador.

### Ejecutar pruebas E2E visuales

Para ejecutar las pruebas E2E y ver Chrome en acción:

```bash
# Ejecutar todas las pruebas
./run-visual-e2e.sh

# Ejecutar en modo lento para mejor visualización
./run-visual-e2e.sh --slow

# Ejecutar solo pruebas de autenticación
./run-visual-e2e.sh --auth
```

### Grabar videos de las pruebas

Puedes grabar videos de las pruebas para documentación o revisión:

#### En cualquier sistema (requiere ffmpeg)

```bash
# Grabar todas las pruebas
./record-e2e-tests.sh

# Grabar en modo lento
./record-e2e-tests.sh --slow

# Grabar solo pruebas de autenticación
./record-e2e-tests.sh --auth
```

#### En macOS (usando la grabación nativa)

```bash
./record-macos-e2e.sh
```

#### En Windows (usando Xbox Game Bar)

```powershell
.\record-windows-e2e.ps1
```

Para más información, consulta la documentación:
- [Pruebas E2E visuales](./docs/testing/e2e-visual-testing.md)
- [Grabación de videos de pruebas](./docs/testing/e2e-video-recording.md)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
