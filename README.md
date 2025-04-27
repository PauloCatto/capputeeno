
# 🛍️ Capputeeno

Aplicação de e-commerce desenvolvida com **Angular**, baseada no desafio da [Rocketseat](https://www.rocketseat.com.br/).  
Veja o desafio aqui: [https://github.com/Rocketseat/frontend-challenge](https://github.com/Rocketseat/frontend-challenge)  
🔗 **Deploy**: [capputeeno-pearl.vercel.app](https://capputeeno-pearl.vercel.app)  
🎨 **Figma**: [Figma Capputeeno](https://www.figma.com/design/rET9F2CeUEJdiVN7JRu993/E-commerce---capputeeno?node-id=680-6614&t=QihcIt51tg3n8yLX-0)

---

## ✨ Funcionalidades

- ✅ Listagem de produtos (todos, camisetas e canecas)  
- 🌐 Suporte a múltiplos idiomas (`pt`, `en`, `es`) com **ngx-translate**  
- 🛒 Carrinho de compras com:  
  - Persistência no `localStorage`  
  - Gerenciamento de estado com `BehaviorSubject`  
- 📦 Feedback visual com **Angular Material Snackbar**  
- 📱 Layout responsivo e clean  

---

## 🧠 Destaques Técnicos

### 🌍 Internacionalização (i18n)

Utilizamos a biblioteca [`ngx-translate`](https://github.com/ngx-translate/core) com arquivos `.json` em `assets/i18n/`, oferecendo suporte dinâmico aos idiomas **Português**, **Inglês** e **Espanhol**.  
O idioma pode ser alterado diretamente no `HeaderComponent`.

### 📦 Carrinho com `BehaviorSubject`

O carrinho é gerenciado de forma reativa, utilizando `BehaviorSubject` para:

- Emitir mudanças na quantidade total de produtos  
- Compartilhar estado entre componentes (como o header)  
- Atualizar visualmente a aplicação em tempo real  

---

## 🧪 Testes Unitários

O projeto conta com testes unitários utilizando **Jasmine + Karma**.
<br>
A cobertura dos testes unitários foram configuradas para garantir uma cobertura mínima de **80%**. Aqui estão os resultados dos testes até o momento:  

![image](https://github.com/user-attachments/assets/f0371ea9-f370-4f42-9b59-c239317d5659)


---

## 📦 Como Rodar Localmente

```bash
git clone https://github.com/seu-usuario/capputeeno.git
cd capputeeno
npm install
npm install @ngx-translate/core
npm install @ngx-translate/http-loader
npm install @angular/material
npm install @angular/cdk
npm install @angular/animations
ng serve -o

O comando ng serve -o irá abrir o projeto no navegador em http://localhost:4200/.
Certifique-se de que o backend esteja rodando para a aplicação funcionar corretamente.

### Backend (API mockada da Rocketseat)
git clone https://github.com/Rocketseat/frontend-challenge.git
cd frontend-challenge
npm install
npm start

