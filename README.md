```typescript
User: {
    email: string;
    password: string;
    nickname: string;
    createdAt: Date;
    writedComments: Comment[];
    createdGames: Games[];
    playedGames: Games[];
}

Games: {
    gamesId: number;
    category: string;
    title: string;
    description: string;
    like: number;
    dislike: number;
    createdAt: Date;
    totalPlayer: number;
    writer: User;
    game: Game[];
    comment: Comment[];
}

Game: {
    gameId: number;
    title: string;
    description: string;
    selectedCount: number;
    selectedRatio: number;
}

Comment: {
    commentId: number;
    description: string;
    createdAt: Date;
    writer: User;
}
```
