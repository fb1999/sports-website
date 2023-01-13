const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema(
    {
        ranking : 
        {
            type : String
        },
        team : 
        {
            type:String
        },
        gamesPlayed : 
        {
            type : String
        },
        wins :
        {
            type: String
        },
        overtimeWin :
        {
            type : String
        },
        overtimeLoss : 
        {
            type:String
        },
        losses : 
        {
            type : String
        },
        goalsFor :
        {
            type: String
        },
        goalsAgainst :
        {
            type : String
        },
        diff : 
        {
            type : String
        },
        penalties :
        {
            type: String
        },
        points :
        {
            type : String
        },
    },
    {
      collection: "Stats"
    }
);

module.exports = mongoose.model("Stats", StatsSchema);