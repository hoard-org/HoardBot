export type ValorantAccountData = {
  status: 200 | 404,
  message?: string,
  data?: {
    puuid: string,
    region: string,
    account_level: number,
    name: string,
    tag: string,
    card: {
      small: string,
      large: string,
      wide: string,
      id: string
    },
    last_update: string
  }
};

export type ValorantMmrData = {
  status: 200 | 404,
  message?: string,
  data?: {
    currenttier: number,
    currenttierpatched: string,
    ranking_in_tier: number,
    mmr_change_to_last_game: number,
    elo: number,
    name: string,
    tag: string,
    old: boolean
  }
};