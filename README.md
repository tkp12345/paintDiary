<h1 align="center">canvas diary
</h1>

****

## 실행
```typescript
    npm install
    npm run start
```

</br>

## 구현
>실행취소 , 다시실행 버튼
30개 제한 (사용자 Ux )
- 실행 취소시 캔버스를 비우고 마지막요소를 뺴고 다시그림
- 캔버스 스냅샷 기능을 이용하여 변경된 부분만 적용하기 
- OffscreenCanvas 를 이용해  스레드 분리하기 

>배경이미지 변경시 실행취소 , 다시실행 버튼 동작 무효화 

> 캔버스 영역 나갈시 이벤트 처리 

>이미지 업로드 개선 
>
 FileReader와 Image 객체 를 개선하여 
 이미지 로딩 최적화: createImageBitmap 사용하여  최적화된 방식으로 이미지를 처리 