export interface LeaderboardUser {
  Rank: number
  user_id: number
  username: string
  total_points: number
}

export interface LeaderboardResponse {
  status: string
  message: string
  data: LeaderboardUser[]
}