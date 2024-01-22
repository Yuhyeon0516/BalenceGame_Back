# BalanceGame_Backend

사용자가 참여하는 밸런스게임 토이 프로젝트.

프론트엔드의 경우 React를 이용하여 구현하였고, 백엔드의 경우 NestJS를 이용하여 구현하였다.

-   프론트엔드: [박재현](https://github.com/jh0152park)
-   백엔드: [김유현(나)](https://github.com/Yuhyeon0516)

토이 프로젝트의 기획을 확인해보면 백엔드에서 구현이 필요한 항목은 아래와 같다.

-   User
    -   회원가입
    -   로그인
    -   로그아웃
    -   마이페이지
    -   Naver 로그인
    -   Kakao 로그인
-   Game
    -   게임 만들기
    -   모든 게임 조회
    -   카테고리별 게임 조회
    -   게임에 댓글 작성
    -   어떤 선택지가 더 나은지 선택하는 투표
    -   게임 좋아요 기능
    -   게임 싫어요 기능

그래서 아래와 같이 route를 기획하였다.

-   Swagger(`/api-docs`)
-   User(`/auth`)
    |기능|Path|
    |------|---|
    |회원가입|`/signup`|
    |로그인|`/signin`|
    |로그아웃|`/signout`|
    |마이페이지|`/my`|
    |닉네임변경|`/nickname`|
    |네이버로그인|`/social/naver`|
    |카카오로그인|`/social/kakao`|

-   Game(`/games`)
    |기능|Path|
    |------|---|
    |게임 만들기|`/create`|
    |모든 게임 조회|`/`|
    |카테고리별 게임 조회|`{category}`|
    |게임에 댓글 작성|`/{gamesId}/comment`|
    |어떤 선택지가 더 나은지 선택하는 투표|`/{gamesId}/select`|
    |게임 좋아요 기능|`/{gamesId}/like`|
    |게임 싫어요 기능|`/{gamesId}/dislike`|

배포는 AWS EC2를 이용하고 DB는 AWS RDS에 PostgreSQL를 이용하였다.

# AWS 배포

-   배포 간 참고자료

    -   https://velog.io/@mintmin0320/Nest.js-%EC%84%9C%EB%B2%84-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B02-%ED%84%B0%EB%AF%B8%EB%84%90%EC%97%90%EC%84%9C-%EC%84%9C%EB%B2%84-%EC%8B%A4%ED%96%89%ED%95%98%EA%B8%B0
    -   https://velog.io/@kangukii97/NestJS-EC2-%ED%94%84%EB%A6%AC%ED%8B%B0%EC%96%B4-%EB%B0%B0%ED%8F%AC-%EA%B3%BC%EC%A0%95
    -   https://velog.io/@jsi06138/PM2%EB%A1%9C-%EB%AC%B4%EC%A4%91%EB%8B%A8-%EB%B0%B0%ED%8F%AC-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0
    -   https://mark340.tistory.com/50
    -   https://blog.naver.com/gi_balja/223037996328
    -   https://muyeon95.tistory.com/253
    -   https://muyeon95.tistory.com/196
    -   https://velog.io/@miro7923/AWS-EC2-%EC%84%9C%EB%B2%84-%EB%8F%84%EB%A9%94%EC%9D%B8-%EC%97%86%EC%9D%B4-https-%EB%B6%99%EC%9D%B4%EA%B8%B0
    -   https://velog.io/@server30sopt/AWS-AWS-rds-postgreSQL-%ED%99%98%EA%B2%BD%EC%84%B8%ED%8C%85
    -   https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html#UsingWithRDS.SSL.CertificatesAllRegions
    -   https://caddyserver.com/docs

-   현재 해당 포트에 활성화 된 서비스`sudo lsof -i :80`
-   Caddy 실행 전 Nginx stop 필요 `sudo service nginx stop`

# Social Login 구현 간 참고자료

-   Naver Developer : https://developers.naver.com
-   Kakao Developer : https://developers.kakao.com
-   https://systorage.tistory.com/entry/Nestjs-Nestjs에서-소셜로그인을-구현하는-방법-featNaver
-   https://elfinlas.github.io/nest_js/230404_naver_login_part01/
-   https://github.com/2n-snails/nest-back/blob/main/src/auth/auth.service.ts
-   https://velog.io/@soshin_dev/ERRHTTPHEADERSSENT-Cannot-set-headers-after-they-are-sent-to-the-client-오류

# CI/CD 적용

-   지금은 배포를 할때마다 EC2 ssh console에서 git pull -> npm run build -> pm2 reload \<app name>을 진행하고있음
-   변경점이 발생할때마다 이걸 반복하자니 너무 번거로움
-   그래서 Github Actions + EC2 + S3 + Code Deploy를 모두 활용하여 CI/CD를 구현해보려한다.
    -   Jenkins를 이용해보려고 했으나 Jenkins를 이용하면 EC2를 하나 더 추가 구성해주어야해서 S3도 한번 사용해볼겸 EC2 + S3 조합으로 CI/CD를 구현해보려한다.
-   일단 먼저 해야하는것 Github main branch에 PR이 들어오면 .zip으로 업로드 될 S3 Bucket을 구성하는것이다.
