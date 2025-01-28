const BASE_URL = 'https://api.football-data.org/v4';

export interface Match {
  date: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  status: "scheduled" | "finished";
}

export const fetchVascoMatches = async (apiKey: string): Promise<Match[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/teams/1769/matches?status=SCHEDULED,FINISHED`, // 1769 is Vasco's ID
      {
        headers: {
          'X-Auth-Token': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }

    const data = await response.json();
    
    return data.matches.map((match: any) => ({
      date: match.utcDate,
      competition: match.competition.name,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      homeScore: match.score.fullTime.home,
      awayScore: match.score.fullTime.away,
      status: match.status === 'FINISHED' ? 'finished' : 'scheduled',
    }));
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
};