var _ = require('lodash');

var io = require('./../../server').io;
var players = require('./../../server').players;
var rooms = require('./../../server').rooms;

var Lobby = require('./../lobby');
var Room = require('./../room');

var GameMain = require('./../game');
var GameVoting = require('./game_voting');
var GameEnding = require('./game_ending');

var startMission = exports.startMission = function(game){
  var leaderNo = game.info.leaderNo;
  var team = game.teams[leaderNo];
  var mission = {
    team: team,
    successDecisions: {},
  };
  _.each(team.members, function(playerId){
    var playerSocket = players.PtoS[playerId];
    playerSocket.on('C_submitDecision', function(data){
      var decision = data.decision;
      mission.successDecisions[playerId] = decision;

      //remove listener after decision - can be used once only
      delete playerSocket._events.C_submitDecision;
      if(Object.keys(mission.successDecisions).length === team.members.length){
        //all decisions received
        game.missions.push(mission);
        missionOutcome(game);
      }
    });
    //send player on mission
    playerSocket.emit('S_joinMission');
  });
};

var missionOutcome = exports.missionOutcome = function(game){
  var missionNo = game.info.missionNo;
  var mission = game.missions[missionNo];
  var failDecisionsCount = _.reduce(mission.successDecisions, function(memo, decision){
    return decision ? memo : memo + 1;
  }, 0);

  if(failDecisionsCount === 0){
    //mission success
    mission.success = true;
    game.info.successMissionTally++;
  }else{
    //mission fail
    mission.success = false;
    game.info.failMissionTally++;
  }

  if(game.info.successMissionTally > 0){
    //missions over; assassin kills
    GameEnding.assassinAction(game);
  }else if(game.info.failMissionTally > 1){
    //game over; evil wins
    game.results.goodWins = false;
    GameEnding.resolveGame(game);
  }else{
    //game on
    game.info.missionNo++;
    game.info.leaderNo++;

    GameMain.statusLogger(game);
    //next leader chooses team
    GameVoting.chooseTeam(game);    
  }

}
