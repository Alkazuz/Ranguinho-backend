
# Ranguinho - Back End

Ranguinho é um pequeno projeto baseado no iFood para delivery de comida.
- Frontend (https://github.com/Alkazuz/Ranguinho-frontend)

## Ferramentas usadas

- Firebase (https://firebase.google.com/)
- Express (https://expressjs.com/)
- node-geohash (https://www.npmjs.com/package/ngeohash)
- Typescript (https://www.typescriptlang.org/)
- Jest (https://jestjs.io/)

## Instalação
- Clone o repositório em algum local do computador.
- Instale as bibliotecas usando
NPM
```bash
    npm install package.json
```
YARN
```bash
    yarn
```
Baixe as configuração do `firebase-admin` dentro das configurações do projeto do firebase e salve como `src/credentials.json`. A configuração é parecida com:
```json
{
  "type": "xxxx_xxxx",
  "project_id": "xxxxx-xxxx",
  "private_key_id": "xxxxxxxxxxxxxxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----xxxx...-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-cteic@xxxxxx-xxxxx.iam.gserviceaccount.com",
  "client_id": "xxxxxxxxxxxxxxxx",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-cteic%40xxxxxx-xxxxx.iam.gserviceaccount.com"
}

```
Agora, basta rodar o projeto o comando `yarn dev` ou `npm dev`
