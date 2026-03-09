
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
- 💸 Integração de Pagamentos **PIX** via **Asaas API** (Geração de QR Code e chave Copia/Cola)
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

### 💳 Integração com Gateway de Pagamento (Asaas)

O checkout do carrinho foi integrado a uma API Node/Express rodando do lado do servidor via ambiente Sandbox do [Asaas](https://www.asaas.com/).  
Ao finalizar a compra:
1. O Front-end interage com o backend local do projeto.
2. O servidor cria um "Cliente Acadêmico" na API de Sandbox do Asaas e gera uma fatura modelo **PIX**.
3. A interface do Angular é instantaneamente comutada para um **Layout de Sucesso de Pagamento** contendo o QR Code visual gerado pela API para escaneamento, juntamente da chave de *Copia e Cola* mapeada para o fluxo de transferências do usuário.

---

## 🧪 Testes Unitários

O projeto conta com testes unitários utilizando **Jasmine + Karma**.
<br>
A cobertura dos testes unitários foram configuradas para garantir uma cobertura mínima de **80%**. Aqui estão os resultados dos testes até o momento:  

![image](https://github.com/user-attachments/assets/f0371ea9-f370-4f42-9b59-c239317d5659)


---

## 📦 Como Rodar Localmente

### 1. Frontend (Aplicação Angular)

```bash
# Clone o repositório
git clone https://github.com/PauloCatto/capputeeno.git

# Acesse a pasta do projeto
cd capputeeno

# Instale todas as dependências
npm install

# Inicie o servidor de desenvolvimento
ng serve -o
```

> **Nota:** O comando `ng serve -o` irá compilar a aplicação e abri-la automaticamente no seu navegador padrão em `http://localhost:4200/`.

---

### 2. Backend (Integração e API)

Para que a loja exiba os produtos e o ambiente de pagamentos PIX funcione corretamente, certifique-se de iniciar a API Backend em conjunto:

```bash
# Clone o repositório da API
git clone https://github.com/PauloCatto/API-Capputeeno.git

# Acesse a pasta do backend
cd API-Capputeeno

# Instale as dependências
npm install

# Inicie o servidor
npm start
```
