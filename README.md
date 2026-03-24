# Insight Beauty

Aplicatie fullstack JS orientata catre beauty / health, gandita ca platforma multi-tenant pentru:

- admini
- saloane
- profesionisti
- clienti

In acest prim increment exista deja:

- un shell Next.js pentru frontend + API routes
- structura Mongo prin Mongoose
- motor configurabil de formulare si scoruri
- fundatie PWA cu manifest, service worker si ecrane offline
- suport Web Push pe VAPID, cu API de subscribe/test
- flux public de intake pentru `Fitzpatrick` si `Acne Severity`
- evaluator profesional pentru `Baumann 16-Type`
- parser pentru documentele din `source`
- dashboard-uri separate pentru admin si salon

## Stack

- `Next.js`
- `React`
- `MongoDB` prin `Mongoose`
- `Web Push` prin `web-push`
- CSS custom, fara dependinte vizuale externe

## Structura

- [app](/Users/irinelnicoara/Work/beautyapp/app)
- [components](/Users/irinelnicoara/Work/beautyapp/components)
- [lib](/Users/irinelnicoara/Work/beautyapp/lib)
- [scripts](/Users/irinelnicoara/Work/beautyapp/scripts)
- [source](/Users/irinelnicoara/Work/beautyapp/source)
- [docs/product-blueprint.md](/Users/irinelnicoara/Work/beautyapp/docs/product-blueprint.md)

## Pornire

1. Instaleaza dependintele:

```bash
npm install
```

2. Genereaza manifestul documentelor sursa:

```bash
npm run extract-source
```

3. Ruleaza validarea logica locala:

```bash
npm run validate
```

4. Configureaza Mongo:

```bash
cp .env.example .env
```

5. Ruleaza seed-ul initial:

```bash
npm run seed
```

6. Porneste aplicatia:

```bash
npm run dev
```

7. Genereaza cheile VAPID pentru push:

```bash
npm run push:keys
```

Adauga apoi valorile generate in `.env`.

## Ce este activ acum

- `fitzpatrick-screening`: complet modelat si expus catre client
- `acne-severity`: complet modelat si expus catre client asistat
- `baumann-profile`: complet modelat pentru profesionisti
- `psoriasis-screening`: document sursa indexat, codificare integrala urmatorul increment
- `lifestyle-insight`: interpretarile exista, lipseste banca de intrebari in sursa
- `consent-library`: documente indexate pentru transformare in formulare semnabile

## PWA si mobile readiness

- manifest PWA in [app/manifest.js](/Users/irinelnicoara/Work/beautyapp/app/manifest.js)
- service worker in [public/sw.js](/Users/irinelnicoara/Work/beautyapp/public/sw.js)
- control client pentru instalare si push in [components/pwa-foundation.js](/Users/irinelnicoara/Work/beautyapp/components/pwa-foundation.js)
- API push in [app/api/push/subscribe/route.js](/Users/irinelnicoara/Work/beautyapp/app/api/push/subscribe/route.js) si [app/api/push/test/route.js](/Users/irinelnicoara/Work/beautyapp/app/api/push/test/route.js)
- helper server-side in [lib/push-notifications.js](/Users/irinelnicoara/Work/beautyapp/lib/push-notifications.js)

## Observatii

- Runtime-ul nu mai are fallback demo. Daca `MONGODB_URI` lipseste sau seed-ul nu a fost rulat, zonele operationale se blocheaza explicit.
- Daca lipsesc cheile VAPID, instalarea PWA functioneaza, dar canalul push ramane inactiv.
- Scriptul de indexare foloseste `textutil`, deci presupune macOS pentru extragerea `.doc/.docx`.
- Seed-ul initial creeaza conturi reale:
  - `admin@insightbeauty.local` / `InsightAdmin123`
  - `manager.bucuresti@insightbeauty.local` / `InsightManager123`
  - `manager.cluj.napoca@insightbeauty.local` / `InsightManager123`
  - `elena.stoica@insightbeauty.local` / `InsightPro123`
  - `mara.ionescu@insightbeauty.local` / `InsightPro123`
  - `andreea.voda@insightbeauty.local` / `InsightPro123`
