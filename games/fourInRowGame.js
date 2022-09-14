class FIRG {
  constructor(host, guest) {
    this.fields = {
      // Format: COL/ROW
      //
      // Column 1
      10: " ",
      11: " ",
      12: " ",
      13: " ",
      14: " ",
      15: " ",
      // Column 2
      20: " ",
      21: " ",
      22: " ",
      23: " ",
      24: " ",
      25: " ",
      // Column 3
      30: " ",
      31: " ",
      32: " ",
      33: " ",
      34: " ",
      35: " ",
      // Column 4
      40: " ",
      41: " ",
      42: " ",
      43: " ",
      44: " ",
      45: " ",
      //Column 5
      50: " ",
      51: " ",
      52: " ",
      53: " ",
      54: " ",
      55: " ",
      // Column 6
      60: " ",
      61: " ",
      62: " ",
      63: " ",
      64: " ",
      65: " ",
      //Column 7
      70: " ",
      71: " ",
      72: " ",
      73: " ",
      74: " ",
      75: " ",
    };
    this.host = host;
    this.guest = guest;

    this.hostRep = "";
    this.guestRep = "";

    this.hostProfile = "";
    this.hostColor = "";
    this.guestProfile = "";
    this.guestColor = "";

    this.currentPlayer =
      Math.floor(Math.random() * 2) === 1 ? this.host : this.guest;

    this.winner = "";
    this.status = 1;
  }
  won(player) {
    this.status = 0;
    this.winner = player;
  }
  referee(check, player) {
    const allFields = [...Object.keys(this.fields)];

    // Check vertical

    const verticalFields = allFields.filter((fl) => {
      return fl[0] == String(check)[0];
    });
    const valuesV = [];
    verticalFields.forEach((fl) => {
      valuesV.push(this.fields[fl]);
    });
    valuesV.reduce((acc, el) => {
      if (el === player) {
        acc = acc + 1;
      } else {
        acc = 0;
      }
      // Check if player won
      if (acc >= 4) {
        this.won(player);
        acc = -999;
      }
      return acc;
    }, 0);

    // Check horizontal

    const horizontalFields = allFields.filter((fl) => {
      return fl[1] == String(check)[1];
    });
    const valuesH = [];
    horizontalFields.forEach((fl) => {
      valuesH.push(this.fields[fl]);
    });
    valuesH.reduce((acc, el) => {
      if (el === player) {
        acc = acc + 1;
      } else {
        acc = 0;
      }
      // Check if player won
      if (acc >= 4) {
        this.won(player);
        acc = -999;
      }
      return acc;
    }, 0);

    // Check /

    const checkStr = String(check);

    let rSlashFields = [];
    // To top right
    rSlashFields.push(`${check[0] * 1 + 5}${check[1] * 1 - 5}`);
    rSlashFields.push(`${check[0] * 1 + 4}${check[1] * 1 - 4}`);
    rSlashFields.push(`${check[0] * 1 + 3}${check[1] * 1 - 3}`);
    rSlashFields.push(`${check[0] * 1 + 2}${check[1] * 1 - 2}`);
    rSlashFields.push(`${check[0] * 1 + 1}${check[1] * 1 - 1}`);
    // Start
    rSlashFields.push(check);
    // To bottom left
    rSlashFields.push(`${check[0] * 1 - 1}${check[1] * 1 + 1}`);
    rSlashFields.push(`${check[0] * 1 - 2}${check[1] * 1 + 2}`);
    rSlashFields.push(`${check[0] * 1 - 3}${check[1] * 1 + 3}`);
    rSlashFields.push(`${check[0] * 1 - 4}${check[1] * 1 + 4}`);
    rSlashFields.push(`${check[0] * 1 - 5}${check[1] * 1 + 5}`);

    const valuesRS = [];
    rSlashFields.map((el) => {
      const fl = Number(el);
      valuesRS.push(this.fields[fl]);
    });

    valuesRS.reduce((acc, el) => {
      if (el === player) {
        acc = acc + 1;
      } else {
        acc = 0;
      }
      // Check if player won
      if (acc >= 4) {
        this.won(player);
        acc = -999;
      }
      return acc;
    }, 0);

    // Check \

    let lSlashFields = [];
    // To top right
    lSlashFields.push(`${Number(check[0]) - 5}${Number(check[1]) - 5}`);
    lSlashFields.push(`${Number(check[0]) - 4}${Number(check[1]) - 4}`);
    lSlashFields.push(`${Number(check[0]) - 3}${Number(check[1]) - 3}`);
    lSlashFields.push(`${Number(check[0]) - 2}${Number(check[1]) - 2}`);
    lSlashFields.push(`${Number(check[0]) - 1}${Number(check[1]) - 1}`);
    // Start
    lSlashFields.push(check);
    // To bottom left
    lSlashFields.push(`${Number(check[0]) + 1}${Number(check[1]) + 1}`);
    lSlashFields.push(`${Number(check[0]) + 2}${Number(check[1]) + 2}`);
    lSlashFields.push(`${Number(check[0]) + 3}${Number(check[1]) + 3}`);
    lSlashFields.push(`${Number(check[0]) + 4}${Number(check[1]) + 4}`);
    lSlashFields.push(`${Number(check[0]) + 5}${Number(check[1]) + 5}`);

    const valuesLS = [];
    lSlashFields.map((el) => {
      const fl = Number(el);
      valuesLS.push(this.fields[fl]);
    });

    valuesLS.reduce((acc, el) => {
      if (el === player) {
        acc = acc + 1;
      } else {
        acc = 0;
      }
      // Check if player won
      if (acc >= 4) {
        this.won(player);
        acc = -999;
      }
      return acc;
    }, 0);
  }
  markField(field, player) {
    // Check if game active
    if (this.status === 1) {
    } else return;

    const fields = this.fields;
    const column = [];

    // Check if user is in game
    if (player === this.host || player === this.guest) {
    } else return;
    // Check if users switching
    if (player === this.currentPlayer) {
    } else return;
    // Check if field is empty
    if (fields[field] === " ") {
      // Mark lowest field as user's
      Object.keys(fields).forEach((el) => {
        if (el[0] == String(field)[0] && fields[el] === " ") {
          column.push(el);
        }
      });
      fields[column[column.length - 1]] = player;
    } else return;
    // Switch players
    this.currentPlayer =
      this.host === this.currentPlayer ? this.guest : this.host;
    // Check if game ended
    this.referee(column[column.length - 1], player);
    return this.fields;
  }
  reset(player) {
    // Check if host is restarting
    if (player === this.host) {
      Object.keys(this.fields).forEach((el) => {
        this.fields[el] = " ";
      });
      this.lastPlayer = "";
      this.winner = "";
      this.status = 1;
    }
    return this.fields;
  }
  log() {
    return "Halo";
  }
}

module.exports = FIRG;

// Testing

// const testGame = new FIRG('Maciej', "Bolek")

// testGame.markField(30, 'Maciej')
// testGame.markField(50, 'Bolek')
// testGame.markField(10, 'Maciej')
// testGame.markField(50, 'Bolek')
// testGame.markField(30, 'Maciej')
// testGame.markField(50, 'Bolek')
// testGame.markField(40, 'Maciej')

// console.log(testGame.fields)
