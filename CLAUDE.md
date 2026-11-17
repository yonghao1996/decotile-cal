# 데코타일 수량 계산기

https://yonghao1996.github.io/decotile-cal/ — 예전 tile.shbom.com 계산기를 템바보드 계산기 방식으로 옮긴 것.
원본 `web/index.template.html` + 로직 `tile.js` (테스트 `tile.test.js`). 2026-11-17 템바보드 계산기 저장소에서 따로 떼어 냈다.

- 제품: **600 × 600mm 한 사이즈 (접착식·비접착식 동일)**, 낱장 판매. 치수 단위 **cm** (예전 계산기와 같게).
- 장수 = `올림(가로 × 세로 ÷ 3600)`. 손실분은 더하지 않는다 (2026-11-17). 시공면마다 올림한 뒤 같은 옵션끼리 합친다.
- 옵션: 1단 `데코타일` (`1. 접착식` 16색 / `2. 비접착식` 12색) · 2단 `색상`. 단가 = 기본 2,900 + 옵션가(0 / 500 / 700).
  스마트스토어 옵션 엑셀(2026-11-17)에서 옮겼다. 바뀌면 `tile.js` 의 `TILE_OPTIONS` / `TILE_BASE_PRICE` 만 고친다. 재고는 넣지 않는다.
- 출력: 주문 요약(스토어 옵션명) · 시공 정보 · 견적 · 엑셀 견적서(템바보드와 같은 양식 `quote-template.json`) ·
  톡톡으로 보내기(같은 톡톡) · 검수 링크(`#종류.색상.가로x세로~…`, 종류 a 접착식 / n 비접착식).

## 견적서 엑셀
- 양식 원본은 `web/quote-template/` (xlsx 를 푼 폴더). `node build.js` 가 `quote-template.json` 으로 묶는다.
  양식을 바꾸려면 `unzip -o 새양식.xlsx -d web/quote-template` 후 빌드. 템바보드 계산기와 같은 양식이다.
- 양식 품목 칸이 7줄뿐이라 8줄 넘으면 만들지 않고 알린다 (`quote-xlsx.js`).

## 배포
- GitHub Pages, 저장소 루트를 그대로 서빙. 페이지를 고치면 `node build.js` 로 `index.html` 을 다시 만든 뒤 커밋한다.
- 테스트: `node --test`
