import pandas as pd
from nba_api.stats.static import players
from nba_api.stats.endpoints import playercareerstats, teamyearbyyearstats, scoreboardv2
from flask import Flask, jsonify, request
from flask_cors import CORS


def get_live_scores():
    scoreboard_data = scoreboardv2.ScoreboardV2()
    return scoreboard_data.get_dict()

print(get_live_scores())