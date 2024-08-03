<p align="center">
  <a href="https://www.medusajs.com">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    <img alt="Medusa logo" src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg">
    </picture>
  </a>
</p>
<h1 align="center">
  Medusa-Payment-Tosspayments
</h1>

<h4 align="center">
  <a href="https://docs.medusajs.com">Documentation</a> |
  <a href="https://www.medusajs.com">Website</a>
</h4>

## Feature

- 결제 승인
- [Medusa's Next.js starter storefront](https://docs.medusajs.com/starters/nextjs-medusa-starter)와 통합

### ⚠️ Under Development

- 결제위젯과 브랜드페이는 아직 지원하지 않습니다.
- 토스페이먼츠 API 버전은 2022-11-26만 지원하고 있습니다.
- 현재 카드 결제 방식만 지원하고 있습니다. (아래 표 참고)

| 결제 방식 | 카드 | 가상계좌 | 계좌이체 | 휴대폰 결제 | 상품권 | 해외 간편결제 |
| :-------: | :--: | :------: | :------: | :---------: | :----: | :-----------: |
| 지원 여부 |  ✅  |    🚫    |    🚫    |     🚫      |   🚫   |      🚫       |

## Prerequisites

- [Medusa backend](https://medusajs.com/)
- [토스페이먼츠 상점](https://www.tosspayments.com/)

## Installation

1. 아래 명령어를 통해 Medusa backend에 plugin을 설치해주세요.

```bash
npm install medusa-payment-tosspayments --save
```

2. 아래와 같이 환경 변수를 설정해주세요.

```env
TOSSPAYMENTS_DEBUG=true # 디버깅용 로그가 필요하지 않는 경우 false로 설정해주시면 됩니다.
TOSSPAYMENTS_KEY=<API 개발 연동 시크릿 키>
TOSSPAYMENTS_VERSION=2022-11-26
```

3. `medusa-config.js`의 plugins에 아래와 같이 설치한 `medusa-payment-tosspayments`를 추가해주세요.

```js
const plugins = [
  //...
  {
    resolve: "medusa-payment-tosspayments",
    options: {
      is_debug: process.env.TOSSPAYMENTS_DEBUG,
      tosspayments_key: process.env.TOSSPAYMENTS_KEY,
      tosspayments_version: process.env.TOSSPAYMENTS_VERSION,
    },
  },
  //...
];
```

## Client Side

[Medusa's Next.js starter storefront](https://docs.medusajs.com/starters/nextjs-medusa-starter) 에서 사용하는 기준으로 설명이 적혀있습니다.

1. 먼저 [`@tosspayments/tosspayments-sdk`](https://docs.tosspayments.com/sdk/v2/js)를 설치해주세요.

2. [React Context](https://react.dev/reference/react/createContext)를 생성하여 checkout 페이지에서 Tosspayments 인스턴스를 정상적으로 불러올 수 있도록 합니다.

3. action에서 payments 결제 승인을 위한 데이터를 주고 받기 위해 업데이트를 해줄 수 있는 함수를 생성합니다. 자세한 내용은 [Medusa Docs](https://docs.medusajs.com/api/store#carts_postcartscartpaymentsessionupdate)에서 확인해주세요.

4. Tosspayments 결제창을 실행할 수 있는 버튼을 생성합니다.

5. Admin 페이지에서 결제 수단에 tosspayments를 추가하고 버튼을 확인할 수 있습니다.

## Reference

- [TossPayments 결제 API SDK](https://github.com/yujutown/tosspayments-sdk.js)
- [medusa-payment-paystack](https://github.com/a11rew/medusa-payment-paystack/tree/main)
