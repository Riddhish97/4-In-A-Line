var game = function () {
    this.sessionId;
    this.isYellow = true;
    this.newGame = false;
    this.initialize = function () {
        this.newGame();
        this.sendColumData();
    };
    this.sendColumData = function () {
        $("#enter").on("click", function () {
            var l = Ladda.create(this);
            l.start();
            let column = $("#positionInput").val();
            if (!column) {
                toastr.error("Please enter cloumn digit", "Warning", {
                    progressBar: !0,
                    timeOut: 2e3,
                    showMethod: "slideDown",
                    hideMethod: "slideUp",
                });
            } else {
                column = parseInt(column);
                if (!isNaN(column) && column > 0 && column < 8) {
                    var url = '/match';
                    let obj = {
                        column: column,
                        isYellow: _this.isYellow,
                        newGame: _this.newGame
                    };
                    if (_this.sessionId) {
                        obj["sessionId"] = _this.sessionId
                    }
                    $.post(url, obj, function (response) {
                        l.stop();
                        _this.newGame = false;
                        $("#positionInput").val("");
                        if (response.type == 'success') {
                            $(`.ground`).css("background-color", "gray")
                            for (i = 0; i < 6; i++) {
                                for (j = 0; j < 7; j++) {
                                    if (response.mainArr[i][j] != 0) {
                                        let color = response.mainArr[i][j] == 1 ? "yellow" : "red";
                                        $(`#${i}${j}`).css("background-color", color)
                                    }
                                }
                            }
                            _this.sessionId = response.sessionId;
                            _this.isYellow = response.isYellow;
                            let move = "Red Move";
                            if (_this.isYellow) {
                                move = "Yellow Move";
                            }
                            if (response.valid) {
                                $("#detail").show();
                                $("#detail").removeClass("text-danger");
                                $("#detail").addClass("text-success");
                                $("#detail").text("Valid Move");
                                setTimeout(function () {
                                    $("#detail").hide();
                                }, 1000);
                            } else {
                                $("#detail").show();
                                $("#detail").removeClass("text-success");
                                $("#detail").addClass("text-danger");
                                $("#detail").text("Invalid Move! Choose different columen");
                                setTimeout(function () {
                                    $("#detail").hide();
                                }, 1000);
                            }
                            $("#turnName").text(move);
                            if (response.winner) {
                                move = "Yellow Winner";
                                if (_this.isYellow) {
                                    move = "Red Winner";
                                }
                                $("#turnName").addClass("text-success");
                                $("#turnName").text(move);
                                $("#positionInput").prop("disabled", true)
                                $("#enter").prop("disabled", true)
                            }
                        } else {
                            toastr.error("Oops! Reload Page", "Error", {
                                progressBar: !0,
                                timeOut: 2e3,
                                showMethod: "slideDown",
                                hideMethod: "slideUp",
                            });
                        }
                    })
                } else {
                    toastr.error("Please enter digit from 1 - 7", "Warning", {
                        progressBar: !0,
                        timeOut: 2e3,
                        showMethod: "slideDown",
                        hideMethod: "slideUp",
                    });
                }
            }
            return false;
        });
    };

    this.newGame = function () {
        $("#newGame").on("click", function () {
            $(`.ground`).css("background-color", "gray")
            _this.newGame = true;
            _this.isYellow = true;
            $("#turnName").removeClass("text-success");
            $("#turnName").text("Yellow Turn");
            $("#positionInput").prop("disabled", false)
            $("#enter").prop("disabled", false)
            $("#positionInput").val("");
            toastr.success("New Game Started!", "Let's Play", {
                progressBar: !0,
                timeOut: 2e3,
                showMethod: "slideDown",
                hideMethod: "slideUp",
            });
            return false;
        });
    };


    var _this = this;
    this.initialize();
};