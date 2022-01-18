$(function () {
    let divCoins = $(".divCoins")
    let divSearch = $(".divSearch")
    let divReports = $(".divReports")
    let divAbout = $(".divAbout")
    let arrToggle = []
    function showCoins() {
        $.get("https://api.coingecko.com/api/v3/coins/list", function (list) {
            // Making the "coin cards"  
            for (let i = 0; i < 50; i++) {
                let card = $(`<div class="card card${i}"></div>`)
                card.append(`<h4 class="card-title">${list[i].symbol}</h4>`)
                card.append(`<label class="switch"><input class="toggle toggle${i}" type="checkbox"><span class="slider round"></span></label>`)
                card.append(`<p class="card-text">${list[i].name}</p>`)
                let btn = $(`<button class="btn btnMore" data-toggle="collapse" data-target="#info${i}">More Info</button>`)
                card.append(btn)
                //    Importing and Showing coins market value compared to usd,eur and ils
                $.get("https://api.coingecko.com/api/v3/coins/" + list[i].id, function (coin) {
                    btn.click(function (e) {
                        let collapse = $(`<div id="info${i}" class="collapse"></div>`)
                        collapse.append(`<i class="fa icon${i} fa-refresh fa-spin" style="font-size:24px"></i>`)
                        card.append(collapse)
                        if (coin.market_data.current_price.usd == undefined) {
                            $(`.icon${i}`).hide()
                            e.stopPropagation()
                            alert("There isn't more info")
                        }
                        // In case the coin dosen't exist in the Local Storage, the coin's info set on the Local Storage to 2 minutes
                        else if (localStorage.getItem(`info${i}`) === null) {
                            $.get("https://api.coingecko.com/api/v3/coins/" + list[i].id, function (coin) {
                                let objCollapse = {
                                    image: coin.image.thumb, usd: coin.market_data.current_price.usd,
                                    eur: coin.market_data.current_price.eur, ils: coin.market_data.current_price.ils
                                }
                                localStorage.setItem(`info${i}`, JSON.stringify(objCollapse))
                                let objLocal = JSON.parse(localStorage[`info${i}`])
                                collapse.append(`<p>USD: ${objLocal.usd}$</p>`)
                                collapse.append(`<p>EUR: ${objLocal.eur}€</p>`)
                                collapse.append(`<p>ILS: ${objLocal.ils}₪</p>`)
                                collapse.append(`<img src="${objLocal.image}">`)
                                card.append(collapse)
                                $(`.icon${i}`).hide()
                                setTimeout(function () {
                                    delete localStorage[`info${i}`]
                                }, 120 * 1000)
                            })
                        }
                        // In case the coin exist in the Local Storage, Importing the coin's info from it 
                        else if (`info${i}` in localStorage) {
                            let objLocal = JSON.parse(localStorage[`info${i}`])
                            collapse.append(`<p>USD: ${objLocal.usd}$</p>`)
                            collapse.append(`<p>EUR: ${objLocal.eur}€</p>`)
                            collapse.append(`<p>ILS: ${objLocal.ils}₪</p>`)
                            collapse.append(`<img src="${objLocal.image}">`)
                            card.append(collapse)
                            $(`.icon${i}`).hide()
                        }
                    })
                })
                divCoins.append(card)
            }
            // limiting the toggle's selections until the maximum of 5 coins 
            let counter = 0
            $(`.toggle`).click(function (e) {
                if (counter == 5 && e.target.checked == true) {
                    e.preventDefault()
                    let checking = []
                    divCoins.append(`<div class="modal"></div>`)
                    // Notificating the error when reached to the maxmisun selections, allowing exchange betweens coins selections
                    // or to cancel the selection
                    let modal = $(".modal")
                    modal.empty()
                    modal.append(`<h3 class="error">ERROR!</h3>`)
                    modal.append(`<p>please select up to 5 coins.</p>`)
                    modal.append(`<p>would you like to replace some of the coins?</p>`)
                    for (let i = 0; i < arrToggle.length; i++) {
                        modal.append(`<p class="info line${i}">${$(`.${arrToggle[i]}`).parent().prev().text()}</p>`)
                        modal.append(`<i class="fa fa-remove remove remove${i}"></i>`)
                    }
                    modal.append(`<button class="ok btn">OK</button>`)
                    modal.append(`<button class="cancel btn">Cancel</button>`)
                    modal.show()

                    for (let i = 0; i < arrToggle.length; i++) {
                        $(`.remove${i}`).click(function (e) {
                            checking.push(arrToggle[i])
                            e.target.remove()
                            $(`.line${i}`).remove()
                            counter--
                        })
                    }

                    $(".ok").click(function () {
                        if (checking.length) {
                            for (let k = 0; k < checking.length; k++) {
                                $(`.${checking[k]}`).prop("checked", false)
                                for (let x = 0; x < arrToggle.length; x++) {
                                    if (checking[k] == arrToggle[x]) {
                                        arrToggle.splice(x, 1)
                                    }
                                }
                            }
                            counter++
                            arrToggle.push(e.target.className.replace("toggle ", ""))
                            e.target.checked = true
                            modal.empty()
                            modal.hide()
                        }
                    })
                    $(".cancel").click(function (e) {
                        if (checking.length) {
                            for (let k = 0; k < checking.length; k++) {
                                $(`.${checking[k]}`).prop("checked", false)
                                for (let x = 0; x < arrToggle.length; x++) {
                                    if (checking[k] == arrToggle[x]) {
                                        arrToggle.splice(x, 1)
                                    }
                                }
                            }
                        }
                        modal.empty()
                        modal.hide()
                    })
                }
                // Checking if the click on the toggle is to close it ot to open it and counting the number of selections
                else if (counter == 4 && e.target.checked == false) {
                    counter--
                    for (let j = 0; j < arrToggle.length; j++) {
                        if (e.target.className.replace("toggle ", "") == arrToggle[j]) {
                            arrToggle.splice(j, 1)
                        }
                    }
                }
                else if (counter == 4 && e.target.checked == true) {
                    counter++
                    arrToggle.push(e.target.className.replace("toggle ", ""))
                }
                else if (e.target.checked == true) {
                    counter++
                    arrToggle.push(e.target.className.replace("toggle ", ""))
                }
                else {
                    counter--
                    for (let j = 0; j < arrToggle.length; j++) {
                        if (e.target.className.replace("toggle ", "") == arrToggle[j]) {
                            arrToggle.splice(j, 1)
                        }
                    }
                }
            })

            // Searching coins names and hiding the ones that aren't relevant
            let inputSearch = $(".inputSearch")
            let btnSearch = $(".btnSearch")
            btnSearch.click(function () {
                divCoins.hide()

                divAbout.hide()
                divReports.empty()
                divSearch.empty()
                divCoins.show()
                let findCard = 0
                if (inputSearch.val() == "") {
                    console.log("You must enter searching letters")
                }
                else {
                    for (let k = 0; k < $(".card").length; k++) {
                        if ((list[k].symbol).indexOf(inputSearch.val()) == -1) {
                            $(`.card${k}`).hide()
                        }
                        else {
                            findCard++
                        }
                    }
                    if (findCard == 0) {
                        divSearch.append(`<h3>there isn't coin in that name</h3>`)
                    }
                    // inputSearch.val("")
                }
            })
        })
    }
    localStorage.clear()
    divAbout.hide()
    // Operating the function of showing coins in the loading screen and the coins button
    showCoins()
    let btnCoins = $(".btnCoins")
    let btnReports = $(".btnReports")
    let btnAbout = $(".btnAbout")
    btnCoins.click(function () {
        divAbout.hide()
        divCoins.empty()
        divSearch.empty()
        divReports.empty()
        divCoins.show()
        showCoins()
    })
    btnReports.click(function () {
        divAbout.hide()
        divSearch.empty()
        divCoins.hide()
        divReports.empty()
        let arrCoins = []
        let data = []
        let datapoints = []
        if (!arrToggle.length) {
            divReports.append(`<h4>you didn't choose coins</h4>`)
        }
        else {
            // Creating a grapah with the choosen coins
            divReports.append(`<div id="chartContainer" style="height: 50%; width: 100%;"></div>`)
            for (let i = 0; i < arrToggle.length; i++) {
                arrCoins.push($(`.${arrToggle[i]}`).parent().prev().text())
                console.log(arrCoins)
            }
            for (let j = 0; j < arrCoins.length; j++) {
                datapoints[j] = { yValue: 0, arr: [] }
            }
            //   Defention of the lines in the grapah
            for (let j = 0; j < arrCoins.length; j++) {
                data.push({
                    type: "line",
                    xValueType: "dateTime",
                    yValueFormatString: "$#,##0.#####",
                    xValueFormatString: "hh:mm:ss",
                    showInLegend: true,
                    name: `${arrCoins[j]}`,
                    dataPoints: datapoints[j].arr
                })
            }
            // Grapah's settings
            let options = {
                title: {
                    text: `${arrCoins.join()} to USD`
                },
                axisY: {
                    title: "Coin Value",
                },
                toolTip: {
                    shared: true
                },
                legend: {
                    cursor: "pointer",
                    itemclick: toggleDataSeries
                },
                data: data
            }
            console.log($("#chartContainer"))
            let chart = $("#chartContainer").CanvasJSChart(options)

            function toggleDataSeries(e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false
                }
                else {
                    e.dataSeries.visible = true
                }
                e.chart.render()
            }
            // Stating the start value of the coin. if there is no info about the coin, it start and continue at 0
            for (let j = 0; j < arrCoins.length; j++) {
                let bigLetters = options.data[j].name.toUpperCase()
                $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${options.data[j].name}&tsyms=USD`, function (usd) {
                    if (usd.Response == "Error") {
                        datapoints[j].yValue = 0
                    }
                    else {
                        datapoints[j].yValue = usd[bigLetters].USD
                    }
                })
            }
            // The function import the new data of the coin to all the coins in the graph
            function refreshingValue(cell) {
                if (datapoints[cell].yValue == 0) {
                    datapoints[cell].yValue = 0
                }
                else {
                    let bigLetters = options.data[cell].name.toUpperCase()
                    $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${options.data[cell].name}&tsyms=USD`, function (usd) {
                        datapoints[cell].yValue = usd[bigLetters].USD
                    })
                }
            }

            let time = new Date
            let updateInterval = 2000
            // the function creating a new point on the line 
            function pushingPoint(cell) {
                datapoints[cell].arr.push({
                    x: time.getTime(),
                    y: datapoints[cell].yValue
                })
            }
            // the function updating the grapah every two secends
            function updateChart(count) {
                count = count || 1
                for (let i = 0; i < count; i++) {
                    time.setTime(time.getTime() + updateInterval)

                    if (datapoints.length == 1) {
                        refreshingValue(0)
                        pushingPoint(0)
                    }
                    else if (datapoints.length == 2) {
                        refreshingValue(0)
                        refreshingValue(1)
                        pushingPoint(0)
                        pushingPoint(1)
                    }
                    else if (datapoints.length == 3) {
                        refreshingValue(0)
                        refreshingValue(1)
                        refreshingValue(2)
                        pushingPoint(0)
                        pushingPoint(1)
                        pushingPoint(2)
                    }
                    else if (datapoints.length == 4) {
                        refreshingValue(0)
                        refreshingValue(1)
                        refreshingValue(2)
                        refreshingValue(3)
                        pushingPoint(0)
                        pushingPoint(1)
                        pushingPoint(2)
                        pushingPoint(3)
                    }
                    else if (datapoints.length == 5) {
                        refreshingValue(0)
                        refreshingValue(1)
                        refreshingValue(2)
                        refreshingValue(3)
                        refreshingValue(4)
                        pushingPoint(0)
                        pushingPoint(1)
                        pushingPoint(2)
                        pushingPoint(3)
                        pushingPoint(4)
                    }
                }
                chart.CanvasJSChart().render()
            }
            setInterval(function () { updateChart() }, updateInterval)
        }
        arrToggle = []
        arrCoins = []
        data = []

    })
    btnAbout.click(function () {
        divCoins.hide()
        divReports.empty()
        divSearch.empty()
        divAbout.show()
    })
})