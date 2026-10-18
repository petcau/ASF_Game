# Abelhas Nativas: Meliponicultura

Protótipo v0.0 do simulador de manejo de abelhas nativas sem ferrão.

## Rodar no navegador

```bash
npm install
npm run dev
```

O Vite mostra o endereço local e o endereço da rede. Para testar no celular durante o desenvolvimento, conecte o aparelho à mesma rede Wi-Fi e abra o endereço de rede.

## Gerar a versão web

```bash
npm run build
npm run preview
```

## Android

Com Android Studio e o Android SDK instalados:

```bash
npm run build
npx cap add android
npm run cap:android
```

Depois da primeira criação da plataforma, use `npm run cap:sync` após mudanças no jogo.

## iOS

A compilação exige macOS com Xcode. No Mac:

```bash
npm run build
npx cap add ios --packagemanager SPM
npm run cap:ios
```

## Relógio e save

- Um dia do jogo equivale a 6 minutos jogados.
- O tempo não avança com a aba oculta ou o aplicativo fora de foco.
- O save é local, automático e versionado.

