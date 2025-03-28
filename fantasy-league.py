#Player Projections
#Player Trends
#Injury Updates


from nba_api.stats.endpoints import playerfantasyprofile, leaguedashplayerstats
from nba_api.stats.static import players
import pandas as pd

def get_profile(player_name):
    player_dict = players.find_players_by_full_name(player_name)
    player_id = player_dict[0]["id"]
    profile = playerfantasyprofile.PlayerFantasyProfile(
        player_id=player_id,
        season="2024-25"
    )
    df = profile.get_data_frames()
    result = {
        "player_name": player_name,
        "player_id": player_id

    }
    timeframes = ["season", "last_5", "last_10", "last_15"]
    for i, timeframe in enumerate(timeframes):
        if i <len(df) and not df[i].empty:
            df_temp = df[i]
            row=df_temp.iloc[0]

            result[timeframe] = {
                "games_played": int(row["GP"]),
                "fantasy_pts": float(row["NBA_FANTASY_PTS"]),
                "minutes": float(row["MIN"]),
                "points": float(row["PTS"]),
                "rebounds": float(row["REB"]),
                "assists": float(row["AST"]),
                "blocks": float(row["BLK"]),
                "turnovers": float(row["TOV"]),
            }
    if "last_5" in result and "last_15" in result:
        last_5_pts = result["last_5"]["fantasy_pts"]
        last_15_pts = result["last_15"]["fantasy_pts"]
        
        result["trend"] = "up" if last_5_pts > last_15_pts else "down"
        result["trend_value"] = round(last_5_pts - last_15_pts, 1)  
        return result 
    # print(df.head(5))

random = get_profile("Stephen Curry")
print(random)

def get_top_fantasy_players(limit = 50):
    stats = leaguedashplayerstats.LeagueDashPlayerStats(
        season="2024-25",
        per_mode_detailed="PerGame",
        measure_type_detailed_defense="Base"

    )
    df=stats.get_data_frames()[0]

    df=df.sort_values("NBA_FANTASY_PTS", ascending=False).head(limit)

    columns= ["PLAYER_NAME", "TEAM_ABBREVIATION", "AGE", "GP", "MIN", "PTS", "REB", "AST", "STL", "BLK", "TOV", "NBA_FANTASY_PTS", ] #fg3m, fg_pct, ft_pct

    return df[columns]

top_players = get_top_fantasy_players()
print(top_players.head())