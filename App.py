# from nba_api.stats.static import players, teams
# from nba_api.stats.endpoints import playercareerstats, playerdashboardbyyearoveryear, teamyearbyyearstats, commonteamroster
# import pandas as pd
#
# pd.set_option('display.max_columns', None)
# pd.set_option('display.width',100)
#
# warriors = teams.find_team_name_by_id(1610612744)
# print(warriors)
# player = players.find_player_by_id(201939)
# print(player)
#
# career = playercareerstats.PlayerCareerStats(player_id=201939)
# print(career.get_data_frames()[0])
#
# stats = playerdashboardbyyearoveryear. PlayerDashboardByYearOverYear(player_id=201939)
# print(stats.get_data_frames()[0:3])
#
#
# team_stats = teamyearbyyearstats. TeamYearByYearStats(team_id=1610612744)
# print(team_stats.get_data_frames()[0])
#
# roster = commonteamroster. CommonTeamRoster(team_id=1610612744)
# print(roster.get_data_frames()[0])
#
# standings = leaguestandings. LeagueStandings(season="2024-25")
# print(standings.get_data_frames() [0])

from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats, teamyearbyyearstats, leagueleaders, leaguedashplayerstats 
from nba_api.live.nba.endpoints import scoreboard
from flask import Flask, jsonify
from flask_cors import CORS
import simplejson as json

app = Flask(__name__)
CORS(app)

@app.route("/player/<name>")
def get_player_stats(name):
    player_dict = players.find_players_by_full_name(name)
    player_id = player_dict[0]["id"]

    career_stats = playercareerstats.PlayerCareerStats(player_id=player_id)
    df = career_stats.get_data_frames()[0]
    return jsonify(df.to_dict(orient="records"))



# team stats
@app.route("/team_stats/<team_id>")
def get_team_stats(team_id):
    team_stats = teamyearbyyearstats.TeamYearByYearStats(team_id=team_id)
    stats_df = team_stats.get_data_frames()[0]
    
    func = jsonify(stats_df.to_dict(orient="records"))

    func = json.dumps(func, ignore_nan = True)
    return func

@app.route("/api/live_scores")
def get_live_scores():
    games = scoreboard.ScoreBoard()
    games_data = games.get_dict()

    live_scores = []

    for game in games_data["scoreboard"]["games"]:
        live_scores.append({
            "home_team": game["homeTeam"]["teamName"],
            "home_score": game["homeTeam"]["score"],
            "away_team": game["awayTeam"]["teamName"],
            "away_score": game["awayTeam"]["score"],
            "game_status": game["gameStatusText"]
        })
    return jsonify(live_scores)

@app.route("/api/stats_leaders/ppg")
def get_points_leaders():
    leaders = leagueleaders.LeagueLeaders(
        stat_category_abbreviation="PTS",
        season_type_all_star="Regular Season",
        per_mode48="PerGame"
    )
    df = leaders.get_data_frames()[0].head(5)
    results = []
    for _, row in df.iterrows():
        results. append({
            "player_name": row["PLAYER"],
            "team_name": row["TEAM"],
            "stat_value": f"{row['PTS']:.1f}"
        })

    return jsonify(results)

# rebounds
@app.route("/api/stats_leaders/rpg")
def get_rebounds_leaders():
    leaders = leagueleaders.LeagueLeaders(
        stat_category_abbreviation="REB",
        season_type_all_star="Regular Season",
        per_mode48="PerGame"
    )
    df = leaders.get_data_frames()[0].head(5)
    results = []
    for _, row in df.iterrows():
        results. append({
            "player_name": row["PLAYER"],
            "team_name": row["TEAM"],
            "stat_value": f"{row['REB']:.1f}"
        })

    return jsonify(results)
# assists
@app.route("/api/stats_leaders/apg")
def get_assists_leaders():
    leaders = leagueleaders.LeagueLeaders(
        stat_category_abbreviation="AST",
        season_type_all_star="Regular Season",
        per_mode48="PerGame"
    )
    df = leaders.get_data_frames()[0].head(5)
    results = []
    for _, row in df.iterrows():
        results. append({
            "player_name": row["PLAYER"],
            "team_name": row["TEAM"],
            "stat_value": f"{row['AST']:.1f}"
        })

    return jsonify(results)
# steals
@app.route("/api/stats_leaders/spg")
def get_steals_leaders():
    leaders = leagueleaders.LeagueLeaders(
        stat_category_abbreviation="STL",
        season_type_all_star="Regular Season",
        per_mode48="PerGame"
    )
    df = leaders.get_data_frames()[0].head(5)
    results = []
    for _, row in df.iterrows():
        results. append({
            "player_name": row["PLAYER"],
            "team_name": row["TEAM"],
            "stat_value": f"{row['STL']:.1f}"
        })

    return jsonify(results)
# blocks
@app.route("/api/stats_leaders/bpg")
def get_blocks_leaders():
    leaders = leagueleaders.LeagueLeaders(
        stat_category_abbreviation="BLK",
        season_type_all_star="Regular Season",
        per_mode48="PerGame"
    )
    df = leaders.get_data_frames()[0].head(5)
    results = []
    for _, row in df.iterrows():
        results. append({
            "player_name": row["PLAYER"],
            "team_name": row["TEAM"],
            "stat_value": f"{row['BLK']:.1f}"
        })

    return jsonify(results)
# fieldgoal
@app.route("/api/stats_leaders/fgp")
def get_fieldpct_leaders():
    leaders = leagueleaders.LeagueLeaders(
        stat_category_abbreviation="FG_PCT",
        season_type_all_star="Regular Season",
        per_mode48="PerGame"
    )
    df = leaders.get_data_frames()[0].head(5)
    results = []
    for _, row in df.iterrows():
        results. append({
            "player_name": row["PLAYER"],
            "team_name": row["TEAM"],
            "stat_value": f"{row['FG_PCT']:.1f}"
        })

    return jsonify(results)
# threepoint
@app.route("/api/stats_leaders/3fgp")
def get_field3pct_leaders():
    leaders = leagueleaders.LeagueLeaders(
        stat_category_abbreviation="FG3_PCT",
        season_type_all_star="Regular Season",
        per_mode48="PerGame"
    )
    df = leaders.get_data_frames()[0].head(5)
    results = []
    for _, row in df.iterrows():
        results. append({
            "player_name": row["PLAYER"],
            "team_name": row["TEAM"],
            "stat_value": f"{row['FG3_PCT']:.1f}"
        })
# freethrow
@app.route("/api/stats_leaders/ftpct")
def get_freethrows_leaders():
    leaders = leagueleaders.LeagueLeaders(
        stat_category_abbreviation="FT_PCT",
        season_type_all_star="Regular Season",
        per_mode48="PerGame"
    )
    df = leaders.get_data_frames()[0].head(5)
    results = []
    for _, row in df.iterrows():
        results. append({
            "player_name": row["PLAYER"],
            "team_name": row["TEAM"],
            "stat_value": f"{row['FT_PCT']:.1f}"
        })


@app.route("/api/stats_leaders/all")
def get_all_stats_leaders():
    stats = {
        "points": get_points_leaders()
    }
    results={}
    for key, value in stats.items():
        results[key] = value.json
    
    return jsonify(results)

if __name__== "__main__":
    app.run(debug=True)