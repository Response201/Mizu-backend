



# Mizu-backend    


Mizu-backend är en serverapplikation byggd med Node.js och Express för att stödja ett webbaserat system som hanterar autentisering, betalningar och användarhantering. Projektet är designat för att integreras med en frontend-applikation och använder MongoDB för datalagring. Applikationen stödjer även schemalagda uppgifter via node-cron och har betalningshantering via Stripe.


 [![Mizu-backend](https://img.shields.io/badge/Mizu-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Response201/Mizu-backend)






## 🚀 Kom igång   







#### Klona projektet




```bash
  git clone https://github.com/Response201/Mizu-backend 

```

#### Gå till projektmappen och installera beroenden

```bash
  npm install
```

#### Starta projektet

```bash
  npm run dev
```





##  ⚙ Beroenden 


#### ⚡ Grundläggande bibliotek
- express: ^4.21.2 
- dotenv: ^16.4.7
- mongoose: ^8.8.4 
- bcrypt: ^5.1.1 
- jsonwebtoken: ^9.0.2 
- node-cron: ^3.0.3 
- cors: ^2.8.5 
- stripe: ^17.4.0 
- nodemon: ^3.1.7 






## 🗂️ Kodstruktur
 #### mizu-backend/

**├─ controllers/**         *Hanterar funktioner som cart, betalningar, användarhantering, receips* 

**├─ cronJobs/**  *Schemalagda funktioner för att rensa utgångna varukorgar och tokens* 


**├─ functions/**   *Automatiska uppgifter, t.ex. seedProducts*


**├─ middwares/**    *Funktioner som bearbetar förfrågningar innan de når huvudlogiken*         

**├─ models/**  *Mongoose-models*          


**├─ server.js**       *Huvudfilen för att starta Express-servern och hantera API-anrop.*





 











