var router = require('express').Router();
const {
  v4: uuid
} = require('uuid');
//result--> col
function checkWinner(array, result, row) {
  return new Promise(async (resolve, reject) => {
    let currentPlayer = array[row][result];
    //logic for 4 in a vertical
    if (row <= 2 && array[row + 1][result] == currentPlayer && array[row + 2][result] == currentPlayer && array[row + 3][result] == currentPlayer)
      resolve(1);
    else {
      let i, j, count = 1;
      // Logic for 4 in a row horizontally
      for (i = result + 1; i < 7; i++) {
        if (array[row][i] != currentPlayer)
          break;
        count++;
      }
      for (i = result - 1; i >= 0; i--) {
        if (array[row][i] != currentPlayer)
          break;
        count++;
      }
      if (count >= 4)
        resolve(1);
      count = 1;
      //Check for up left and down right diagonally
      for (i = result + 1, j = row + 1; i < 7 && j < 6; i++, j++) {
        if (array[j][i] != currentPlayer)
          break;
        count++;
      }
      for (i = result - 1, j = row - 1; i >= 0 && j >= 0; i--, j--) {
        if (array[j][i] != currentPlayer)
          break;
        count++;
      }
      if (count >= 4)
        resolve(1);
      count = 1;
      //Check for down left and up right diagonally
      for (i = result + 1, j = row - 1; i < 7 && j >= 0; i++, j--) {
        if (array[j][i] != currentPlayer)
          break;
        count++;
      }
      for (i = result - 1, j = row + 1; i >= 0 && j < 6; i--, j++) {
        if (array[j][i] != currentPlayer)
          break;
        count++;
      }
      if (count >= 4)
        resolve(1);
    }
    resolve(0)
  });
}

function intitalizeArray(yelow, red, newCol, arrayNew, sessionId) {
  return new Promise(async (resolve, reject) => {
    let count = 1;
    for (inx in yelow) {
      let yellowCount = yelow.filter(function checkAdult(col) {
        return col == yelow[inx];
      });
      let redCount = red.filter(function checkAdult(col) {
        return col == yelow[inx];
      });
      let total = yellowCount.length + redCount.length;
      let row = 6 - total
      arrayNew[row][yelow[inx] - 1] = count;
    }
    count = 2
    for (jnx in red) {
      let yellowCount = yelow.filter(function checkAdult(col) {
        return col == red[jnx];
      });
      let redCount = red.filter(function checkAdult(col) {
        return col == red[jnx];
      });
      let total = yellowCount.length + redCount.length;
      let row = 6 - total
      arrayNew[row][red[jnx] - 1] = count;
    }
    let yellowCount = yelow.filter(function checkAdult(col) {
      return col == newCol
    });
    let redCount = red.filter(function checkAdult(col) {
      return col == newCol
    });
    let total = yellowCount.length + redCount.length;
    let row = 6 - total
    newCol = newCol - 1
    try {
      let newD = await db.models.match_data.findOneAndUpdate({
        sessionId: sessionId
      }, {
        array: arrayNew
      }, {
        new: true
      });
    } catch (err) {
      reject(err)
    }
    let win = await checkWinner(arrayNew, newCol, row)
    resolve(win);
  })
}

function isValid(yelow, red, newCol) {
  let valid = true;
  let yellowCount = yelow.filter(function checkAdult(col) {
    return col == newCol;
  });
  let redCount = red.filter(function checkAdult(col) {
    return col == newCol;
  });
  let total = yellowCount.length + redCount.length
  if (total > 5) {
    valid = false
  }
  return valid;
}
router.get('/', async function (req, res, next) {
  try {
    res.render('index', {
      title: '4 IN A Line!',
      site_title: "Gane",
    });
  } catch (err) {
    console.log("Error: In get details route");
    console.log(err);
  }
});

router.post('/match', async function (req, res, next) {
  try {
    let sessionId = uuid();
    let isYellow = (req.body.isYellow == "true" ? true : false);
    let newGame = (req.body.newGame == "true" ? true : false);
    let valid = true;
    let winner = 0;
    if (req.body.sessionId) {
      if (newGame) {
        await db.models.match_data.updateOne({
          sessionId: req.body.sessionId
        }, {
          array: [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]
          ],
          yellow: [],
          red: [],

        })
      }
      sessionId = req.body.sessionId;
      let matchData = await db.models.match_data.findOne({
        sessionId: sessionId
      })
      valid = await isValid(matchData.yellow, matchData.red, req.body.column)
      if (!valid) {
        return res.send({
          type: "success",
          sessionId: sessionId,
          isYellow: isYellow,
          valid: valid
        })
      }

      sessionId = req.body.sessionId
      let pushObj = {
        red: req.body.column
      }
      if (isYellow) {
        pushObj = {
          yellow: req.body.column
        }
      }
      let newData = await db.models.match_data.findOneAndUpdate({
        sessionId: sessionId
      }, {
        $push: pushObj
      }, {
        new: true
      });
      winner = await intitalizeArray(newData.yellow, newData.red, req.body.column, matchData.array, sessionId)

      res.send({
        type: "success",
        sessionId: sessionId,
        isYellow: (isYellow ? false : true),
        valid: valid,
        winner: winner
      })
    } else {
      let array = [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]
      ];
      array[5][req.body.column - 1] = 1;
      await db.models.match_data.create({
        sessionId: sessionId,
        yellow: [req.body.column],
        array: array
      });
      res.send({
        type: "success",
        sessionId: sessionId,
        isYellow: (isYellow ? false : true),
        valid: valid,
        winner: winner
      })
    }

  } catch (err) {
    console.log("Error: In POST match route");
    console.log(err);
    return res.send({
      type: "error"
    })
  }
});

module.exports = router;