import * as _ from "lodash";
import { result } from "lodash";

export class Table {
  players = new Map<string, Player>();
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
    return this.players.get(name);
  }
  playersByRank(): Player[] {
    return _.sortBy(Array.from(this.players.values()), (p) => -p.points());
  }
  playersByEntry(): Player[] {
    return Array.from(this.players.values());
  }
  addPlayer(name: string) {
    if (this.players.has(name)) {
      throw "Player already exists";
    }
    this.players.set(
      name,
      new Player(name, this.onPlayerNameChange.bind(this))
    );
  }
  onPlayerNameChange(oldName: string, newName: string, player: Player) {
    this.players.delete(oldName);
    this.players.set(newName, player);
  }
  removePlayer(name: string) {
    this.players.delete(name);
  }
  clear() {
    this.players.clear();
  }
  replaceWith(otherTable: Table) {
    this.players = otherTable.players;
  }
}

export class Player {
  private _name: string;
  private readonly resultsByOpponent = new Map<Player, Result>();
  private readonly onNameChange: (
    oldName: string,
    newName: string,
    player: Player
  ) => void;

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
    onNameChange: (oldName: string, newName: string, player: Player) => void
  ) {
    this._name = name;
    this.onNameChange = onNameChange;
  }

  points() {
    return _.sumBy(Array.from(this.resultsByOpponent.values()), resultToPoints);
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
