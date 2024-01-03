import * as _ from "lodash";

const pointsForStandings = [12, 10, 8, 6, 5, 4, 3, 2, 1];

export class Table {
  players: Player[] = [];
  playersByName = new Map<string, Player>();

  static fromTableElement(tableElement: HTMLTableElement) {
    const table = new Table();
    const names = Array.from(
      tableElement.querySelectorAll("tr:not(:first-of-type) td:nth-of-type(2)")
    ).map((element, i) => element.textContent || "" + i);
    names.forEach((name) => table.addPlayer(name));
    names.forEach((name, i) => {
      const player = table.playerByName(name);
      const relevantResultElements = Array.from(
        tableElement.querySelectorAll(
          `tr:nth-of-type(${i + 2}) td:nth-of-type(n + 3)`
        )
      ).slice(i + 1, names.length);
      relevantResultElements
        .map((element) => element.textContent as Result)
        .forEach((result, j) => {
          const opp = table.playerByName(names[i + 1 + j])!;
          player?.setResult(opp, result);
        });
    });
    return table;
  }

  playerByName(name: string): Player | undefined {
    return this.playersByName.get(name);
  }

  playersByRank(): Player[] {
    return this.players;
  }

  playersByEntry(): Player[] {
    return Array.from(this.playersByName.values());
  }

  addPlayer(name: string) {
    if (this.playersByName.has(name)) {
      throw "Player already exists";
    }
    const newPlayer = new Player(
      name,
      this.onPlayerNameChange.bind(this),
      this.updateRanks.bind(this)
    );
    this.playersByName.set(name, newPlayer);
    this.players.push(newPlayer);
    this.updateRanks();
  }

  onPlayerNameChange(oldName: string, newName: string, player: Player) {
    this.playersByName.delete(oldName);
    this.playersByName.set(newName, player);
  }

  updateRanks() {
    const assignRank = (player: Player, i: number) => {
      const predecessor = this.players[i - 1];
      if (
        predecessor?.points() === player.points() &&
        predecessor?.sonnebornBerger() === player.sonnebornBerger()
      ) {
        player.rank = predecessor.rank;
      } else {
        player.rank = i + 1;
      }
    };
    const assignPointsForStandings = () => {
      const byRank: { [key: string]: Player[] } = _.groupBy(
        this.players,
        (player) => player.rank
      );
      _.forEach(byRank, (players, rank) => {
        const points =
          _.sum(
            _.range(+rank, +rank + players.length).map(
              (r) => pointsForStandings[r - 1] ?? _.last(pointsForStandings)
            )
          ) / players.length;
        players.forEach((p) => (p.pointsForStandings = points));
      });
    };

    this.players = _.orderBy(
      this.players,
      [(p) => p.points(), (p) => p.sonnebornBerger()],
      ["desc", "desc"]
    );
    this.players.forEach(assignRank);
    assignPointsForStandings();
  }

  clear() {
    this.players = [];
    this.playersByName.clear();
  }

  replaceWith(otherTable: Table) {
    this.playersByName = otherTable.playersByName;
    this.players = otherTable.players;
    this.players.forEach(p => p.updateRanks = this.updateRanks.bind(this))
    this.updateRanks();
  }
}

export class Player {
  _name: string;
  rank = 0;
  pointsForStandings = 0;
  readonly resultsByOpponent = new Map<Player, Result>();
  readonly onNameChange: (
    oldName: string,
    newName: string,
    player: Player
  ) => void;
  updateRanks: () => void;

  get name() {
    return this._name;
  }
  set name(name: string) {
    const oldName = this._name;
    this._name = name;
    this.onNameChange(oldName, name, this);
  }
  constructor(
    name: string,
    onNameChange: (oldName: string, newName: string, player: Player) => void,
    updateRanks: () => void
  ) {
    this._name = name;
    this.onNameChange = onNameChange;
    this.updateRanks = updateRanks;
  }

  points() {
    return _.sumBy(Array.from(this.resultsByOpponent.values()), resultToPoints);
  }

  numberOfGames() {
    return _.sumBy(Array.from(this.resultsByOpponent.values(), r => r ? 1 : 0))
  }

  sonnebornBerger() {
    return _.sum(
      Array.from(this.resultsByOpponent.entries()).map(([opp, result]) => {
        switch (result) {
          case Result.Draw:
            return opp.points() / 2;
          case Result.Win:
          case Result.ForfeitWin:
            return opp.points();
          default:
            return 0;
        }
      })
    );
  }

  setResult(opp: Player, result: Result) {
    this.resultsByOpponent.set(opp, result);
    opp.resultsByOpponent.set(this, invert(result));
    this.updateRanks();
  }

  resultByOpp(opponent: Player): Result {
    return this.resultsByOpponent.get(opponent) || Result.Missing;
  }
}

export enum Result {
  Win = "1",
  Loss = "0",
  Draw = "½",
  ForfeitWin = "+",
  ForfeitLoss = "-",
  Missing = "",
}

function resultToPoints(result: Result): number {
  switch (result) {
    case Result.Loss:
    case Result.ForfeitLoss:
    case Result.Missing:
      return 0;
    case Result.Draw:
      return 0.5;
    case Result.ForfeitWin:
    case Result.Win:
      return 1;
  }
}

function invert(result: Result): Result {
  switch (result) {
    case Result.Loss:
      return Result.Win;
    case Result.ForfeitLoss:
      return Result.ForfeitWin;
    case Result.Draw:
      return Result.Draw;
    case Result.ForfeitWin:
      return Result.ForfeitLoss;
    case Result.Win:
      return Result.Loss;
    case Result.Missing:
      return Result.Missing;
  }
}
