user: {
email
password
nickname (중복방지 기능도 넣어야함)
createdAt
comments
createdGames
playedGames
}

game: {
gameId: number;
title: string;
description: string;
like: number;
dislike: number;
games:[
{
title: string;
description: string;
selectedCount: number;
selectedRatio: number;
},
{
title: string;
description: string;
selectedCount: number;
selectedRatio: number;
},
];
writer: User;
createdAt: Date;
comments: Comment[]
totalPlayer: number;
}
