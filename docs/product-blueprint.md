# Product Blueprint

## 1. Model operational

Platforma opereaza ca un sistem multi-tenant cu separare stricta per salon:

- `admin`: gestioneaza formulare, interpretari, seturi de raspunsuri, saloane, impersonare
- `salon-manager`: admin local, vede doar datele tenantului sau
- `professional`: distribuie intake-uri, interpreteaza rezultate, mentine planul de tratament
- `client`: completeaza formulare si primeste confirmari / programare

## 2. Colectii Mongo propuse

- `users`
- `salons`
- `questionnaireTemplates`
- `clientProfiles`
- `questionnaireResponses`
- `treatmentPlans`

## 3. Entitati cheie

### Client profile

Se creeaza la primul raspuns si ramane sursa de adevar pentru:

- date personale
- evaluari succesive
- tipologie Baumann
- istoric tratamente
- planuri active
- follow-up si recomandari

### Questionnaire template

Trebuie sa permita:

- versiuni multiple
- surse documentare
- banci de intrebari
- seturi de raspunsuri si punctaje
- reguli de interpretare separate pentru client si profesionist

## 4. Flux principal

1. Adminul configureaza formularele din documentele sursa.
2. Salonul invita profesionistii.
3. Profesionistul trimite linkul de chestionar catre client.
4. Clientul completeaza date personale + raspunsuri.
5. Serverul calculeaza scorul si interpretarea.
6. Se deschide sau actualizeaza fisa clientului.
7. Clientul primeste email cu confirmare si propunere de debriefing.
8. Profesionistul continua urmarirea prin plan de tratamente si timeline.

## 5. Documente sursa si codificare

Stratul `source` trebuie tratat ca sistem editorial, nu ca fisiere pasive.

De aceea MVP-ul include:

- indexare automata a documentelor
- clasificare pe `questionnaire`, `interpretation`, `tipology`, `consent`
- atasare de `sourceRefs` pe fiecare formular codificat

## 6. Incrementi urmatori recomandati

- codificare integrala pentru `psoriasis-screening`
- introducerea bancii de intrebari pentru `lifestyle-insight`
- transformarea fiselor de consimtamant in formulare semnabile
- autentificare si RBAC real
- upload documente si atasamente media in fisa clientului
- motor de email transactional real
- audit log pentru impersonare admin

## 7. PWA si migrare spre mobile

Pentru a pastra viteza de migrare spre mobile app, separarea trebuie mentinuta astfel:

- `lib/` contine logica de scoring, interpretare, push orchestration si modele de date
- `app/` contine doar experienta web si route handlers
- push subscriptions raman o resursa backend, nu logica embeduita in UI
- notificarile trebuie gandite pe `event types`: intake completat, follow-up, reminder programare, plan actualizat
- viitorul client mobil poate consuma aceleasi API-uri si aceleasi payload-uri de notificare

Faza actuala include:

- manifest PWA
- service worker cu caching de app shell si pagina offline
- instalare pe device
- subscribe Web Push pe baza de VAPID
- persistenta subscripțiilor in Mongo, cand baza este configurata
